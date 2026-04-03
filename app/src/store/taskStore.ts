import { create } from "zustand";
import type { Task, TaskStatus } from "../types/task";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  currentTask: Task | null;

  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setCurrentTask: (task: Task | null) => void;
  edit: (id: number, dto: Partial<Task>) => void;
  remove: (id: number) => Task | undefined;
  move: (id: number, position: string, status?: TaskStatus,) => void;

  syncIfChanged: (remoteTasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  currentTask: null,

  setTasks: (tasks) => {
    tasks.sort((a, b) => a.position.localeCompare(b.position));
    set({ tasks })
  },
  setLoading: (loading) => set({ loading }),
  setCurrentTask: (task) => set({ currentTask: task }),

  edit: (id: number, dto: Partial<Task>) => {
    set((s) => {
      const tasks = s.tasks.map((t) =>
        t.id === id ? { ...t, ...dto, updatedAt: new Date().toISOString() } : t,
      );
      if (dto.position !== undefined) {
        tasks.sort((a, b) => a.position.localeCompare(b.position));
      }
      return { tasks };
    });
  },

  remove: (id: number) => {
    const removed = get().tasks.find((t) => t.id === id);
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    return removed;
  },

  move: (id: number,  position: string ,status?: TaskStatus,) => {
    get().edit(id, { status, position })
  },

  syncIfChanged: (remoteTasks) => {
    const current = get().tasks;
    const isSame =
      current.length === remoteTasks.length &&
      remoteTasks.every((rt) => {
        const ct = current.find((t) => t.id === rt.id);
        return (
          ct &&
          ct.status === rt.status &&
          ct.position === rt.position &&
          ct.title === rt.title &&
          ct.description === rt.description
        );
      });
    if (!isSame) {
      remoteTasks.sort((a, b) => a.position.localeCompare(b.position));
      set({ tasks: remoteTasks });
    }
  },
}));
