import { useCallback, useState } from "react";
import type { Task, TaskStatus } from "../types/task";
import { useTaskActions } from "./useTaskActions";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
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

  /** 跨列拖动时临时更新 store，让目标列的 SortableContext 包含该卡片以显示占位 */
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
      // 放在 over 之前
      const overData = over.data.current as Task;
      const overIndex = targetList.findIndex((t) => t.id === overData.id);
      const prev = targetList[overIndex - 1];
      if (!prev) {
        tempPosition = getFirst(overData.position);
      } else {
        tempPosition = getMiddle(prev.position, overData.position);
      }
    }
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
      // 排除 active 自身，计算目标列中的相对位置
      const list = state().tasks.filter(
        (t) => t.status === overData.status && t.id !== (active.id as number),
      );
      const overIndex = list.findIndex((t) => t.id === overData.id);

      const activeRect = active.rect.current.translated;
      const overRect = over.rect;
      const isDraggingDown = activeRect
        ? activeRect.top + activeRect.height / 2 >
          overRect.top + overRect.height / 2
        : false;

      let newPosition: string;
      if (isDraggingDown) {
        // 放在 over 之后（over 与 next 之间）
        const next = list[overIndex + 1];
        if (!next) {
          newPosition = getLast(overData.position);
        } else {
          newPosition = getMiddle(overData.position, next.position);
        }
      } else {
        // 放在 over 之前（prev 与 over 之间）
        const prev = list[overIndex - 1];
        if (!prev) {
          newPosition = getFirst(overData.position);
        } else {
          newPosition = getMiddle(prev.position, overData.position);
        }
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
