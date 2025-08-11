import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  CreateProjectDto,
  UpdateProjectDto,
  CreateInvitationDto,
  InvitationResponseDto,
  UpdateProjectMemberRoleDto,
  CreateProjectResponse,
  GetUserProjectsResponse,
  GetAllProjectsResponse,
  GetProjectByIdResponse,
  UpdateProjectResponse,
  DeleteProjectResponse,
  SendInvitationResponse,
  GetProjectInvitationsResponse,
  GetUserInvitationsResponse,
  RespondToInvitationResponse,
  CancelInvitationResponse,
  UpdateProjectMemberRoleResponse,
  RemoveProjectMemberResponse,
  ProjectsApiError,
} from '../types/projects.types';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom error interface for API errors
export interface ProjectsApiErrorType extends Error {
  statusCode: number;
  error?: string;
}

// Helper function to create API errors
export const createProjectsApiError = (
  message: string,
  statusCode: number,
  error?: string
): ProjectsApiErrorType => {
  const apiError = new Error(message) as ProjectsApiErrorType;
  apiError.name = 'ProjectsApiError';
  apiError.statusCode = statusCode;
  apiError.error = error;
  return apiError;
};

// Axios response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const errorData = error.response.data as ProjectsApiError;
      throw createProjectsApiError(
        errorData.message || 'An error occurred',
        error.response.status,
        errorData.error
      );
    } else if (error.request) {
      throw createProjectsApiError('Network error', 0);
    } else {
      throw createProjectsApiError('Request setup error', 0);
    }
  }
);

export const projectsApi = {
  // Create a new project
  createProject: async (projectData: CreateProjectDto): Promise<CreateProjectResponse> => {
    const response = await axiosInstance.post<CreateProjectResponse>('/projects', projectData);
    return response.data;
  },

  // Get user's projects
  getUserProjects: async (): Promise<GetUserProjectsResponse> => {
    const response = await axiosInstance.get<GetUserProjectsResponse>('/projects');
    return response.data;
  },

  // Get all projects (admin only)
  getAllProjects: async (): Promise<GetAllProjectsResponse> => {
    const response = await axiosInstance.get<GetAllProjectsResponse>('/projects/admin/all');
    return response.data;
  },

  // Get project by ID
  getProjectById: async (id: string): Promise<GetProjectByIdResponse> => {
    const response = await axiosInstance.get<GetProjectByIdResponse>(`/projects/${id}`);
    return response.data;
  },

  // Update project
  updateProject: async (id: string, projectData: UpdateProjectDto): Promise<UpdateProjectResponse> => {
    const response = await axiosInstance.put<UpdateProjectResponse>(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (id: string): Promise<DeleteProjectResponse> => {
    const response = await axiosInstance.delete<DeleteProjectResponse>(`/projects/${id}`);
    return response.data;
  },

  // Send invitation
  sendInvitation: async (projectId: string, invitationData: CreateInvitationDto): Promise<SendInvitationResponse> => {
    const response = await axiosInstance.post<SendInvitationResponse>(`/projects/${projectId}/invitations`, invitationData);
    return response.data;
  },

  // Get project invitations
  getProjectInvitations: async (projectId: string): Promise<GetProjectInvitationsResponse> => {
    const response = await axiosInstance.get<GetProjectInvitationsResponse>(`/projects/${projectId}/invitations`);
    return response.data;
  },

  // Get user invitations
  getUserInvitations: async (): Promise<GetUserInvitationsResponse> => {
    const response = await axiosInstance.get<GetUserInvitationsResponse>('/projects/invitations/received');
    return response.data;
  },

  // Respond to invitation
  respondToInvitation: async (invitationId: string, response: InvitationResponseDto): Promise<RespondToInvitationResponse> => {
    const apiResponse = await axiosInstance.post<RespondToInvitationResponse>(`/projects/invitations/${invitationId}/respond`, response);
    return apiResponse.data;
  },

  // Cancel invitation
  cancelInvitation: async (invitationId: string): Promise<CancelInvitationResponse> => {
    const response = await axiosInstance.delete<CancelInvitationResponse>(`/projects/invitations/${invitationId}`);
    return response.data;
  },

  // Update project member role
  updateProjectMemberRole: async (projectId: string, memberId: string, roleData: UpdateProjectMemberRoleDto): Promise<UpdateProjectMemberRoleResponse> => {
    const response = await axiosInstance.put<UpdateProjectMemberRoleResponse>(`/projects/${projectId}/members/${memberId}/role`, roleData);
    return response.data;
  },

  // Remove project member
  removeProjectMember: async (projectId: string, memberId: string): Promise<RemoveProjectMemberResponse> => {
    const response = await axiosInstance.delete<RemoveProjectMemberResponse>(`/projects/${projectId}/members/${memberId}`);
    return response.data;
  },
};

export default projectsApi;