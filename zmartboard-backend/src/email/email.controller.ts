import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SendVerificationDto, VerifyCodeDto } from './dto/send-verification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VerificationType } from '@prisma/client';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Send verification email
   * Public endpoint for email verification during registration
   */
  @ApiOperation({ summary: 'Send verification email' })
  @ApiBody({ type: SendVerificationDto })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 429, description: 'Too many requests - rate limited' })
  @Post('send-verification')
  @HttpCode(HttpStatus.OK)
  async sendVerification(@Body() sendVerificationDto: SendVerificationDto) {
    const { email, type, userId } = sendVerificationDto;

    const result = await this.emailService.sendVerificationEmail(
      email,
      type,
      userId,
    );

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return {
      message: result.message,
      success: true,
    };
  }

  /**
   * Verify email code
   * Public endpoint for code verification
   */
  @ApiOperation({ summary: 'Verify email code' })
  @ApiBody({ type: VerifyCodeDto })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  @ApiResponse({ status: 429, description: 'Too many verification attempts' })
  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    const { email, code, type } = verifyCodeDto;

    const result = await this.emailService.verifyCode(email, code, type);

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return {
      message: result.message,
      success: true,
      userId: result.userId,
    };
  }

  /**
   * Resend verification email
   * Public endpoint to resend verification code
   */
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiBody({ type: SendVerificationDto })
  @ApiResponse({
    status: 200,
    description: 'Verification email resent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 429, description: 'Too many requests - rate limited' })
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() sendVerificationDto: SendVerificationDto) {
    const { email, type, userId } = sendVerificationDto;

    // Add rate limiting logic here if needed
    const result = await this.emailService.sendVerificationEmail(
      email,
      type,
      userId,
    );

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return {
      message: 'Verification email resent successfully',
      success: true,
    };
  }

  /**
   * Send password reset email
   * Public endpoint for password reset
   */
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'user@example.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid email address' })
  @Post('send-password-reset')
  @HttpCode(HttpStatus.OK)
  async sendPasswordReset(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const result = await this.emailService.sendVerificationEmail(
      email,
      VerificationType.PASSWORD_RESET,
    );

    // Always return success for security reasons (don't reveal if email exists)
    return {
      message: 'If the email exists in our system, a password reset code has been sent.',
      success: true,
    };
  }

  /**
   * Verify password reset code
   * Public endpoint for password reset verification
   */
  @ApiOperation({ summary: 'Verify password reset code' })
  @ApiBody({ type: VerifyCodeDto })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  @Post('verify-password-reset')
  @HttpCode(HttpStatus.OK)
  async verifyPasswordReset(
    @Body('email') email: string,
    @Body('code') code: string,
  ) {
    if (!email || !code) {
      throw new BadRequestException('Email and code are required');
    }

    const result = await this.emailService.verifyCode(
      email,
      code,
      VerificationType.PASSWORD_RESET,
    );

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return {
      message: 'Password reset code verified successfully',
      success: true,
      userId: result.userId,
    };
  }

  /**
   * Send email change verification
   * Protected endpoint for email change
   */
  @ApiOperation({ summary: 'Send email change verification (authenticated users)' })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newEmail: { type: 'string', format: 'email', example: 'newemail@example.com' },
        userId: { type: 'string', example: 'user-id-123' },
      },
      required: ['newEmail', 'userId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Email change verification sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid email address' })
  @UseGuards(JwtAuthGuard)
  @Post('send-email-change')
  @HttpCode(HttpStatus.OK)
  async sendEmailChange(
    @Body('newEmail') newEmail: string,
    @Body('userId') userId: string,
  ) {
    if (!newEmail || !userId) {
      throw new BadRequestException('New email and user ID are required');
    }

    const result = await this.emailService.sendVerificationEmail(
      newEmail,
      VerificationType.EMAIL_CHANGE,
      userId,
    );

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return {
      message: 'Email change verification sent successfully',
      success: true,
    };
  }

  /**
   * Verify email change code
   * Protected endpoint for email change verification
   */
  @ApiOperation({ summary: 'Verify email change code (authenticated users)' })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newEmail: { type: 'string', format: 'email', example: 'newemail@example.com' },
        code: { type: 'string', example: '123456' },
        userId: { type: 'string', example: 'user-id-123' },
      },
      required: ['newEmail', 'code', 'userId'],
    },
  })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  @UseGuards(JwtAuthGuard)
  @Post('verify-email-change')
  @HttpCode(HttpStatus.OK)
  async verifyEmailChange(
    @Body('newEmail') newEmail: string,
    @Body('code') code: string,
    @Body('userId') userId: string,
  ) {
    if (!newEmail || !code || !userId) {
      throw new BadRequestException('New email, code, and user ID are required');
    }

    const result = await this.emailService.verifyCode(
      newEmail,
      code,
      VerificationType.EMAIL_CHANGE,
    );

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return {
      message: 'Email change verified successfully',
      success: true,
      userId: result.userId,
    };
  }
}