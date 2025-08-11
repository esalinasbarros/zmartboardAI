import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationType } from '@prisma/client';
export interface EmailConfig {
    enabled: boolean;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
}
export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare class EmailService {
    private readonly configService;
    private readonly prisma;
    private readonly logger;
    private readonly emailConfig;
    constructor(configService: ConfigService, prisma: PrismaService);
    private generateVerificationCode;
    createVerificationCode(email: string, type: VerificationType, userId?: string): Promise<string>;
    verifyCode(email: string, code: string, type: VerificationType): Promise<{
        success: boolean;
        message: string;
        userId?: string;
    }>;
    sendVerificationEmail(email: string, type: VerificationType, userId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private sendEmail;
    private getEmailSubject;
    private getEmailTemplate;
    private getEmailTitle;
    private getEmailMessage;
    cleanupExpiredCodes(): Promise<void>;
}
