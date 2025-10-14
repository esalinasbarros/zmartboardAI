import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignUserDto {
  @ApiProperty({
    description: 'ID of the user to assign to the task',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UnassignUserDto {
  @ApiProperty({
    description: 'ID of the user to unassign from the task',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}