import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationType } from '@prisma/client';

export class SendVerificationDto {
  @ApiProperty({
    description: 'Email address to send verification code to',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Type of verification',
    enum: VerificationType,
    example: VerificationType.EMAIL_VERIFICATION,
  })
  @IsEnum(VerificationType)
  type: VerificationType;

  @ApiPropertyOptional({
    description: 'User ID (optional, for specific verification types)',
    example: 'clx1234567890',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class VerifyCodeDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Verification code',
    example: '123456',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Type of verification',
    enum: VerificationType,
    example: VerificationType.EMAIL_VERIFICATION,
  })
  @IsEnum(VerificationType)
  type: VerificationType;
}