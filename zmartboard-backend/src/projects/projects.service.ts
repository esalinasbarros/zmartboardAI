import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, AddProjectMemberDto, CreateInvitationDto, InvitationResponseDto } from './dto';
import { UserRole, ProjectRole, User, Project, InvitationStatus, ProjectMember } from '@prisma/client';

// Type for project membership with project details
type ProjectMembershipWithProject = ProjectMember & {
  project: {
    id: string;
    title: string;
  };
};

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new project (only ADMIN, MODERATOR, or SUPER_ADMIN can create projects)
   */
  async createProject(createProjectDto: CreateProjectDto, creatorId: string) {
    // Get the creator user to check permissions
    const creator = await this.prisma.user.findUnique({
      where: { id: creatorId },
    });

    if (!creator) {
      throw new NotFoundException('User not found');
    }

    // Check if user has permission to create projects
    if (creator.role !== UserRole.ADMIN && creator.role !== UserRole.MODERATOR && creator.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only admins and moderators can create projects');
    }

    // Create project with creator as admin
    const project = await this.prisma.project.create({
      data: {
        title: createProjectDto.title,
        description: createProjectDto.description,
        members: {
          create: {
            userId: creatorId,
            role: ProjectRole.ADMIN,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return project;
  }

  /**
   * Get all projects for a user
   */
  async getUserProjects(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return projects;
  }

  /**
   * Get user's membership for a specific project
   */
  async getUserProjectMembership(userId: string, projectId: string): Promise<ProjectMembershipWithProject | null> {
    const membership = await this.prisma.projectMember.findFirst({
      where: {
        userId: userId,
        projectId: projectId,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return membership;
  }

  /**
   * Verify user has required project role
   */
  private verifyProjectRole(membership: ProjectMembershipWithProject | null, requiredRole: ProjectRole): void {
    if (!membership) {
      throw new ForbiddenException('You are not a member of this project');
    }

    if (requiredRole === ProjectRole.ADMIN && membership.role !== ProjectRole.ADMIN) {
      throw new ForbiddenException('Admin role required for this action');
    }
  }

  /**
   * Get a specific project by ID
   */
  async getProjectById(projectId: string, userId: string) {
    const membership = await this.getUserProjectMembership(userId, projectId);
    if (!membership) {
      throw new ForbiddenException('You are not a member of this project');
    }

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return project;
  }

  /**
   * Update project
   */
  async updateProject(
    projectId: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ) {
    const membership = await this.getUserProjectMembership(userId, projectId);
    this.verifyProjectRole(membership, ProjectRole.ADMIN);

    const project = await this.prisma.project.update({
      where: { id: projectId },
      data: updateProjectDto,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return project;
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: string, userId: string) {
    const membership = await this.getUserProjectMembership(userId, projectId);
    this.verifyProjectRole(membership, ProjectRole.ADMIN);

    await this.prisma.project.delete({
      where: { id: projectId },
    });

    return { message: 'Project deleted successfully' };
  }

  /**
   * Send invitation to join a project
   */
  async sendInvitation(
    projectId: string,
    invitationDto: CreateInvitationDto,
    userId: string,
  ) {
    const membership = await this.getUserProjectMembership(userId, projectId);
    this.verifyProjectRole(membership, ProjectRole.ADMIN);

    // Check if user to be invited exists
    const userToInvite = await this.prisma.user.findUnique({
      where: { email: invitationDto.email },
    });

    if (!userToInvite) {
      throw new NotFoundException('User with this email not found');
    }

    // Check if user is already a member
    const existingMembership = await this.prisma.projectMember.findFirst({
      where: {
        projectId: projectId,
        userId: userToInvite.id,
      },
    });

    if (existingMembership) {
      throw new ConflictException('User is already a member of this project');
    }

    // Check if there's already a pending invitation
    const existingInvitation = await this.prisma.projectInvitation.findFirst({
      where: {
        projectId: projectId,
        receiverId: userToInvite.id,
        status: InvitationStatus.PENDING,
      },
    });

    if (existingInvitation) {
      throw new ConflictException('User already has a pending invitation for this project');
    }

    // Create invitation with 7 days expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await this.prisma.projectInvitation.create({
      data: {
        projectId: projectId,
        senderId: userId,
        receiverId: userToInvite.id,
        role: invitationDto.role || ProjectRole.DEVELOPER,
        expiresAt: expiresAt,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        sender: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return invitation;
  }

  /**
   * Respond to a project invitation (accept or reject)
   */
  async respondToInvitation(
    invitationId: string,
    response: InvitationResponseDto,
    userId: string,
  ) {
    // Get the invitation
    const invitation = await this.prisma.projectInvitation.findUnique({
      where: { id: invitationId },
      include: {
        project: true,
        sender: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Check if the user is the receiver of the invitation
    if (invitation.receiverId !== userId) {
      throw new ForbiddenException('You can only respond to your own invitations');
    }

    // Check if invitation is still pending
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Invitation has already been responded to');
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      // Mark as expired
      await this.prisma.projectInvitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.EXPIRED },
      });
      throw new BadRequestException('Invitation has expired');
    }

    // Update invitation status
    const newStatus = response.response === 'accept' ? InvitationStatus.ACCEPTED : InvitationStatus.REJECTED;
    
    const updatedInvitation = await this.prisma.projectInvitation.update({
      where: { id: invitationId },
      data: { status: newStatus },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        sender: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });

    // If accepted, add user to project
    if (response.response === 'accept') {
      // Check if user is already a member (edge case)
      const existingMembership = await this.prisma.projectMember.findFirst({
        where: {
          projectId: invitation.projectId,
          userId: userId,
        },
      });

      if (!existingMembership) {
        await this.prisma.projectMember.create({
          data: {
            projectId: invitation.projectId,
            userId: userId,
            role: invitation.role,
          },
        });
      }
    }

    return updatedInvitation;
  }

  /**
   * Get user's received invitations
   */
  async getUserInvitations(userId: string) {
    const invitations = await this.prisma.projectInvitation.findMany({
      where: {
        receiverId: userId,
        status: InvitationStatus.PENDING,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        sender: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    this.logger.log(`User ${userId} received ${invitations.length} invitations`);
    return invitations;
  }

  /**
   * Get project invitations
   */
  async getProjectInvitations(projectId: string, userId: string) {
    const membership = await this.getUserProjectMembership(userId, projectId);
    this.verifyProjectRole(membership, ProjectRole.ADMIN);

    const invitations = await this.prisma.projectInvitation.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return invitations;
  }

  /**
   * Cancel/withdraw an invitation (only sender or project admin can cancel)
   */
  async cancelInvitation(invitationId: string, userId: string) {
    const invitation = await this.prisma.projectInvitation.findUnique({
      where: { id: invitationId },
      include: {
        project: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Check if user is the sender or project admin
    const isProjectAdmin = await this.prisma.projectMember.findFirst({
      where: {
        projectId: invitation.projectId,
        userId: userId,
        role: ProjectRole.ADMIN,
      },
    });

    if (invitation.senderId !== userId && !isProjectAdmin) {
      throw new ForbiddenException('Only the sender or project admin can cancel invitations');
    }

    // Check if invitation is still pending
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Can only cancel pending invitations');
    }

    await this.prisma.projectInvitation.delete({
      where: { id: invitationId },
    });

    return { message: 'Invitation cancelled successfully' };
  }

  /**
   * Update project member role
   */
  async updateProjectMemberRole(
    projectId: string,
    memberId: string,
    newRole: ProjectRole,
    userId: string,
  ) {
    const membership = await this.getUserProjectMembership(userId, projectId);
    this.verifyProjectRole(membership, ProjectRole.ADMIN);

    // Update member role
    const updatedMembership = await this.prisma.projectMember.update({
      where: { id: memberId },
      data: { role: newRole },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return updatedMembership;
  }

  /**
   * Remove a user from a project
   */
  async removeProjectMember(
    projectId: string,
    memberId: string,
    userId: string,
  ) {
    const membership = await this.getUserProjectMembership(userId, projectId);
    this.verifyProjectRole(membership, ProjectRole.ADMIN);

    // Get the membership to remove
    const membershipToRemove = await this.prisma.projectMember.findUnique({
      where: { id: memberId },
    });

    if (!membershipToRemove || membershipToRemove.projectId !== projectId) {
      throw new NotFoundException('Project member not found');
    }

    // Prevent removing the last admin
    if (membershipToRemove.role === ProjectRole.ADMIN) {
      const adminCount = await this.prisma.projectMember.count({
        where: {
          projectId: projectId,
          role: ProjectRole.ADMIN,
        },
      });

      if (adminCount <= 1) {
        throw new BadRequestException('Cannot remove the last admin from the project');
      }
    }

    await this.prisma.projectMember.delete({
      where: { id: memberId },
    });

    return { message: 'Member removed successfully' };
  }

  /**
   * Get all projects (for system admins)
   */
  async getAllProjects(userId: string) {
    // Check if user is system admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN)) {
      throw new ForbiddenException('Only system admins can view all projects');
    }

    const projects = await this.prisma.project.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return projects;
  }
}