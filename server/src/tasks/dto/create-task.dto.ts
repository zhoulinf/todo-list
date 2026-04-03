import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: '任务标题', example: '完成需求文档' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: '任务描述',
    example: '编写 v2 版本需求文档',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: '任务状态',
    enum: ['todo', 'in_progress', 'done'],
    default: 'todo',
  })
  @IsString()
  @IsIn(['todo', 'in_progress', 'done'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: '任务位置', example: 'a' })
  @IsString()
  @IsOptional()
  position?: string;
}
