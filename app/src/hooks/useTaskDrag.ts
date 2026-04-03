import { useCallback, useState } from "react";
import type { Task, TaskStatus } from "../types/task";
import { useTaskActions } from "./useTaskActions";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { getMiddle, getLast, getFirst } from "../lib/utils";
import { COLUMNS } from "../constant";
import { useTaskStore } from "../store/taskStore";
const state = () => useTaskStore.getState();

export const useTaskDrag = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { moveTask } = useTaskActions();

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = event.active.data.current as Task;
    setActiveTask(task);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const activeData = active.data.current as Task;
    const overId = over.id as string;

    // 确定目标列
    let targetStatus: TaskStatus;
    if (COLUMNS.includes(overId as TaskStatus)) {
      targetStatus = overId as TaskStatus;
    } else {
      const overData = over.data.current as Task;
      if (!overData) return;
      targetStatus = overData.status;
    }
    // 只在跨列时才更新 store
    if (!activeData || activeData.status === targetStatus) return;

    // 在目标列计算临时 position
    const targetList = state().tasks.filter((t) => t.status === targetStatus);
    let tempPosition: string;

    if (COLUMNS.includes(overId as TaskStatus) || targetList.length === 0) {
      // 空列：追加到末尾
      const last = targetList[targetList.length - 1];
      tempPosition = getLast(last?.position);
    } else {
      // 将 active 插入到 over 的位置，模拟拖拽后的新顺序
      const overData = over.data.current as Task;
      const overIndex = targetList.findIndex((t) => t.id === overData.id);
      const newOrder = [...targetList];
      newOrder.splice(overIndex, 0, activeData);
      // 找前后算 position
      const prev = overIndex > 0 ? newOrder[overIndex - 1] : null;
      const next =
        overIndex < newOrder.length - 1 ? newOrder[overIndex + 1] : null;
      if (!prev) {
        tempPosition = getFirst(next!.position);
      } else if (!next) {
        tempPosition = getLast(prev.position);
      } else {
        tempPosition = getMiddle(prev.position, next.position);
      }
    }
    // 本地状态更新
    state().move(activeId, tempPosition, targetStatus);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) {
        return;
      }
      // 如果id相等，跨列移动
      if (active.id === over.id) {
        // 同步数据
        const overData = over.data.current as Task;
        moveTask(over.id as number, overData.position, overData.status);
        return;
      }

      const overId = over.id as string;

      // 目标区域是空列
      if (COLUMNS.includes(overId as TaskStatus)) {
        const targetList = state().tasks.filter(
          (t) =>
            t.status === (overId as TaskStatus) &&
            t.id !== (active.id as number),
        );
        const last = targetList[targetList.length - 1];
        const newPosition = getLast(last?.position);
        moveTask(active.id as number, newPosition, overId as TaskStatus);
        return;
      }

      const overData = over.data.current as Task;
      // 取出当前列完整列表（含 active），模拟拖拽后的新顺序
      const fullList = state().tasks.filter(
        (t) => t.status === overData.status,
      );
      const activeIndex = fullList.findIndex(
        (t) => t.id === (active.id as number),
      );
      const overIndex = fullList.findIndex((t) => t.id === overData.id);

      const newOrder = arrayMove(fullList, activeIndex, overIndex);
      const newActiveIndex = newOrder.findIndex(
        (t) => t.id === (active.id as number),
      );
      const prev = newActiveIndex > 0 ? newOrder[newActiveIndex - 1] : null;
      const next =
        newActiveIndex < newOrder.length - 1
          ? newOrder[newActiveIndex + 1]
          : null;

      let newPosition: string;
      if (!prev) {
        newPosition = getFirst(next!.position);
      } else if (!next) {
        newPosition = getLast(prev.position);
      } else {
        newPosition = getMiddle(prev.position, next.position);
      }

      moveTask(active.id as number, newPosition, overData.status);
    },
    [moveTask],
  );

  const handleDragCancel = useCallback(() => {}, []);

  return {
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    handleDragCancel,
    activeTask,
  };
};
