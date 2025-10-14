import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
  DeleteResponse,
} from '../types/boards.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom error interface for API errors
export interface TasksApiErrorType extends Error {
  statusCode: number;
  error?: string;
}

// Helper function to create API errors
export const createTasksApiError = (
  message: string,
  statusCode: number,
  error?: string
): TasksApiErrorType => {
  const apiError = new Error(message) as TasksApiErrorType;
  apiError.name = 'TasksApiError';
  apiError.statusCode = statusCode;
  apiError.error = error;
  return apiError;
};

// Axios response interceptor to handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const errorData = error.response.data as { message?: string; error?: string };
      throw createTasksApiError(
        errorData.message || 'An error occurred',
        error.response.status,
        errorData.error
      );
    } else if (error.request) {
      throw createTasksApiError('Network error', 0);
    } else {
      throw createTasksApiError('Request setup error', 0);
    }
  }
);

export const tasksApi = {
  // Task operations
  createTask: async (columnId: string, taskData: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>(`/tasks/columns/${columnId}`, taskData);
    return response.data;
  },

  getTaskById: async (taskId: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${taskId}`);
    return response.data;
  },

  updateTask: async (taskId: string, taskData: UpdateTaskDto): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(`/tasks/${taskId}`);
    return response.data;
  },

  moveTask: async (taskId: string, moveData: MoveTaskDto): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}/move`, moveData);
    return response.data;
  },

  archiveTask: async (taskId: string): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}/archive`);
    return response.data;
  },

  unarchiveTask: async (taskId: string): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}/unarchive`);
    return response.data;
  },
};
