import axios from 'axios';

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

// User search interface
export interface UserSearchResponse {
  message?: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null;
}

export const usersApi = {
  // Search users by email or username
  searchUsers: async (search: string): Promise<UserSearchResponse> => {
    const response = await axiosInstance.get(`/users/search?search=${encodeURIComponent(search)}`);
    return response.data;
  },
};