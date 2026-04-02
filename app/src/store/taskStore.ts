import { create } from "zustand";
import type { Task, TaskStatus, CreateTaskDto } from "../types/task";
import * as api from "../api/task";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (dto: CreateTaskDto) => Promise<void>;
  editTask: (id: number, dto: Partial<Task>) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
  moveTask: (id: number, status: TaskStatus, position: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await api.fetchTasks();
      set({ tasks, loading: false });
    } catch {
      set({ error: "Failed to fetch tasks", loading: false });
    }
  },

  addTask: async (dto) => {
    try {
      const task = await api.createTask(dto);
      set((s) => ({ tasks: [...s.tasks, task] }));
    } catch {
      set({ error: "Failed to create task" });
    }
  },

  editTask: async (id, dto) => {
    try {
      const updated = await api.updateTask(id, dto);
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === id ? updated : t)),
      }));
    } catch {
      set({ error: "Failed to update task" });
    }
  },

  removeTask: async (id) => {
    try {
      await api.deleteTask(id);
      set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    } catch {
      set({ error: "Failed to delete task" });
    }
  },

  moveTask: async (id, status, position) => {
    const prev = get().tasks;
    // Optimistic update
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, status, position } : t)),
    }));
    try {
      await api.reorderTask(id, status, position);
    } catch {
      set({ tasks: prev, error: "Failed to move task" });
    }
  },
}));
