import { http } from "./http";
import type { Task, CreateTaskDto, UpdateTaskDto } from "../types/task";


export async function fetchTasks(): Promise<Task[]> {
  const { data } = await http.get<Task[]>("/tasks");
  return data;
}

export async function createTask(dto: CreateTaskDto): Promise<Task> {
  const { data } = await http.post<Task>("/tasks", dto);
  return data;
}

export async function updateTask(id: number, dto: UpdateTaskDto): Promise<Task> {
  const { data } = await http.patch<Task>(`/tasks/${id}`, dto);
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  await http.delete(`/tasks/${id}`);
}

export async function reorderTask(
  id: number,
  position: string,
  status?: string,
): Promise<Task> {
  const { data } = await http.patch<Task>(`/tasks/${id}/reorder`, {
    status,
    position,
  });
  return data;
}
