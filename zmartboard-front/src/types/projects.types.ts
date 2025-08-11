// Project-related types based on backend DTOs and responses

export const ProjectRole = {
  ADMIN: 'ADMIN',
  DEVELOPER: 'DEVELOPER',
} as const;

export type ProjectRole = typeof ProjectRole[keyof typeof ProjectRole];

export const InvitationStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
} as const;

export type InvitationStatus = typeof InvitationStatus[keyof typeof InvitationStatus];

// DTOs for API requests
export interface CreateProjectDto {
  title: string;
  description?: string;
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
}

export interface CreateInvitationDto {
  email: string;
  role?: ProjectRole;
}

export interface InvitationResponseDto {
  response: 'accept' | 'reject';
}

export interface AddProjectMemberDto {
  userId: string;
  role?: ProjectRole;
}

export interface UpdateProjectMemberRoleDto {
  role: ProjectRole;
}

// Response types
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface ProjectMember {
  id: string;
  user: User;
  role: ProjectRole;
  joinedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  owner?: User; // Optional since backend doesn't always provide it - owner is the ADMIN member
  members: ProjectMember[];
}

export interface Invitation {
  id: string;
  projectId: string;
  projectTitle: string;
  sender: User;
  receiver: User;
  role: ProjectRole;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types - Updated to match actual backend responses
export interface CreateProjectResponse extends Project {}

export interface GetUserProjectsResponse extends Array<Project> {}

export interface GetAllProjectsResponse extends Array<Project> {}

export interface GetProjectByIdResponse extends Project {}

export interface UpdateProjectResponse extends Project {}

export interface DeleteProjectResponse {
  message: string;
}

export interface SendInvitationResponse {
  invitation: Invitation;
  message: string;
}

export interface GetProjectInvitationsResponse extends Array<Invitation> {}

export interface GetUserInvitationsResponse extends Array<Invitation> {}

export interface RespondToInvitationResponse {
  message: string;
}

export interface CancelInvitationResponse {
  message: string;
}

export interface UpdateProjectMemberRoleResponse {
  member: ProjectMember;
  message: string;
}

export interface RemoveProjectMemberResponse {
  message: string;
}

// Error response type
export interface ProjectsApiError {
  message: string;
  statusCode: number;
  error?: string;
}