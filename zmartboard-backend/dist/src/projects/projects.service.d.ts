import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, CreateInvitationDto, InvitationResponseDto } from './dto';
import { ProjectRole, ProjectMember } from '@prisma/client';
type ProjectMembershipWithProject = ProjectMember & {
    project: {
        id: string;
        title: string;
    };
};
export declare class ProjectsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createProject(createProjectDto: CreateProjectDto, creatorId: string): Promise<{
        members: ({
            user: {
                id: string;
                role: import(".prisma/client").$Enums.UserRole;
                email: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.ProjectRole;
            userId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserProjects(userId: string): Promise<({
        members: ({
            user: {
                id: string;
                role: import(".prisma/client").$Enums.UserRole;
                email: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.ProjectRole;
            userId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getUserProjectMembership(userId: string, projectId: string): Promise<ProjectMembershipWithProject | null>;
    private verifyProjectRole;
    getProjectById(projectId: string, userId: string): Promise<({
        members: ({
            user: {
                id: string;
                role: import(".prisma/client").$Enums.UserRole;
                email: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.ProjectRole;
            userId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    updateProject(projectId: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<{
        members: ({
            user: {
                id: string;
                role: import(".prisma/client").$Enums.UserRole;
                email: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.ProjectRole;
            userId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteProject(projectId: string, userId: string): Promise<{
        message: string;
    }>;
    sendInvitation(projectId: string, invitationDto: CreateInvitationDto, userId: string): Promise<{
        project: {
            id: string;
            title: string;
            description: string | null;
        };
        sender: {
            id: string;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
        };
        receiver: {
            id: string;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.ProjectRole;
        projectId: string;
        status: import(".prisma/client").$Enums.InvitationStatus;
        expiresAt: Date;
        senderId: string;
        receiverId: string;
    }>;
    respondToInvitation(invitationId: string, response: InvitationResponseDto, userId: string): Promise<{
        project: {
            id: string;
            title: string;
            description: string | null;
        };
        sender: {
            id: string;
            email: string;
            username: string;
        };
        receiver: {
            id: string;
            email: string;
            username: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.ProjectRole;
        projectId: string;
        status: import(".prisma/client").$Enums.InvitationStatus;
        expiresAt: Date;
        senderId: string;
        receiverId: string;
    }>;
    getUserInvitations(userId: string): Promise<({
        project: {
            id: string;
            title: string;
            description: string | null;
        };
        sender: {
            id: string;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
        };
        receiver: {
            id: string;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.ProjectRole;
        projectId: string;
        status: import(".prisma/client").$Enums.InvitationStatus;
        expiresAt: Date;
        senderId: string;
        receiverId: string;
    })[]>;
    getProjectInvitations(projectId: string, userId: string): Promise<({
        sender: {
            id: string;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
        };
        receiver: {
            id: string;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.ProjectRole;
        projectId: string;
        status: import(".prisma/client").$Enums.InvitationStatus;
        expiresAt: Date;
        senderId: string;
        receiverId: string;
    })[]>;
    cancelInvitation(invitationId: string, userId: string): Promise<{
        message: string;
    }>;
    updateProjectMemberRole(projectId: string, memberId: string, newRole: ProjectRole, userId: string): Promise<{
        user: {
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.ProjectRole;
        userId: string;
        projectId: string;
    }>;
    removeProjectMember(projectId: string, memberId: string, userId: string): Promise<{
        message: string;
    }>;
    getAllProjects(userId: string): Promise<({
        members: ({
            user: {
                id: string;
                role: import(".prisma/client").$Enums.UserRole;
                email: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.ProjectRole;
            userId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
export {};
