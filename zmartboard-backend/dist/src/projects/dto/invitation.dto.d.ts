import { ProjectRole, InvitationStatus } from '@prisma/client';
export declare class CreateInvitationDto {
    email: string;
    role?: ProjectRole;
}
export declare class InvitationResponseDto {
    response: 'accept' | 'reject';
}
export declare class InvitationDto {
    id: string;
    projectId: string;
    projectTitle: string;
    sender: {
        id: string;
        username: string;
        email: string;
    };
    receiver: {
        id: string;
        username: string;
        email: string;
    };
    role: ProjectRole;
    status: InvitationStatus;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
