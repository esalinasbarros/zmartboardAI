import { IsString, IsNotEmpty, IsInt, IsOptional, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateColumnDto {
  @ApiProperty({
    description: 'Column name',
    example: 'To Do',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    description: 'Column position (0-based index). If not provided, will be added at the end.',
    example: 0,
    minimum: 0,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  position?: number;
}