import { ProjectRole } from '@prisma/client';
export declare class AddProjectMemberDto {
    userId: string;
    role?: ProjectRole;
}
export declare class UpdateProjectMemberRoleDto {
    role: ProjectRole;
}
