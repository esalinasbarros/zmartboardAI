"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendInvitationResponse403 = exports.SendInvitationResponse201 = exports.SendInvitationBody = exports.SendInvitationParam = exports.SendInvitationOperation = exports.RemoveProjectMemberResponse400 = exports.RemoveProjectMemberResponse404 = exports.RemoveProjectMemberResponse403 = exports.RemoveProjectMemberResponse200 = exports.RemoveProjectMemberParamMemberId = exports.RemoveProjectMemberParamId = exports.RemoveProjectMemberOperation = exports.UpdateProjectMemberRoleResponse404 = exports.UpdateProjectMemberRoleResponse403 = exports.UpdateProjectMemberRoleResponse200 = exports.UpdateProjectMemberRoleBody = exports.UpdateProjectMemberRoleParamMemberId = exports.UpdateProjectMemberRoleParamId = exports.UpdateProjectMemberRoleOperation = exports.AddProjectMemberResponse409 = exports.AddProjectMemberResponse404 = exports.AddProjectMemberResponse403 = exports.AddProjectMemberResponse201 = exports.AddProjectMemberBody = exports.AddProjectMemberParam = exports.AddProjectMemberOperation = exports.DeleteProjectResponse404 = exports.DeleteProjectResponse403 = exports.DeleteProjectResponse200 = exports.DeleteProjectParam = exports.DeleteProjectOperation = exports.UpdateProjectResponse404 = exports.UpdateProjectResponse403 = exports.UpdateProjectResponse200 = exports.UpdateProjectBody = exports.UpdateProjectParam = exports.UpdateProjectOperation = exports.GetProjectByIdResponse404 = exports.GetProjectByIdResponse200 = exports.GetProjectByIdParam = exports.GetProjectByIdOperation = exports.GetAllProjectsResponse403 = exports.GetAllProjectsResponse200 = exports.GetAllProjectsOperation = exports.GetUserProjectsResponse200 = exports.GetUserProjectsOperation = exports.CreateProjectResponse403 = exports.CreateProjectResponse201 = exports.CreateProjectBody = exports.CreateProjectOperation = void 0;
exports.CancelInvitationResponse400 = exports.CancelInvitationResponse404 = exports.CancelInvitationResponse403 = exports.CancelInvitationResponse200 = exports.CancelInvitationParam = exports.CancelInvitationOperation = exports.RespondToInvitationResponse400 = exports.RespondToInvitationResponse404 = exports.RespondToInvitationResponse403 = exports.RespondToInvitationResponse200 = exports.RespondToInvitationBody = exports.RespondToInvitationParam = exports.RespondToInvitationOperation = exports.GetUserInvitationsResponse200 = exports.GetUserInvitationsOperation = exports.GetProjectInvitationsResponse403 = exports.GetProjectInvitationsResponse200 = exports.GetProjectInvitationsParam = exports.GetProjectInvitationsOperation = exports.SendInvitationResponse409 = exports.SendInvitationResponse404 = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const dto_1 = require("./dto");
const client_2 = require("@prisma/client");
exports.CreateProjectOperation = (0, swagger_1.ApiOperation)({ summary: 'Create a new project (Admin/Moderator only)' });
exports.CreateProjectBody = (0, swagger_1.ApiBody)({ type: dto_1.CreateProjectDto });
exports.CreateProjectResponse201 = (0, swagger_1.ApiResponse)({
    status: 201,
    description: 'Project created successfully',
    schema: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            members: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        role: { type: 'string', enum: Object.values(client_1.ProjectRole) },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                email: { type: 'string' },
                                username: { type: 'string' },
                                firstName: { type: 'string' },
                                lastName: { type: 'string' },
                            },
                        },
                    },
                },
            },
        },
    },
});
exports.CreateProjectResponse403 = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' });
exports.GetUserProjectsOperation = (0, swagger_1.ApiOperation)({ summary: 'Get all projects for the authenticated user' });
exports.GetUserProjectsResponse200 = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'User projects retrieved successfully',
    schema: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                members: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            role: { type: 'string', enum: Object.values(client_1.ProjectRole) },
                            user: { type: 'object' },
                        },
                    },
                },
            },
        },
    },
});
exports.GetAllProjectsOperation = (0, swagger_1.ApiOperation)({ summary: 'Get all projects (System Admin only)' });
exports.GetAllProjectsResponse200 = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'All projects retrieved successfully',
});
exports.GetAllProjectsResponse403 = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' });
exports.GetProjectByIdOperation = (0, swagger_1.ApiOperation)({ summary: 'Get a specific project by ID' });
exports.GetProjectByIdParam = (0, swagger_1.ApiParam)({ name: 'id', description: 'Project ID' });
exports.GetProjectByIdResponse200 = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Project retrieved successfully',
});
exports.GetProjectByIdResponse404 = (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found or access denied' });
exports.UpdateProjectOperation = (0, swagger_1.ApiOperation)({ summary: 'Update a project (Project Admin only)' });
exports.UpdateProjectParam = (0, swagger_1.ApiParam)({ name: 'id', description: 'Project ID' });
exports.UpdateProjectBody = (0, swagger_1.ApiBody)({ type: dto_1.UpdateProjectDto });
exports.UpdateProjectResponse200 = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Project updated successfully',
});
exports.UpdateProjectResponse403 = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - only project admins can update' });
exports.UpdateProjectResponse404 = (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' });
exports.DeleteProjectOperation = (0, swagger_1.ApiOperation)({ summary: 'Delete a project (Project Admin only)' });
exports.DeleteProjectParam = (0, swagger_1.ApiParam)({ name: 'id', description: 'Project ID' });
exports.DeleteProjectResponse200 = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Project deleted successfully',
    schema: {
        type: 'object',
        properties: {
            message: { type: 'string' },
        },
    },
});
exports.DeleteProjectResponse403 = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - only project admins can delete' });
exports.DeleteProjectResponse404 = (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' });
exports.AddProjectMemberOperation = (0, swagger_1.ApiOperation)({ summary: 'Add a member to a project (Project Admin only)' });
exports.AddProjectMemberParam = (0, swagger_1.ApiParam)({ name: 'id', description: 'Project ID' });
exports.AddProjectMemberBody = (0, swagger_1.ApiBody)({ type: dto_1.AddProjectMemberDto });
exports.AddProjectMemberResponse201 = (0, swagger_1.ApiResponse)({
    status: 201,
    description: 'Member added successfully',
    schema: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            role: { type: 'string', enum: Object.values(client_1.ProjectRole) },
            user: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    username: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                },
            },
            project: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                },
            },
        },
    },
});
exports.AddProjectMemberResponse403 = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - only project admins can add members' });
exports.AddProjectMemberResponse404 = (0, swagger_1.ApiResponse)({ status: 404, description: 'User or project not found' });
exports.AddProjectMemberResponse409 = (0, swagger_1.ApiResponse)({ status: 409, description: 'User is already a member' });
exports.UpdateProjectMemberRoleOperation = (0, swagger_1.ApiOperation)({ summary: 'Update project member role (Project Admin only)' });
exports.UpdateProjectMemberRoleParamId = (0, swagger_1.ApiParam)({ name: 'id', description: 'Project ID' });
exports.UpdateProjectMemberRoleParamMemberId = (0, swagger_1.ApiParam)({ name: 'memberId', description: 'Project Member ID' });
exports.UpdateProjectMemberRoleBody = (0, swagger_1.ApiBody)({ type: dto_1.UpdateProjectMemberRoleDto });
exports.UpdateProjectMemberRoleResponse200 = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Member role updated successfully',
});
exports.UpdateProjectMemberRoleResponse403 = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - only project admins can update roles' });
exports.UpdateProjectMemberRoleResponse404 = (0, swagger_1.ApiResponse)({ status: 404, description: 'Member not found' });
exports.RemoveProjectMemberOperation = (0, swagger_1.ApiOperation)({ summary: 'Remove a member from a project (Project Admin only)' });
exports.RemoveProjectMemberParamId = (0, swagger_1.ApiParam)({ name: 'id', description: 'Project ID' });
exports.RemoveProjectMemberParamMemberId = (0, swagger_1.ApiParam)({ name: 'memberId', description: 'Project Member ID' });
exports.RemoveProjectMemberResponse200 = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Member removed successfully',
    schema: {
        type: 'object',
        properties: {
            message: { type: 'string' },
        },
    },
});
exports.RemoveProjectMemberResponse403 = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - only project admins can remove members' });
exports.RemoveProjectMemberResponse404 = (0, swagger_1.ApiResponse)({ status: 404, description: 'Member not found' });
exports.RemoveProjectMemberResponse400 = (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot remove the last admin' });
exports.SendInvitationOperation = (0, swagger_1.ApiOperation)({ summary: 'Send invitation to join project (Project Admin only)' });
exports.SendInvitationParam = (0, swagger_1.ApiParam)({ name: 'id', description: 'Project ID' });
exports.SendInvitationBody = (0, swagger_1.ApiBody)({ type: dto_1.CreateInvitationDto });
exports.SendInvitationResponse201 = (0, swagger_1.ApiResponse)({
    status: 201,
    description: 'Invitation sent successfully',
    schema: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            projectId: { type: 'string' },
            role: { type: 'string', enum: Object.values(client_1.ProjectRole) },
            status: { type: 'string', enum: Object.values(client_2.InvitationStatus) },
            expiresAt: { type: 'string', format: 'date-time' },
            project: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                },
            },
            sender: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    username: { type: 'string' },
                },
            },
            receiver: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    username: { type: 'string' },
                },
            },
        },
    },
});
exports.SendInvitationResponse403 = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - only project admins can send invitations' });
exports.SendInvitationResponse404 = (0, swagger_1.ApiResponse)({ status: 404, description: 'User or project not found' });
exports.SendInvitationResponse409 = (0, swagger_1.ApiResponse)({ status: 409, description: 'User already member or has pending invitation' });
exports.GetProjectInvitationsOperation = (0, swagger_1.ApiOperation)({ summary: 'Get project invitations (Project Admin only)' });
exports.GetProjectInvitationsParam = (0, swagger_1.ApiParam)({ name: 'id', description: 'Project ID' });
exports.GetProjectInvitationsResponse200 = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Project invitations retrieved successfully',
    schema: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                role: { type: 'string', enum: Object.values(client_1.ProjectRole) },
                status: { type: 'string', enum: Object.values(client_2.InvitationStatus) },
                expiresAt: { type: 'string', format: 'date-time' },
                createdAt: { type: 'string', format: 'date-time' },
                sender: { type: 'object' },
                receiver: { type: 'object' },
            },
        },
    },
});
exports.GetProjectInvitationsResponse403 = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - only project admins can view invitations' });
exports.GetUserInvitationsOperation = (0, swagger_1.ApiOperation)({ summary: 'Get user received invitations' });
exports.GetUserInvitationsResponse200 = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'User invitations retrieved successfully',
    schema: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                role: { type: 'string', enum: Object.values(client_1.ProjectRole) },
                status: { type: 'string', enum: Object.values(client_2.InvitationStatus) },
                expiresAt: { type: 'string', format: 'date-time' },
                project: { type: 'object' },
                sender: { type: 'object' },
            },
        },
    },
});
exports.RespondToInvitationOperation = (0, swagger_1.ApiOperation)({ summary: 'Respond to invitation (accept/reject)' });
exports.RespondToInvitationParam = (0, swagger_1.ApiParam)({ name: 'invitationId', description: 'Invitation ID' });
exports.RespondToInvitationBody = (0, swagger_1.ApiBody)({ type: dto_1.InvitationResponseDto });
exports.RespondToInvitationResponse200 = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Invitation response processed successfully',
});
exports.RespondToInvitationResponse403 = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - can only respond to own invitations' });
exports.RespondToInvitationResponse404 = (0, swagger_1.ApiResponse)({ status: 404, description: 'Invitation not found' });
exports.RespondToInvitationResponse400 = (0, swagger_1.ApiResponse)({ status: 400, description: 'Invitation expired or already responded' });
exports.CancelInvitationOperation = (0, swagger_1.ApiOperation)({ summary: 'Cancel/withdraw invitation (Sender or Project Admin only)' });
exports.CancelInvitationParam = (0, swagger_1.ApiParam)({ name: 'invitationId', description: 'Invitation ID' });
exports.CancelInvitationResponse200 = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Invitation cancelled successfully',
    schema: {
        type: 'object',
        properties: {
            message: { type: 'string' },
        },
    },
});
exports.CancelInvitationResponse403 = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - only sender or project admin can cancel' });
exports.CancelInvitationResponse404 = (0, swagger_1.ApiResponse)({ status: 404, description: 'Invitation not found' });
exports.CancelInvitationResponse400 = (0, swagger_1.ApiResponse)({ status: 400, description: 'Can only cancel pending invitations' });
//# sourceMappingURL=projects.swagger.js.map