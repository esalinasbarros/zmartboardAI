"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_swagger_1 = require("./auth.swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const jwt_roles_guard_1 = require("./guards/jwt-roles.guard");
const roles_decorator_1 = require("./decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto, res) {
        const result = await this.authService.register(registerDto);
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({
            message: 'Registration successful',
            user: result.user,
        });
    }
    async login(loginDto, res) {
        const user = await this.authService.validateUser(loginDto.emailOrUsername, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const result = await this.authService.login(user);
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({
            message: 'Login successful',
            user: result.user,
        });
    }
    getProfile(req) {
        return {
            user: req.user,
        };
    }
    async refreshToken(req, res) {
        const result = await this.authService.refreshToken(req.user);
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({
            message: 'Token refreshed successfully',
        });
    }
    async logout(res) {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return res.json({
            message: 'Logout successful',
        });
    }
    getAdminUsers() {
        return {
            message: 'Admin users endpoint - accessible by ADMIN and SUPER_ADMIN',
            users: [],
        };
    }
    getModeratorDashboard() {
        return {
            message: 'Moderator dashboard - accessible by MODERATOR, ADMIN, and SUPER_ADMIN',
            data: {},
        };
    }
    getSuperAdminSystem() {
        return {
            message: 'Super admin system - accessible by SUPER_ADMIN only',
            systemInfo: {},
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    auth_swagger_1.RegisterOperation,
    auth_swagger_1.RegisterBody,
    auth_swagger_1.RegisterSuccessResponse,
    auth_swagger_1.RegisterBadRequestResponse,
    auth_swagger_1.RegisterConflictResponse,
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    auth_swagger_1.LoginOperation,
    auth_swagger_1.LoginBody,
    auth_swagger_1.LoginSuccessResponse,
    auth_swagger_1.LoginUnauthorizedResponse,
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    auth_swagger_1.ProfileOperation,
    auth_swagger_1.ProfileBearerAuth,
    auth_swagger_1.ProfileCookieAuth,
    auth_swagger_1.ProfileSuccessResponse,
    auth_swagger_1.ProfileUnauthorizedResponse,
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], AuthController.prototype, "getProfile", null);
__decorate([
    auth_swagger_1.RefreshTokenOperation,
    auth_swagger_1.RefreshTokenBearerAuth,
    auth_swagger_1.RefreshTokenCookieAuth,
    auth_swagger_1.RefreshTokenSuccessResponse,
    auth_swagger_1.RefreshTokenUnauthorizedResponse,
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    auth_swagger_1.LogoutOperation,
    auth_swagger_1.LogoutSuccessResponse,
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    auth_swagger_1.AdminUsersOperation,
    auth_swagger_1.AdminUsersBearerAuth,
    auth_swagger_1.AdminUsersCookieAuth,
    auth_swagger_1.AdminUsersSuccessResponse,
    auth_swagger_1.AdminUsersUnauthorizedResponse,
    auth_swagger_1.AdminUsersForbiddenResponse,
    (0, common_1.UseGuards)(jwt_roles_guard_1.JwtRolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)('admin/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getAdminUsers", null);
__decorate([
    auth_swagger_1.ModeratorDashboardOperation,
    auth_swagger_1.ModeratorDashboardBearerAuth,
    auth_swagger_1.ModeratorDashboardCookieAuth,
    auth_swagger_1.ModeratorDashboardSuccessResponse,
    auth_swagger_1.ModeratorDashboardUnauthorizedResponse,
    auth_swagger_1.ModeratorDashboardForbiddenResponse,
    (0, common_1.UseGuards)(jwt_roles_guard_1.JwtRolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MODERATOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)('moderator/dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getModeratorDashboard", null);
__decorate([
    auth_swagger_1.SuperAdminSystemOperation,
    auth_swagger_1.SuperAdminSystemBearerAuth,
    auth_swagger_1.SuperAdminSystemCookieAuth,
    auth_swagger_1.SuperAdminSystemSuccessResponse,
    auth_swagger_1.SuperAdminSystemUnauthorizedResponse,
    auth_swagger_1.SuperAdminSystemForbiddenResponse,
    (0, common_1.UseGuards)(jwt_roles_guard_1.JwtRolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)('super-admin/system'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getSuperAdminSystem", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map