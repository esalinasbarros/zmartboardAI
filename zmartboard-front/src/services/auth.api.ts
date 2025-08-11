import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  LoginDto,
  RegisterDto,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  LogoutResponse,
  ProfileResponse,
  ApiError,
} from '../types/auth.types';

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
export interface AuthApiError extends Error {
  statusCode: number;
  error?: string;
}

// Helper function to create API errors
export const createAuthApiError = (
  message: string,
  statusCode: number,
  error?: string
): AuthApiError => {
  const apiError = new Error(message) as AuthApiError;
  apiError.name = 'AuthApiError';
  apiError.statusCode = statusCode;
  apiError.error = error;
  return apiError;
};

// Axios response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const errorData = error.response.data as ApiError;
      throw createAuthApiError(
        errorData.message || 'An error occurred',
        errorData.statusCode || error.response.status,
        errorData.error
      );
    } else if (error.request) {
      throw createAuthApiError(
        'Network error - no response received',
        0
      );
    } else {
      throw createAuthApiError(
        error.message || 'An unexpected error occurred',
        0
      );
    }
  }
);

export const authApi = {
  // Register a new user
  register: async (registerData: RegisterDto): Promise<RegisterResponse> => {
    const response = await axiosInstance.post<RegisterResponse>('/auth/register', registerData);
    return response.data;
  },

  // Login user
  login: async (loginData: LoginDto): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', loginData);
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await axiosInstance.get<ProfileResponse>('/auth/profile');
    return response.data;
  },

  // Refresh access token
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh-token');
    return response.data;
  },

  // Logout user
  logout: async (): Promise<LogoutResponse> => {
    const response = await axiosInstance.post<LogoutResponse>('/auth/logout');
    return response.data;
  },

  // Admin endpoints
  getAdminUsers: async () => {
    const response = await axiosInstance.get('/auth/admin/users');
    return response.data;
  },

  // Moderator endpoints
  getModeratorDashboard: async () => {
    const response = await axiosInstance.get('/auth/moderator/dashboard');
    return response.data;
  },

  // Super Admin endpoints
  getSuperAdminSystem: async () => {
    const response = await axiosInstance.get('/auth/super-admin/system');
    return response.data;
  },
};

export default authApi;