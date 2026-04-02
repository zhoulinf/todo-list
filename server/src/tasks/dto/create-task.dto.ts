import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(['todo', 'in_progress', 'done'])
  @IsOptional()
  status?: string;
}
