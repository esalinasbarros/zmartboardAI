"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminSystemForbiddenResponse = exports.SuperAdminSystemUnauthorizedResponse = exports.SuperAdminSystemSuccessResponse = exports.SuperAdminSystemCookieAuth = exports.SuperAdminSystemBearerAuth = exports.SuperAdminSystemOperation = exports.ModeratorDashboardForbiddenResponse = exports.ModeratorDashboardUnauthorizedResponse = exports.ModeratorDashboardSuccessResponse = exports.ModeratorDashboardCookieAuth = exports.ModeratorDashboardBearerAuth = exports.ModeratorDashboardOperation = exports.AdminUsersForbiddenResponse = exports.AdminUsersUnauthorizedResponse = exports.AdminUsersSuccessResponse = exports.AdminUsersCookieAuth = exports.AdminUsersBearerAuth = exports.AdminUsersOperation = exports.LogoutSuccessResponse = exports.LogoutOperation = exports.RefreshTokenUnauthorizedResponse = exports.RefreshTokenSuccessResponse = exports.RefreshTokenCookieAuth = exports.RefreshTokenBearerAuth = exports.RefreshTokenOperation = exports.ProfileUnauthorizedResponse = exports.ProfileSuccessResponse = exports.ProfileCookieAuth = exports.ProfileBearerAuth = exports.ProfileOperation = exports.LoginUnauthorizedResponse = exports.LoginSuccessResponse = exports.LoginBody = exports.LoginOperation = exports.RegisterConflictResponse = exports.RegisterBadRequestResponse = exports.RegisterSuccessResponse = exports.RegisterBody = exports.RegisterOperation = void 0;
const swagger_1 = require("@nestjs/swagger");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const client_1 = require("@prisma/client");
exports.RegisterOperation = (0, swagger_1.ApiOperation)({ summary: 'Register a new user' });
exports.RegisterBody = (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto });
exports.RegisterSuccessResponse = (0, swagger_1.ApiResponse)({
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
                    role: { type: 'string', enum: Object.values(client_1.UserRole) },
                },
            },
        },
    },
});
exports.RegisterBadRequestResponse = (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' });
exports.RegisterConflictResponse = (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists' });
exports.LoginOperation = (0, swagger_1.ApiOperation)({ summary: 'Login user' });
exports.LoginBody = (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto });
exports.LoginSuccessResponse = (0, swagger_1.ApiResponse)({
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
                    role: { type: 'string', enum: Object.values(client_1.UserRole) },
                },
            },
        },
    },
});
exports.LoginUnauthorizedResponse = (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' });
exports.ProfileOperation = (0, swagger_1.ApiOperation)({ summary: 'Get user profile' });
exports.ProfileBearerAuth = (0, swagger_1.ApiBearerAuth)();
exports.ProfileCookieAuth = (0, swagger_1.ApiCookieAuth)();
exports.ProfileSuccessResponse = (0, swagger_1.ApiResponse)({
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
                    role: { type: 'string', enum: Object.values(client_1.UserRole) },
                },
            },
        },
    },
});
exports.ProfileUnauthorizedResponse = (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' });
exports.RefreshTokenOperation = (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' });
exports.RefreshTokenBearerAuth = (0, swagger_1.ApiBearerAuth)();
exports.RefreshTokenCookieAuth = (0, swagger_1.ApiCookieAuth)();
exports.RefreshTokenSuccessResponse = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
        type: 'object',
        properties: {
            message: { type: 'string' },
        },
    },
});
exports.RefreshTokenUnauthorizedResponse = (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' });
exports.LogoutOperation = (0, swagger_1.ApiOperation)({ summary: 'Logout user' });
exports.LogoutSuccessResponse = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'User logged out successfully',
    schema: {
        type: 'object',
        properties: {
            message: { type: 'string' },
        },
    },
});
exports.AdminUsersOperation = (0, swagger_1.ApiOperation)({ summary: 'Get admin users (Admin/Super Admin only)' });
exports.AdminUsersBearerAuth = (0, swagger_1.ApiBearerAuth)();
exports.AdminUsersCookieAuth = (0, swagger_1.ApiCookieAuth)();
exports.AdminUsersSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.AdminUsersUnauthorizedResponse = (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' });
exports.AdminUsersForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' });
exports.ModeratorDashboardOperation = (0, swagger_1.ApiOperation)({ summary: 'Get moderator dashboard (Moderator/Admin/Super Admin only)' });
exports.ModeratorDashboardBearerAuth = (0, swagger_1.ApiBearerAuth)();
exports.ModeratorDashboardCookieAuth = (0, swagger_1.ApiCookieAuth)();
exports.ModeratorDashboardSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.ModeratorDashboardUnauthorizedResponse = (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' });
exports.ModeratorDashboardForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' });
exports.SuperAdminSystemOperation = (0, swagger_1.ApiOperation)({ summary: 'Get super admin system info (Super Admin only)' });
exports.SuperAdminSystemBearerAuth = (0, swagger_1.ApiBearerAuth)();
exports.SuperAdminSystemCookieAuth = (0, swagger_1.ApiCookieAuth)();
exports.SuperAdminSystemSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.SuperAdminSystemUnauthorizedResponse = (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' });
exports.SuperAdminSystemForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' });
//# sourceMappingURL=auth.swagger.js.map