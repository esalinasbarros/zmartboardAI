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
    getUserProjects(req: AuthenticatedRequest): Promise<({
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
    getAllProjects(req: AuthenticatedRequest): Promise<({
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
    getProjectById(id: string, req: AuthenticatedRequest): Promise<({
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
    updateProject(id: string, updateProjectDto: UpdateProjectDto, req: AuthenticatedRequest): Promise<{
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
    deleteProject(id: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    sendInvitation(id: string, invitationDto: CreateInvitationDto, req: AuthenticatedRequest): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.ProjectRole;
        projectId: string;
        status: import(".prisma/client").$Enums.InvitationStatus;
        expiresAt: Date;
        senderId: string;
        receiverId: string;
    })[]>;
    getUserInvitations(req: AuthenticatedRequest): Promise<({
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
    respondToInvitation(invitationId: string, response: InvitationResponseDto, req: AuthenticatedRequest): Promise<{
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
    cancelInvitation(invitationId: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    updateProjectMemberRole(id: string, memberId: string, updateRoleDto: UpdateProjectMemberRoleDto, req: AuthenticatedRequest): Promise<{
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
    removeProjectMember(id: string, memberId: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
}
