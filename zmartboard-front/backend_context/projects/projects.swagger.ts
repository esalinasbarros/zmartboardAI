import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ProjectRole } from '@prisma/client';
import {
  CreateProjectDto,
  UpdateProjectDto,
  AddProjectMemberDto,
  UpdateProjectMemberRoleDto,
  CreateInvitationDto,
  InvitationResponseDto,
} from './dto';
import { InvitationStatus } from '@prisma/client';

// Create Project Decorators
export const CreateProjectOperation = ApiOperation({ summary: 'Create a new project (Admin/Moderator only)' });
export const CreateProjectBody = ApiBody({ type: CreateProjectDto });
export const CreateProjectResponse201 = ApiResponse({
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
            role: { type: 'string', enum: Object.values(ProjectRole) },
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
export const CreateProjectResponse403 = ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' });

// Get User Projects Decorators
export const GetUserProjectsOperation = ApiOperation({ summary: 'Get all projects for the authenticated user' });
export const GetUserProjectsResponse200 = ApiResponse({
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
              role: { type: 'string', enum: Object.values(ProjectRole) },
              user: { type: 'object' },
            },
          },
        },
      },
    },
  },
});

// Get All Projects Decorators
export const GetAllProjectsOperation = ApiOperation({ summary: 'Get all projects (System Admin only)' });
export const GetAllProjectsResponse200 = ApiResponse({
  status: 200,
  description: 'All projects retrieved successfully',
});
export const GetAllProjectsResponse403 = ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' });

// Get Project By ID Decorators
export const GetProjectByIdOperation = ApiOperation({ summary: 'Get a specific project by ID' });
export const GetProjectByIdParam = ApiParam({ name: 'id', description: 'Project ID' });
export const GetProjectByIdResponse200 = ApiResponse({
  status: 200,
  description: 'Project retrieved successfully',
});
export const GetProjectByIdResponse404 = ApiResponse({ status: 404, description: 'Project not found or access denied' });

// Update Project Decorators
export const UpdateProjectOperation = ApiOperation({ summary: 'Update a project (Project Admin only)' });
export const UpdateProjectParam = ApiParam({ name: 'id', description: 'Project ID' });
export const UpdateProjectBody = ApiBody({ type: UpdateProjectDto });
export const UpdateProjectResponse200 = ApiResponse({
  status: 200,
  description: 'Project updated successfully',
});
export const UpdateProjectResponse403 = ApiResponse({ status: 403, description: 'Forbidden - only project admins can update' });
export const UpdateProjectResponse404 = ApiResponse({ status: 404, description: 'Project not found' });

// Delete Project Decorators
export const DeleteProjectOperation = ApiOperation({ summary: 'Delete a project (Project Admin only)' });
export const DeleteProjectParam = ApiParam({ name: 'id', description: 'Project ID' });
export const DeleteProjectResponse200 = ApiResponse({
  status: 200,
  description: 'Project deleted successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
  },
});
export const DeleteProjectResponse403 = ApiResponse({ status: 403, description: 'Forbidden - only project admins can delete' });
export const DeleteProjectResponse404 = ApiResponse({ status: 404, description: 'Project not found' });

