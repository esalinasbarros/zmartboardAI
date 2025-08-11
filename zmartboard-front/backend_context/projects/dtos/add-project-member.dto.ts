import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectRole } from '@prisma/client';

export class AddProjectMemberDto {
  @ApiProperty({
    description: 'User ID to add to the project',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'Role for the user in the project',
    enum: ProjectRole,
    example: ProjectRole.DEVELOPER,
  })
  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole;
}

export class UpdateProjectMemberRoleDto {
  @ApiProperty({
    description: 'New role for the project member',
    enum: ProjectRole,
    example: ProjectRole.ADMIN,
  })
  @IsEnum(ProjectRole)
  @IsNotEmpty()
  role: ProjectRole;
}