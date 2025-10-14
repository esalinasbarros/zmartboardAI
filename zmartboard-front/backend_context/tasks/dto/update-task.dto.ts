import {
  IsString,
  IsOptional,
  MaxLength,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Task title',
    example: 'Updated task title',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Updated task description',
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Task deadline',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiPropertyOptional({
    description: 'Estimated hours to complete the task',
    example: 8.5,
    minimum: 0.1,
  })
  @IsNumber({}, { message: 'Estimated hours must be a valid number' })
  @Min(0.1, { message: 'Estimated hours must be at least 0.1' })
  @IsOptional()
  @Type(() => Number)
  estimatedHours?: number;
}