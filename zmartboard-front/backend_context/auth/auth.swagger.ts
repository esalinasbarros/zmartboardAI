// @ts-ignore
import { ApiOperation, ApiBody, ApiResponse, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

// Register Decorators
export const RegisterOperation = ApiOperation({ summary: 'Register a new user' });
export const RegisterBody = ApiBody({ type: RegisterDto });
export const RegisterSuccessResponse = ApiResponse({
  status: 201,
  description: 'User successfully registered',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          username: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string', enum: Object.values(UserRole) },
        },
      },
    },
  },
});
export const RegisterBadRequestResponse = ApiResponse({ status: 400, description: 'Bad request - validation failed' });
export const RegisterConflictResponse = ApiResponse({ status: 409, description: 'User already exists' });

// Login Decorators
export const LoginOperation = ApiOperation({ summary: 'Login user' });
export const LoginBody = ApiBody({ type: LoginDto });
export const LoginSuccessResponse = ApiResponse({
  status: 200,
  description: 'User successfully logged in',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          username: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string', enum: Object.values(UserRole) },
        },
      },
    },
  },
});
export const LoginUnauthorizedResponse = ApiResponse({ status: 401, description: 'Invalid credentials' });

// Profile Decorators
export const ProfileOperation = ApiOperation({ summary: 'Get user profile' });
export const ProfileBearerAuth = ApiBearerAuth();
export const ProfileCookieAuth = ApiCookieAuth();
export const ProfileSuccessResponse = ApiResponse({
  status: 200,
  description: 'User profile retrieved successfully',
  schema: {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          username: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string', enum: Object.values(UserRole) },
        },
      },
    },
  },
});
export const ProfileUnauthorizedResponse = ApiResponse({ status: 401, description: 'Unauthorized' });

// Refresh Token Decorators
export const RefreshTokenOperation = ApiOperation({ summary: 'Refresh access token' });
export const RefreshTokenBearerAuth = ApiBearerAuth();
export const RefreshTokenCookieAuth = ApiCookieAuth();
export const RefreshTokenSuccessResponse = ApiResponse({
  status: 200,
  description: 'Token refreshed successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
  },
});
export const RefreshTokenUnauthorizedResponse = ApiResponse({ status: 401, description: 'Unauthorized' });

// Logout Decorators
export const LogoutOperation = ApiOperation({ summary: 'Logout user' });
export const LogoutSuccessResponse = ApiResponse({
  status: 200,
  description: 'User logged out successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
  },
});

// Admin Users Decorators
export const AdminUsersOperation = ApiOperation({ summary: 'Get admin users (Admin/Super Admin only)' });
export const AdminUsersBearerAuth = ApiBearerAuth();
export const AdminUsersCookieAuth = ApiCookieAuth();
export const AdminUsersSuccessResponse = ApiResponse({
  status: 200,
  description: 'Admin users retrieved successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      users: { type: 'array', items: { type: 'object' } },
    },
  },
});
export const AdminUsersUnauthorizedResponse = ApiResponse({ status: 401, description: 'Unauthorized' });
export const AdminUsersForbiddenResponse = ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' });

// Moderator Dashboard Decorators
export const ModeratorDashboardOperation = ApiOperation({ summary: 'Get moderator dashboard (Moderator/Admin/Super Admin only)' });
export const ModeratorDashboardBearerAuth = ApiBearerAuth();
export const ModeratorDashboardCookieAuth = ApiCookieAuth();
export const ModeratorDashboardSuccessResponse = ApiResponse({
  status: 200,
  description: 'Moderator dashboard retrieved successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      data: { type: 'object' },
    },
  },
});
export const ModeratorDashboardUnauthorizedResponse = ApiResponse({ status: 401, description: 'Unauthorized' });
export const ModeratorDashboardForbiddenResponse = ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' });

// Super Admin System Decorators
export const SuperAdminSystemOperation = ApiOperation({ summary: 'Get super admin system info (Super Admin only)' });
export const SuperAdminSystemBearerAuth = ApiBearerAuth();
export const SuperAdminSystemCookieAuth = ApiCookieAuth();
export const SuperAdminSystemSuccessResponse = ApiResponse({
  status: 200,
  description: 'Super admin system info retrieved successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      systemInfo: { type: 'object' },
    },
  },
});
export const SuperAdminSystemUnauthorizedResponse = ApiResponse({ status: 401, description: 'Unauthorized' });
export const SuperAdminSystemForbiddenResponse = ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' });