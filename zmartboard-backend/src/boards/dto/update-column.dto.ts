import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateColumnDto {
  @ApiPropertyOptional({
    description: 'Column name',
    example: 'In Progress',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;
}