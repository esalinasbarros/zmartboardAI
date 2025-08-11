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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const crypto = require("crypto");
let EmailService = EmailService_1 = class EmailService {
    configService;
    prisma;
    logger = new common_1.Logger(EmailService_1.name);
    emailConfig;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.emailConfig = {
            enabled: this.configService.get('EMAIL_ENABLED', false),
            host: this.configService.get('EMAIL_HOST', 'smtp.gmail.com'),
            port: this.configService.get('EMAIL_PORT', 587),
            secure: this.configService.get('EMAIL_SECURE', false),
            user: this.configService.get('EMAIL_USER', 'your-email@gmail.com'),
            password: this.configService.get('EMAIL_PASSWORD', 'your-app-password'),
            from: this.configService.get('EMAIL_FROM', 'ZMart Board <noreply@zmartboard.com>'),
        };
    }
    generateVerificationCode() {
        return crypto.randomInt(100000, 999999).toString();
    }
    async createVerificationCode(email, type, userId) {
        const code = this.generateVerificationCode();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await this.prisma.emailVerification.updateMany({
            where: {
                email,
                type,
                verified: false,
            },
            data: {
                verified: true,
            },
        });
        await this.prisma.emailVerification.create({
            data: {
                email,
                code,
                type,
                expiresAt,
                userId,
            },
        });
        return code;
    }
    async verifyCode(email, code, type) {
        const verification = await this.prisma.emailVerification.findFirst({
            where: {
                email,
                code,
                type,
                verified: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
        if (!verification) {
            return {
                success: false,
                message: 'Invalid or expired verification code',
            };
        }
        if (verification.attempts >= 5) {
            return {
                success: false,
                message: 'Too many verification attempts. Please request a new code.',
            };
        }
        await this.prisma.emailVerification.update({
            where: { id: verification.id },
            data: {
                verified: true,
                attempts: verification.attempts + 1,
            },
        });
        if (type === client_1.VerificationType.EMAIL_VERIFICATION && verification.userId) {
            await this.prisma.user.update({
                where: { id: verification.userId },
                data: { emailVerified: true },
            });
        }
        return {
            success: true,
            message: 'Email verified successfully',
            userId: verification.userId || undefined,
        };
    }
    async sendVerificationEmail(email, type, userId) {
        try {
            const code = await this.createVerificationCode(email, type, userId);
            const subject = this.getEmailSubject(type);
            const html = this.getEmailTemplate(code, type);
            if (this.emailConfig.enabled) {
                await this.sendEmail({
                    to: email,
                    subject,
                    html,
                });
                this.logger.log(`Verification email sent to ${email}`);
                return {
                    success: true,
                    message: 'Verification email sent successfully',
                };
            }
            else {
                this.logger.warn(`EMAIL SERVICE DISABLED - Verification code for ${email}: ${code}`);
                return {
                    success: true,
                    message: 'Email service is disabled. Check server logs for verification code.',
                };
            }
        }
        catch (error) {
            this.logger.error(`Failed to send verification email to ${email}:`, error);
            return {
                success: false,
                message: 'Failed to send verification email',
            };
        }
    }
    async sendEmail(options) {
        if (!this.emailConfig.enabled) {
            throw new Error('Email service is disabled');
        }
        this.logger.log(`[SIMULATED] Email sent to ${options.to}: ${options.subject}`);
    }
    getEmailSubject(type) {
        switch (type) {
            case client_1.VerificationType.EMAIL_VERIFICATION:
                return 'Verify Your Email Address - ZMart Board';
            case client_1.VerificationType.PASSWORD_RESET:
                return 'Reset Your Password - ZMart Board';
            case client_1.VerificationType.EMAIL_CHANGE:
                return 'Confirm Email Change - ZMart Board';
            default:
                return 'Verification Code - ZMart Board';
        }
    }
    getEmailTemplate(code, type) {
        const baseTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .code { font-size: 32px; font-weight: bold; color: #007bff; text-align: center; padding: 20px; background: white; border: 2px dashed #007bff; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ZMart Board</h1>
          </div>
          <div class="content">
            <h2>${this.getEmailTitle(type)}</h2>
            <p>${this.getEmailMessage(type)}</p>
            <div class="code">${code}</div>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This code will expire in 15 minutes</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2024 ZMart Board. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return baseTemplate;
    }
    getEmailTitle(type) {
        switch (type) {
            case client_1.VerificationType.EMAIL_VERIFICATION:
                return 'Verify Your Email Address';
            case client_1.VerificationType.PASSWORD_RESET:
                return 'Reset Your Password';
            case client_1.VerificationType.EMAIL_CHANGE:
                return 'Confirm Your New Email Address';
            default:
                return 'Verification Required';
        }
    }
    getEmailMessage(type) {
        switch (type) {
            case client_1.VerificationType.EMAIL_VERIFICATION:
                return 'Thank you for registering with ZMart Board! Please use the verification code below to confirm your email address:';
            case client_1.VerificationType.PASSWORD_RESET:
                return 'You have requested to reset your password. Please use the verification code below to proceed:';
            case client_1.VerificationType.EMAIL_CHANGE:
                return 'You have requested to change your email address. Please use the verification code below to confirm your new email:';
            default:
                return 'Please use the verification code below to proceed:';
        }
    }
    async cleanupExpiredCodes() {
        await this.prisma.emailVerification.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], EmailService);
//# sourceMappingURL=email.service.js.map