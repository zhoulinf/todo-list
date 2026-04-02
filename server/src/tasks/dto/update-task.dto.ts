import { IsString, IsOptional, IsIn, IsNumber } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(['todo', 'in_progress', 'done'])
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  position?: number;
}