// Add Project Member Decorators
export const AddProjectMemberOperation = ApiOperation({ summary: 'Add a member to a project (Project Admin only)' });
export const AddProjectMemberParam = ApiParam({ name: 'id', description: 'Project ID' });
export const AddProjectMemberBody = ApiBody({ type: AddProjectMemberDto });
export const AddProjectMemberResponse201 = ApiResponse({
  status: 201,
  description: 'Member added successfully',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      role: { type: 'string', enum: Object.values(ProjectRole) },
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
export const AddProjectMemberResponse403 = ApiResponse({ status: 403, description: 'Forbidden - only project admins can add members' });
export const AddProjectMemberResponse404 = ApiResponse({ status: 404, description: 'User or project not found' });
export const AddProjectMemberResponse409 = ApiResponse({ status: 409, description: 'User is already a member' });

// Update Project Member Role Decorators
export const UpdateProjectMemberRoleOperation = ApiOperation({ summary: 'Update project member role (Project Admin only)' });
export const UpdateProjectMemberRoleParamId = ApiParam({ name: 'id', description: 'Project ID' });
export const UpdateProjectMemberRoleParamMemberId = ApiParam({ name: 'memberId', description: 'Project Member ID' });
export const UpdateProjectMemberRoleBody = ApiBody({ type: UpdateProjectMemberRoleDto });
export const UpdateProjectMemberRoleResponse200 = ApiResponse({
  status: 200,
  description: 'Member role updated successfully',
});
export const UpdateProjectMemberRoleResponse403 = ApiResponse({ status: 403, description: 'Forbidden - only project admins can update roles' });
export const UpdateProjectMemberRoleResponse404 = ApiResponse({ status: 404, description: 'Member not found' });

// Remove Project Member Decorators
export const RemoveProjectMemberOperation = ApiOperation({ summary: 'Remove a member from a project (Project Admin only)' });
export const RemoveProjectMemberParamId = ApiParam({ name: 'id', description: 'Project ID' });
export const RemoveProjectMemberParamMemberId = ApiParam({ name: 'memberId', description: 'Project Member ID' });
export const RemoveProjectMemberResponse200 = ApiResponse({
  status: 200,
  description: 'Member removed successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
  },
});
export const RemoveProjectMemberResponse403 = ApiResponse({ status: 403, description: 'Forbidden - only project admins can remove members' });
export const RemoveProjectMemberResponse404 = ApiResponse({ status: 404, description: 'Member not found' });
export const RemoveProjectMemberResponse400 = ApiResponse({ status: 400, description: 'Cannot remove the last admin' });

// Send Invitation Decorators
export const SendInvitationOperation = ApiOperation({ summary: 'Send invitation to join project (Project Admin only)' });
export const SendInvitationParam = ApiParam({ name: 'id', description: 'Project ID' });
export const SendInvitationBody = ApiBody({ type: CreateInvitationDto });
export const SendInvitationResponse201 = ApiResponse({
  status: 201,
  description: 'Invitation sent successfully',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      projectId: { type: 'string' },
      role: { type: 'string', enum: Object.values(ProjectRole) },
      status: { type: 'string', enum: Object.values(InvitationStatus) },
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
export const SendInvitationResponse403 = ApiResponse({ status: 403, description: 'Forbidden - only project admins can send invitations' });
export const SendInvitationResponse404 = ApiResponse({ status: 404, description: 'User or project not found' });
export const SendInvitationResponse409 = ApiResponse({ status: 409, description: 'User already member or has pending invitation' });

// Get Project Invitations Decorators
export const GetProjectInvitationsOperation = ApiOperation({ summary: 'Get project invitations (Project Admin only)' });
export const GetProjectInvitationsParam = ApiParam({ name: 'id', description: 'Project ID' });
export const GetProjectInvitationsResponse200 = ApiResponse({
  status: 200,
  description: 'Project invitations retrieved successfully',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        role: { type: 'string', enum: Object.values(ProjectRole) },
        status: { type: 'string', enum: Object.values(InvitationStatus) },
        expiresAt: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        sender: { type: 'object' },
        receiver: { type: 'object' },
      },
    },
  },
});
export const GetProjectInvitationsResponse403 = ApiResponse({ status: 403, description: 'Forbidden - only project admins can view invitations' });

// Get User Invitations Decorators
export const GetUserInvitationsOperation = ApiOperation({ summary: 'Get user received invitations' });
export const GetUserInvitationsResponse200 = ApiResponse({
  status: 200,
  description: 'User invitations retrieved successfully',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        role: { type: 'string', enum: Object.values(ProjectRole) },
        status: { type: 'string', enum: Object.values(InvitationStatus) },
        expiresAt: { type: 'string', format: 'date-time' },
        project: { type: 'object' },
        sender: { type: 'object' },
      },
    },
  },
});

// Respond to Invitation Decorators
export const RespondToInvitationOperation = ApiOperation({ summary: 'Respond to invitation (accept/reject)' });
export const RespondToInvitationParam = ApiParam({ name: 'invitationId', description: 'Invitation ID' });
export const RespondToInvitationBody = ApiBody({ type: InvitationResponseDto });
export const RespondToInvitationResponse200 = ApiResponse({
  status: 200,
  description: 'Invitation response processed successfully',
});
export const RespondToInvitationResponse403 = ApiResponse({ status: 403, description: 'Forbidden - can only respond to own invitations' });
export const RespondToInvitationResponse404 = ApiResponse({ status: 404, description: 'Invitation not found' });
export const RespondToInvitationResponse400 = ApiResponse({ status: 400, description: 'Invitation expired or already responded' });

// Cancel Invitation Decorators
export const CancelInvitationOperation = ApiOperation({ summary: 'Cancel/withdraw invitation (Sender or Project Admin only)' });
export const CancelInvitationParam = ApiParam({ name: 'invitationId', description: 'Invitation ID' });
export const CancelInvitationResponse200 = ApiResponse({
  status: 200,
  description: 'Invitation cancelled successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
  },
});
export const CancelInvitationResponse403 = ApiResponse({ status: 403, description: 'Forbidden - only sender or project admin can cancel' });
export const CancelInvitationResponse404 = ApiResponse({ status: 404, description: 'Invitation not found' });
export const CancelInvitationResponse400 = ApiResponse({ status: 400, description: 'Can only cancel pending invitations' });