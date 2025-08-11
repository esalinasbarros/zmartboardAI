import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationType } from '@prisma/client';
import * as crypto from 'crypto';

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

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly emailConfig: EmailConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.emailConfig = {
      enabled: this.configService.get<boolean>('EMAIL_ENABLED', false),
      host: this.configService.get<string>('EMAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('EMAIL_PORT', 587),
      secure: this.configService.get<boolean>('EMAIL_SECURE', false),
      user: this.configService.get<string>('EMAIL_USER', 'your-email@gmail.com'),
      password: this.configService.get<string>('EMAIL_PASSWORD', 'your-app-password'),
      from: this.configService.get<string>('EMAIL_FROM', 'ZMart Board <noreply@zmartboard.com>'),
    };
  }

  /**
   * Generate a 6-digit verification code
   */
  private generateVerificationCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Create and store a verification code in the database
   */
  async createVerificationCode(
    email: string,
    type: VerificationType,
    userId?: string,
  ): Promise<string> {
    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Invalidate any existing codes for this email and type
    await this.prisma.emailVerification.updateMany({
      where: {
        email,
        type,
        verified: false,
      },
      data: {
        verified: true, // Mark as used/expired
      },
    });

    // Create new verification code
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

  /**
   * Verify a code against the database
   */
  async verifyCode(
    email: string,
    code: string,
    type: VerificationType,
  ): Promise<{ success: boolean; message: string; userId?: string }> {
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

    // Check attempts limit (max 5 attempts)
    if (verification.attempts >= 5) {
      return {
        success: false,
        message: 'Too many verification attempts. Please request a new code.',
      };
    }

    // Mark as verified
    await this.prisma.emailVerification.update({
      where: { id: verification.id },
      data: {
        verified: true,
        attempts: verification.attempts + 1,
      },
    });

    // Update user email verification status if it's email verification
    if (type === VerificationType.EMAIL_VERIFICATION && verification.userId) {
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

  /**
   * Send verification email
   */
  async sendVerificationEmail(
    email: string,
    type: VerificationType,
    userId?: string,
  ): Promise<{ success: boolean; message: string }> {
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
      } else {
        // Email service is disabled - log the code for development
        this.logger.warn(`EMAIL SERVICE DISABLED - Verification code for ${email}: ${code}`);
        return {
          success: true,
          message: 'Email service is disabled. Check server logs for verification code.',
        };
      }
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}:`, error);
      return {
        success: false,
        message: 'Failed to send verification email',
      };
    }
  }

  /**
   * Send email using configured SMTP settings
   */
  private async sendEmail(options: SendEmailOptions): Promise<void> {
    // TODO: Implement actual email sending using nodemailer or similar
    // For now, this is a placeholder that would integrate with your email provider
    
    if (!this.emailConfig.enabled) {
      throw new Error('Email service is disabled');
    }

    // Example implementation with nodemailer (commented out since nodemailer is not installed)
    /*
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      host: this.emailConfig.host,
      port: this.emailConfig.port,
      secure: this.emailConfig.secure,
      auth: {
        user: this.emailConfig.user,
        pass: this.emailConfig.password,
      },
    });

    await transporter.sendMail({
      from: this.emailConfig.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    */

    // Simulate email sending for now
    this.logger.log(`[SIMULATED] Email sent to ${options.to}: ${options.subject}`);
  }

  /**
   * Get email subject based on verification type
   */
  private getEmailSubject(type: VerificationType): string {
    switch (type) {
      case VerificationType.EMAIL_VERIFICATION:
        return 'Verify Your Email Address - ZMart Board';
      case VerificationType.PASSWORD_RESET:
        return 'Reset Your Password - ZMart Board';
      case VerificationType.EMAIL_CHANGE:
        return 'Confirm Email Change - ZMart Board';
      default:
        return 'Verification Code - ZMart Board';
    }
  }

  /**
   * Get email template based on verification type
   */
  private getEmailTemplate(code: string, type: VerificationType): string {
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

  /**
   * Get email title based on verification type
   */
  private getEmailTitle(type: VerificationType): string {
    switch (type) {
      case VerificationType.EMAIL_VERIFICATION:
        return 'Verify Your Email Address';
      case VerificationType.PASSWORD_RESET:
        return 'Reset Your Password';
      case VerificationType.EMAIL_CHANGE:
        return 'Confirm Your New Email Address';
      default:
        return 'Verification Required';
    }
  }

  /**
   * Get email message based on verification type
   */
  private getEmailMessage(type: VerificationType): string {
    switch (type) {
      case VerificationType.EMAIL_VERIFICATION:
        return 'Thank you for registering with ZMart Board! Please use the verification code below to confirm your email address:';
      case VerificationType.PASSWORD_RESET:
        return 'You have requested to reset your password. Please use the verification code below to proceed:';
      case VerificationType.EMAIL_CHANGE:
        return 'You have requested to change your email address. Please use the verification code below to confirm your new email:';
      default:
        return 'Please use the verification code below to proceed:';
    }
  }

  /**
   * Clean up expired verification codes
   */
  async cleanupExpiredCodes(): Promise<void> {
    await this.prisma.emailVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}