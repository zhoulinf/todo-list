import { useCallback } from "react";
import { useTaskStore } from "../store/taskStore";
import * as api from "../api/task";
import type { Task, TaskStatus, CreateTaskDto } from "../types/task";
import { getLast } from "../lib/utils";
const state = () => useTaskStore.getState();

export function useTaskActions() {

  const syncFromRemote = useCallback(async () => {
    const remoteTasks = await api.fetchTasks();
    state().syncIfChanged(remoteTasks);
  }, []);

  const fetchTasks = useCallback(async () => {
    state().setLoading(true);
    const tasks = await api.fetchTasks();
    state().setTasks(tasks);
    state().setLoading(false);
  }, []);

  const addTask = useCallback(
    async (dto: Omit<CreateTaskDto, 'position'>) => {
      const list = state().tasks.filter((t) => t.status === dto.status);
      const last = list[list.length - 1];
      await api.createTask({
        ...dto,
        position: getLast(last?.position) ,
      });
      await syncFromRemote();
    },
    [syncFromRemote],
  );

  const editTask = useCallback(
    async (id: number, dto: Partial<Task>) => {
      state().edit(id, dto);
      try {
        await api.updateTask(id, dto);
      } catch {
        await syncFromRemote();
      }
    },
    [syncFromRemote],
  );

  const removeTask = useCallback(
    async (id: number) => {
      state().remove(id);
      try {
        await api.deleteTask(id);
      } catch {
        await syncFromRemote();
      }
    },
    [syncFromRemote],
  );

  const moveTask = useCallback(
    async (id: number, position: string, status: TaskStatus) => {
      state().move(id, position, status);
      try {
        await api.reorderTask(id, position, status);
      } catch {
        await syncFromRemote();
      }
    },
    [syncFromRemote],
  );

  return { fetchTasks, addTask, editTask, removeTask, moveTask };
}
