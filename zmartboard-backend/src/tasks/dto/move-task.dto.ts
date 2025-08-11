import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MoveTaskDto {
  @ApiPropertyOptional({
    description: 'Target column ID (if moving to different column)',
    example: 'clp1234567890',
  })
  @IsString()
  @IsOptional()
  targetColumnId?: string;

  @ApiProperty({
    description: 'New position in the target column (0-based index)',
    example: 1,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  position: number;
}