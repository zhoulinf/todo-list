import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: '任务标题', example: '完成需求文档' })
  @IsString()
  @IsOptional()
  title?: string;

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
  })
  @IsString()
  @IsIn(['todo', 'in_progress', 'done'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: '排序位置', example: 0 })
  @IsString()
  @IsOptional()
  position?: string;
}
