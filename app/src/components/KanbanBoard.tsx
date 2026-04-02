import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Task, TaskStatus, CreateTaskDto } from "../types/task";
import { useTaskStore } from "../store/taskStore";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { TaskDialog } from "./TaskDialog";

const COLUMNS: TaskStatus[] = ["todo", "in_progress", "done"];

export function KanbanBoard() {
  const { tasks, loading, fetchTasks, addTask, editTask, removeTask, moveTask } =
    useTaskStore();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getColumnTasks = useCallback(
    (status: TaskStatus) =>
      tasks
        .filter((t) => t.status === status)
        .sort((a, b) => a.position - b.position),
    [tasks]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    // If dropping over a column directly
    if (COLUMNS.includes(overId as TaskStatus)) {
      if (activeTaskItem.status !== overId) {
        const targetTasks = getColumnTasks(overId as TaskStatus);
        moveTask(activeId, overId as TaskStatus, targetTasks.length);
      }
      return;
    }

    // If dropping over another task
    const overTask = tasks.find((t) => t.id === overId);
    if (!overTask) return;

    if (activeTaskItem.status !== overTask.status) {
      const targetTasks = getColumnTasks(overTask.status);
      const overIndex = targetTasks.findIndex((t) => t.id === overId);
      moveTask(activeId, overTask.status, overIndex);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    // Determine target status and position
    let targetStatus = activeTaskItem.status;
    let targetPosition = activeTaskItem.position;

    if (COLUMNS.includes(overId as TaskStatus)) {
      targetStatus = overId as TaskStatus;
      const targetTasks = getColumnTasks(targetStatus);
      targetPosition = targetTasks.length;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        targetStatus = overTask.status;
        const targetTasks = getColumnTasks(targetStatus);
        targetPosition = targetTasks.findIndex((t) => t.id === overId);
      }
    }

    if (
      activeTaskItem.status !== targetStatus ||
      activeTaskItem.position !== targetPosition
    ) {
      moveTask(activeId, targetStatus, targetPosition);
    }
  };

  const handleAdd = (status: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await removeTask(id);
  };

  const handleDialogSubmit = async (data: CreateTaskDto) => {
    if (editingTask) {
      await editTask(editingTask.id, {
        title: data.title,
        description: data.description,
      });
    } else {
      await addTask(data);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        加载中...
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={getColumnTasks(status)}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          )}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
        onSubmit={handleDialogSubmit}
      />
    </>
  );
}
