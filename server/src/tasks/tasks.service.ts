import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepo.find({ order: { position: 'ASC', createdAt: 'ASC' } });
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const count = await this.taskRepo.count({
      where: { status: dto.status || 'todo' },
    });
    const task = this.taskRepo.create({
      ...dto,
      position: count,
    });
    return this.taskRepo.save(task);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task #${id} not found`);
    }
  }

  async reorder(id: number, dto: ReorderTaskDto): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task #${id} not found`);

    task.status = dto.status;
    task.position = dto.position;
    return this.taskRepo.save(task);
  }
}
