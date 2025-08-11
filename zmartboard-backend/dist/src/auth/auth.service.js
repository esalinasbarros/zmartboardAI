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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(emailOrUsername, password) {
        const user = await this.usersService.findByEmailOrUsername(emailOrUsername);
        if (!user) {
            return null;
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await this.usersService.validatePassword(user, password);
        if (!isPasswordValid) {
            return null;
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async login(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
    async register(createUserDto) {
        if (!createUserDto.email || !createUserDto.username || !createUserDto.password) {
            throw new common_1.BadRequestException('Email, username, and password are required');
        }
        if (createUserDto.password.length < 6) {
            throw new common_1.BadRequestException('Password must be at least 6 characters long');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(createUserDto.email)) {
            throw new common_1.BadRequestException('Invalid email format');
        }
        if (createUserDto.username.length < 3) {
            throw new common_1.BadRequestException('Username must be at least 3 characters long');
        }
        const user = await this.usersService.create(createUserDto);
        return this.login(user);
    }
    async validateUserById(id) {
        const user = await this.usersService.findById(id);
        if (!user || !user.isActive) {
            return null;
        }
        return user;
    }
    async refreshToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map