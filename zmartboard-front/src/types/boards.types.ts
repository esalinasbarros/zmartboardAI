// Board and Column Types
export interface Board {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  columns: Column[];
}

export interface Column {
  id: string;
  name: string;
  position: number;
  boardId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  tasks: Task[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UserTask {
  id: string;
  userId: string;
  taskId: string;
  assignedAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: User;
}

export interface TimeEntry {
  id: string;
  userId: string;
  taskId: string;
  hours: number;
  description?: string;
  date: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: User;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  taskId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  position: number;
  columnId: string;
  deadline?: string | Date;
  archived: boolean;
  estimatedHours?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  assignedUsers?: UserTask[];
  timeEntries?: TimeEntry[];
  comments?: Comment[];
}

// DTOs for API calls
export interface CreateBoardDto {
  title: string;
  description?: string;
}

export interface UpdateBoardDto {
  title?: string;
  description?: string;
}

export interface CreateColumnDto {
  name: string;
  position?: number;
}

export interface UpdateColumnDto {
  name?: string;
}

export interface MoveColumnDto {
  position: number;
}

// Task DTOs
export interface CreateTaskDto {
  title: string;
  description?: string;
  position?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  deadline?: string | Date;
  estimatedHours?: number;
}

export interface MoveTaskDto {
  columnId: string;
  position: number;
}

// API Response types
export interface CreateBoardResponse {
  board: Board;
}

export interface CreateColumnResponse {
  column: Column;
}

export interface DeleteResponse {
  message: string;
}

export interface CreateTaskResponse {
  task: Task;
}

export interface UpdateTaskResponse {
  task: Task;
}