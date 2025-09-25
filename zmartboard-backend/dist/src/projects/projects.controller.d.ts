import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, UpdateProjectMemberRoleDto, CreateInvitationDto, InvitationResponseDto } from './dto';
import { AuthenticatedRequest } from '../types/authenticated-request.type';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    createProject(createProjectDto: CreateProjectDto, req: AuthenticatedRequest): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }>;
    getUserProjects(req: AuthenticatedRequest): Promise<({
        members: ({
            user: {
                id: string;
                email: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    })[]>;
    getAllProjects(req: AuthenticatedRequest): Promise<({
        members: ({
            user: {
                id: string;
                email: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    })[]>;
    getProjectById(id: string, req: AuthenticatedRequest): Promise<({
        members: ({
            user: {
                id: string;
                email: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }) | null>;
    updateProject(id: string, updateProjectDto: UpdateProjectDto, req: AuthenticatedRequest): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }>;
    deleteProject(id: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    sendInvitation(id: string, invitationDto: CreateInvitationDto, req: AuthenticatedRequest): Promise<{
        project: {
            id: string;
            description: string | null;
            title: string;
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
        role: import(".prisma/client").$Enums.ProjectRole;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        status: import(".prisma/client").$Enums.InvitationStatus;
        expiresAt: Date;
        senderId: string;
        receiverId: string;
    }>;
    getProjectInvitations(id: string, req: AuthenticatedRequest): Promise<({
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
        role: import(".prisma/client").$Enums.ProjectRole;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        status: import(".prisma/client").$Enums.InvitationStatus;
        expiresAt: Date;
        senderId: string;
        receiverId: string;
    })[]>;
    getUserInvitations(req: AuthenticatedRequest): Promise<({
        project: {
            id: string;
            description: string | null;
            title: string;
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
        role: import(".prisma/client").$Enums.ProjectRole;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        status: import(".prisma/client").$Enums.InvitationStatus;
        expiresAt: Date;
        senderId: string;
        receiverId: string;
    })[]>;
    respondToInvitation(invitationId: string, response: InvitationResponseDto, req: AuthenticatedRequest): Promise<{
        project: {
            id: string;
            description: string | null;
            title: string;
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
        role: import(".prisma/client").$Enums.ProjectRole;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        status: import(".prisma/client").$Enums.InvitationStatus;
        expiresAt: Date;
        senderId: string;
        receiverId: string;
    }>;
    cancelInvitation(invitationId: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    updateProjectMemberRole(id: string, memberId: string, updateRoleDto: UpdateProjectMemberRoleDto, req: AuthenticatedRequest): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        role: import(".prisma/client").$Enums.ProjectRole;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        projectId: string;
    }>;
    removeProjectMember(id: string, memberId: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
}
