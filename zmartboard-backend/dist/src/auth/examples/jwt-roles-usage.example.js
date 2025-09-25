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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const jwt_roles_guard_1 = require("../guards/jwt-roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const client_1 = require("@prisma/client");
let ExampleController = class ExampleController {
    getPublicData() {
        return { message: 'This is a public endpoint' };
    }
    getProtectedData() {
        return { message: 'This endpoint requires JWT authentication' };
    }
    getUserContent() {
        return { message: 'Content for authenticated users' };
    }
    moderateContent() {
        return { message: 'Content moderation action' };
    }
    getAdminPanel() {
        return { message: 'Admin panel access' };
    }
    updateSystemConfig() {
        return { message: 'System configuration updated' };
    }
};
exports.ExampleController = ExampleController;
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExampleController.prototype, "getPublicData", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('protected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExampleController.prototype, "getProtectedData", null);
__decorate([
    (0, common_1.UseGuards)(jwt_roles_guard_1.JwtRolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.USER),
    (0, common_1.Get)('user-content'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExampleController.prototype, "getUserContent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_roles_guard_1.JwtRolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MODERATOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Post)('moderate-content'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExampleController.prototype, "moderateContent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_roles_guard_1.JwtRolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)('admin-panel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExampleController.prototype, "getAdminPanel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_roles_guard_1.JwtRolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Post)('system-config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExampleController.prototype, "updateSystemConfig", null);
exports.ExampleController = ExampleController = __decorate([
    (0, common_1.Controller)('example')
], ExampleController);
//# sourceMappingURL=jwt-roles-usage.example.js.map