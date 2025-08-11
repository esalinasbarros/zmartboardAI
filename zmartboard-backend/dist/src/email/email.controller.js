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
exports.EmailController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const email_service_1 = require("./email.service");
const send_verification_dto_1 = require("./dto/send-verification.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const client_1 = require("@prisma/client");
let EmailController = class EmailController {
    emailService;
    constructor(emailService) {
        this.emailService = emailService;
    }
    async sendVerification(sendVerificationDto) {
        const { email, type, userId } = sendVerificationDto;
        const result = await this.emailService.sendVerificationEmail(email, type, userId);
        if (!result.success) {
            throw new common_1.BadRequestException(result.message);
        }
        return {
            message: result.message,
            success: true,
        };
    }
    async verifyCode(verifyCodeDto) {
        const { email, code, type } = verifyCodeDto;
        const result = await this.emailService.verifyCode(email, code, type);
        if (!result.success) {
            throw new common_1.BadRequestException(result.message);
        }
        return {
            message: result.message,
            success: true,
            userId: result.userId,
        };
    }
    async resendVerification(sendVerificationDto) {
        const { email, type, userId } = sendVerificationDto;
        const result = await this.emailService.sendVerificationEmail(email, type, userId);
        if (!result.success) {
            throw new common_1.BadRequestException(result.message);
        }
        return {
            message: 'Verification email resent successfully',
            success: true,
        };
    }
    async sendPasswordReset(email) {
        if (!email) {
            throw new common_1.BadRequestException('Email is required');
        }
        const result = await this.emailService.sendVerificationEmail(email, client_1.VerificationType.PASSWORD_RESET);
        return {
            message: 'If the email exists in our system, a password reset code has been sent.',
            success: true,
        };
    }
    async verifyPasswordReset(email, code) {
        if (!email || !code) {
            throw new common_1.BadRequestException('Email and code are required');
        }
        const result = await this.emailService.verifyCode(email, code, client_1.VerificationType.PASSWORD_RESET);
        if (!result.success) {
            throw new common_1.BadRequestException(result.message);
        }
        return {
            message: 'Password reset code verified successfully',
            success: true,
            userId: result.userId,
        };
    }
    async sendEmailChange(newEmail, userId) {
        if (!newEmail || !userId) {
            throw new common_1.BadRequestException('New email and user ID are required');
        }
        const result = await this.emailService.sendVerificationEmail(newEmail, client_1.VerificationType.EMAIL_CHANGE, userId);
        if (!result.success) {
            throw new common_1.BadRequestException(result.message);
        }
        return {
            message: 'Email change verification sent successfully',
            success: true,
        };
    }
    async verifyEmailChange(newEmail, code, userId) {
        if (!newEmail || !code || !userId) {
            throw new common_1.BadRequestException('New email, code, and user ID are required');
        }
        const result = await this.emailService.verifyCode(newEmail, code, client_1.VerificationType.EMAIL_CHANGE);
        if (!result.success) {
            throw new common_1.BadRequestException(result.message);
        }
        return {
            message: 'Email change verified successfully',
            success: true,
            userId: result.userId,
        };
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Send verification email' }),
    (0, swagger_1.ApiBody)({ type: send_verification_dto_1.SendVerificationDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Verification email sent successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                success: { type: 'boolean' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Too many requests - rate limited' }),
    (0, common_1.Post)('send-verification'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_verification_dto_1.SendVerificationDto]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendVerification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify email code' }),
    (0, swagger_1.ApiBody)({ type: send_verification_dto_1.VerifyCodeDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Code verified successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                success: { type: 'boolean' },
                userId: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired code' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Too many verification attempts' }),
    (0, common_1.Post)('verify-code'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_verification_dto_1.VerifyCodeDto]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "verifyCode", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Resend verification email' }),
    (0, swagger_1.ApiBody)({ type: send_verification_dto_1.SendVerificationDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Verification email resent successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                success: { type: 'boolean' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Too many requests - rate limited' }),
    (0, common_1.Post)('resend-verification'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_verification_dto_1.SendVerificationDto]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "resendVerification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Send password reset email' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
            },
            required: ['email'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset email sent successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                success: { type: 'boolean' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid email address' }),
    (0, common_1.Post)('send-password-reset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendPasswordReset", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify password reset code' }),
    (0, swagger_1.ApiBody)({ type: send_verification_dto_1.VerifyCodeDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset code verified successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                success: { type: 'boolean' },
                userId: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired code' }),
    (0, common_1.Post)('verify-password-reset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "verifyPasswordReset", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Send email change verification (authenticated users)' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                newEmail: { type: 'string', format: 'email', example: 'newemail@example.com' },
                userId: { type: 'string', example: 'user-id-123' },
            },
            required: ['newEmail', 'userId'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Email change verification sent successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                success: { type: 'boolean' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid email address' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('send-email-change'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('newEmail')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendEmailChange", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify email change code (authenticated users)' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                newEmail: { type: 'string', format: 'email', example: 'newemail@example.com' },
                code: { type: 'string', example: '123456' },
                userId: { type: 'string', example: 'user-id-123' },
            },
            required: ['newEmail', 'code', 'userId'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Email change verified successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                success: { type: 'boolean' },
                userId: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired code' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('verify-email-change'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('newEmail')),
    __param(1, (0, common_1.Body)('code')),
    __param(2, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "verifyEmailChange", null);
exports.EmailController = EmailController = __decorate([
    (0, swagger_1.ApiTags)('email'),
    (0, common_1.Controller)('email'),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmailController);
//# sourceMappingURL=email.controller.js.map