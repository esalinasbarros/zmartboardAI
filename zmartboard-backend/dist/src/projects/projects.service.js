"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProjectsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProjectsService = ProjectsService_1 = class ProjectsService {
    prisma;
    logger = new common_1.Logger(ProjectsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProject(createProjectDto, creatorId) {
        const creator = await this.prisma.user.findUnique({
            where: { id: creatorId },
        });
        if (!creator) {
            throw new common_1.NotFoundException('User not found');
        }
        if (creator.role !== client_1.UserRole.ADMIN && creator.role !== client_1.UserRole.MODERATOR && creator.role !== client_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only admins and moderators can create projects');
        }
        const project = await this.prisma.project.create({
            data: {
                title: createProjectDto.title,
                description: createProjectDto.description,
                members: {
                    create: {
                        userId: creatorId,
                        role: client_1.ProjectRole.ADMIN,
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
    async getUserProjects(userId) {
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
    async getUserProjectMembership(userId, projectId) {
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
    verifyProjectRole(membership, requiredRole) {
        if (!membership) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        if (requiredRole === client_1.ProjectRole.ADMIN && membership.role !== client_1.ProjectRole.ADMIN) {
            throw new common_1.ForbiddenException('Admin role required for this action');
        }
    }
    async getProjectById(projectId, userId) {
        const membership = await this.getUserProjectMembership(userId, projectId);
        if (!membership) {
            throw new common_1.ForbiddenException('You are not a member of this project');
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
    async updateProject(projectId, updateProjectDto, userId) {
        const membership = await this.getUserProjectMembership(userId, projectId);
        this.verifyProjectRole(membership, client_1.ProjectRole.ADMIN);
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
    async deleteProject(projectId, userId) {
        const membership = await this.getUserProjectMembership(userId, projectId);
        this.verifyProjectRole(membership, client_1.ProjectRole.ADMIN);
        await this.prisma.project.delete({
            where: { id: projectId },
        });
        return { message: 'Project deleted successfully' };
    }
    async sendInvitation(projectId, invitationDto, userId) {
        const membership = await this.getUserProjectMembership(userId, projectId);
        this.verifyProjectRole(membership, client_1.ProjectRole.ADMIN);
        const userToInvite = await this.prisma.user.findUnique({
            where: { email: invitationDto.email },
        });
        if (!userToInvite) {
            throw new common_1.NotFoundException('User with this email not found');
        }
        const existingMembership = await this.prisma.projectMember.findFirst({
            where: {
                projectId: projectId,
                userId: userToInvite.id,
            },
        });
        if (existingMembership) {
            throw new common_1.ConflictException('User is already a member of this project');
        }
        const existingInvitation = await this.prisma.projectInvitation.findFirst({
            where: {
                projectId: projectId,
                receiverId: userToInvite.id,
                status: client_1.InvitationStatus.PENDING,
            },
        });
        if (existingInvitation) {
            throw new common_1.ConflictException('User already has a pending invitation for this project');
        }
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const invitation = await this.prisma.projectInvitation.create({
            data: {
                projectId: projectId,
                senderId: userId,
                receiverId: userToInvite.id,
                role: invitationDto.role || client_1.ProjectRole.DEVELOPER,
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
    async respondToInvitation(invitationId, response, userId) {
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
            throw new common_1.NotFoundException('Invitation not found');
        }
        if (invitation.receiverId !== userId) {
            throw new common_1.ForbiddenException('You can only respond to your own invitations');
        }
        if (invitation.status !== client_1.InvitationStatus.PENDING) {
            throw new common_1.BadRequestException('Invitation has already been responded to');
        }
        if (new Date() > invitation.expiresAt) {
            await this.prisma.projectInvitation.update({
                where: { id: invitationId },
                data: { status: client_1.InvitationStatus.EXPIRED },
            });
            throw new common_1.BadRequestException('Invitation has expired');
        }
        const newStatus = response.response === 'accept' ? client_1.InvitationStatus.ACCEPTED : client_1.InvitationStatus.REJECTED;
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
        if (response.response === 'accept') {
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
    async getUserInvitations(userId) {
        const invitations = await this.prisma.projectInvitation.findMany({
            where: {
                receiverId: userId,
                status: client_1.InvitationStatus.PENDING,
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
    async getProjectInvitations(projectId, userId) {
        const membership = await this.getUserProjectMembership(userId, projectId);
        this.verifyProjectRole(membership, client_1.ProjectRole.ADMIN);
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
    async cancelInvitation(invitationId, userId) {
        const invitation = await this.prisma.projectInvitation.findUnique({
            where: { id: invitationId },
            include: {
                project: true,
            },
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        const isProjectAdmin = await this.prisma.projectMember.findFirst({
            where: {
                projectId: invitation.projectId,
                userId: userId,
                role: client_1.ProjectRole.ADMIN,
            },
        });
        if (invitation.senderId !== userId && !isProjectAdmin) {
            throw new common_1.ForbiddenException('Only the sender or project admin can cancel invitations');
        }
        if (invitation.status !== client_1.InvitationStatus.PENDING) {
            throw new common_1.BadRequestException('Can only cancel pending invitations');
        }
        await this.prisma.projectInvitation.delete({
            where: { id: invitationId },
        });
        return { message: 'Invitation cancelled successfully' };
    }
    async updateProjectMemberRole(projectId, memberId, newRole, userId) {
        const membership = await this.getUserProjectMembership(userId, projectId);
        this.verifyProjectRole(membership, client_1.ProjectRole.ADMIN);
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
    async removeProjectMember(projectId, memberId, userId) {
        const membership = await this.getUserProjectMembership(userId, projectId);
        this.verifyProjectRole(membership, client_1.ProjectRole.ADMIN);
        const membershipToRemove = await this.prisma.projectMember.findUnique({
            where: { id: memberId },
        });
        if (!membershipToRemove || membershipToRemove.projectId !== projectId) {
            throw new common_1.NotFoundException('Project member not found');
        }
        if (membershipToRemove.role === client_1.ProjectRole.ADMIN) {
            const adminCount = await this.prisma.projectMember.count({
                where: {
                    projectId: projectId,
                    role: client_1.ProjectRole.ADMIN,
                },
            });
            if (adminCount <= 1) {
                throw new common_1.BadRequestException('Cannot remove the last admin from the project');
            }
        }
        await this.prisma.projectMember.delete({
            where: { id: memberId },
        });
        return { message: 'Member removed successfully' };
    }
    async getAllProjects(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || (user.role !== client_1.UserRole.ADMIN && user.role !== client_1.UserRole.SUPER_ADMIN)) {
            throw new common_1.ForbiddenException('Only system admins can view all projects');
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
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = ProjectsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map