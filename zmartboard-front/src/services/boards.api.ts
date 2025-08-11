import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  Board,
  Column,
  CreateBoardDto,
  UpdateBoardDto,
  CreateColumnDto,
  UpdateColumnDto,
  MoveColumnDto,
  CreateBoardResponse,
  CreateColumnResponse,
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
export interface BoardsApiErrorType extends Error {
  statusCode: number;
  error?: string;
}

// Helper function to create API errors
export const createBoardsApiError = (
  message: string,
  statusCode: number,
  error?: string
): BoardsApiErrorType => {
  const apiError = new Error(message) as BoardsApiErrorType;
  apiError.name = 'BoardsApiError';
  apiError.statusCode = statusCode;
  apiError.error = error;
  return apiError;
};

// Axios response interceptor to handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const errorData = error.response.data as any;
      throw createBoardsApiError(
        errorData.message || 'An error occurred',
        error.response.status,
        errorData.error
      );
    } else if (error.request) {
      throw createBoardsApiError('Network error', 0);
    } else {
      throw createBoardsApiError('Request setup error', 0);
    }
  }
);

export const boardsApi = {
  // Board operations
  createBoard: async (projectId: string, boardData: CreateBoardDto): Promise<Board> => {
    const response = await api.post<Board>(`/boards/projects/${projectId}`, boardData);
    return response.data;
  },

  getProjectBoards: async (projectId: string): Promise<Board[]> => {
    const response = await api.get<Board[]>(`/boards/projects/${projectId}`);
    return response.data;
  },

  getBoardById: async (boardId: string): Promise<Board> => {
    const response = await api.get<Board>(`/boards/${boardId}`);
    return response.data;
  },

  updateBoard: async (boardId: string, boardData: UpdateBoardDto): Promise<Board> => {
    const response = await api.put<Board>(`/boards/${boardId}`, boardData);
    return response.data;
  },

  deleteBoard: async (boardId: string): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(`/boards/${boardId}`);
    return response.data;
  },

  // Column operations
  createColumn: async (boardId: string, columnData: CreateColumnDto): Promise<Column> => {
    const response = await api.post<Column>(`/boards/${boardId}/columns`, columnData);
    return response.data;
  },

  updateColumn: async (columnId: string, columnData: UpdateColumnDto): Promise<Column> => {
    const response = await api.put<Column>(`/boards/columns/${columnId}`, columnData);
    return response.data;
  },

  deleteColumn: async (columnId: string): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(`/boards/columns/${columnId}`);
    return response.data;
  },

  moveColumn: async (columnId: string, moveData: MoveColumnDto): Promise<Column> => {
    const response = await api.patch<Column>(`/boards/columns/${columnId}/move`, moveData);
    return response.data;
  },
};