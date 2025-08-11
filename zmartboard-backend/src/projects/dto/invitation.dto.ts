import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectRole, InvitationStatus } from '@prisma/client';

export class CreateInvitationDto {
  @ApiProperty({
    description: 'Email of the user to invite',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Role to assign to the invited user',
    enum: ProjectRole,
    example: ProjectRole.DEVELOPER,
    default: ProjectRole.DEVELOPER,
  })
  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole = ProjectRole.DEVELOPER;
}

export class InvitationResponseDto {
  @ApiProperty({
    description: 'Response to the invitation',
    enum: ['accept', 'reject'],
    example: 'accept',
  })
  @IsString()
  @IsEnum(['accept', 'reject'])
  response: 'accept' | 'reject';
}

export class InvitationDto {
  @ApiProperty({
    description: 'Invitation ID',
    example: 'clp1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Project ID',
    example: 'clp1234567890',
  })
  projectId: string;

  @ApiProperty({
    description: 'Project title',
    example: 'My Project',
  })
  projectTitle: string;

  @ApiProperty({
    description: 'Sender information',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clp1234567890' },
      username: { type: 'string', example: 'john_doe' },
      email: { type: 'string', example: 'john@example.com' },
    },
  })
  sender: {
    id: string;
    username: string;
    email: string;
  };

  @ApiProperty({
    description: 'Receiver information',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clp1234567890' },
      username: { type: 'string', example: 'jane_doe' },
      email: { type: 'string', example: 'jane@example.com' },
    },
  })
  receiver: {
    id: string;
    username: string;
    email: string;
  };

  @ApiProperty({
    description: 'Role to be assigned',
    enum: ProjectRole,
    example: ProjectRole.DEVELOPER,
  })
  role: ProjectRole;

  @ApiProperty({
    description: 'Invitation status',
    enum: InvitationStatus,
    example: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @ApiProperty({
    description: 'Invitation expiration date',
    example: '2024-12-31T23:59:59.000Z',
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'Invitation creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Invitation last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}