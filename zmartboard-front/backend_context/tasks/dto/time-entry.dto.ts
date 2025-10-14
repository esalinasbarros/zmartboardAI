import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTimeEntryDto {
  @ApiProperty({
    description: 'Number of hours worked on the task',
    example: 2.5,
    minimum: 0.1,
  })
  @IsNumber({}, { message: 'Hours must be a valid number' })
  @Min(0.1, { message: 'Hours must be at least 0.1' })
  @Type(() => Number)
  hours: number;

  @ApiPropertyOptional({
    description: 'Description of the work performed',
    example: 'Implemented user authentication feature',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Date when the work was performed (ISO string)',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}

export class UpdateTimeEntryDto {
  @ApiPropertyOptional({
    description: 'Number of hours worked on the task',
    example: 3.0,
    minimum: 0.1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Hours must be a valid number' })
  @Min(0.1, { message: 'Hours must be at least 0.1' })
  @Type(() => Number)
  hours?: number;

  @ApiPropertyOptional({
    description: 'Description of the work performed',
    example: 'Updated user authentication feature',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Date when the work was performed (ISO string)',
    example: '2024-01-15T14:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}