import axios from "axios";
import type { Task, CreateTaskDto, UpdateTaskDto } from "../types/task";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>("/tasks");
  return data;
}

export async function createTask(dto: CreateTaskDto): Promise<Task> {
  const { data } = await api.post<Task>("/tasks", dto);
  return data;
}

export async function updateTask(id: number, dto: UpdateTaskDto): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${id}`, dto);
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function reorderTask(
  id: number,
  status: string,
  position: number
): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${id}/reorder`, {
    status,
    position,
  });
  return data;
}
