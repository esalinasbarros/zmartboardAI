// User roles matching backend
export const UserRole = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// User interface based on backend User model
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth DTOs matching backend
export interface LoginDto {
  emailOrUsername: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

// API Response types
export interface AuthResponse {
  message: string;
  user: Omit<User, 'password'>;
}

export interface LoginResponse extends AuthResponse {
  access_token?: string; // Optional since token is in HTTP-only cookie
}

export interface RegisterResponse extends AuthResponse {
  access_token?: string; // Optional since token is in HTTP-only cookie
}

export interface RefreshTokenResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface ProfileResponse {
  user: Omit<User, 'password'>;
}

// JWT Payload interface
export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Auth state interface
export interface AuthState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API Error interface
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}