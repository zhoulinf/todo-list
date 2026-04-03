import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderTaskDto {
  @ApiProperty({
    description: '目标状态',
    enum: ['todo', 'in_progress', 'done'],
  })
  @IsString()
  @IsIn(['todo', 'in_progress', 'done'])
  status: string;

  @ApiProperty({ description: '目标位置', example: 0 })
  @IsString()
  position: string;
}
