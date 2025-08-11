import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MoveColumnDto {
  @ApiProperty({
    description: 'New position for the column (0-based index)',
    example: 2,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  position: number;
}