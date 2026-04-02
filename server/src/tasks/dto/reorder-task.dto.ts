import { IsString, IsNumber, IsIn } from 'class-validator';

export class ReorderTaskDto {
  @IsString()
  @IsIn(['todo', 'in_progress', 'done'])
  status: string;

  @IsNumber()
  position: number;
}
