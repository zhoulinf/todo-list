import { useCallback, useEffect, useMemo, useState } from "react";
import { Column } from "./components/Column";
import { useTaskStore } from "./store/taskStore";
import { useTaskActions } from "./hooks/useTaskActions";
import type { Task, TaskStatus } from "./types/task";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { TaskCard } from "./components/TaskCard";
import { TaskDialog } from "./components/TaskDialog";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { useTaskDrag } from "./hooks/useTaskDrag";

function App() {
  const taskList = useTaskStore((state) => state.tasks);
  const { fetchTasks, addTask, editTask, removeTask } = useTaskActions();
  const { activeTask, handleDragEnd, handleDragOver, handleDragStart, handleDragCancel } = useTaskDrag();
  const columns = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = { todo: [], in_progress: [], done: [] };
    for (const task of taskList) {
      grouped[task.status].push(task);
    }
    return [
      { status: "todo" as const, tasks: grouped.todo },
      { status: "in_progress" as const, tasks: grouped.in_progress },
      { status: "done" as const, tasks: grouped.done },
    ];
  }, [taskList]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // 新建 / 编辑弹窗状态
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");
  // 删除确认弹窗状态
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  const handleAdd = useCallback((status: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback((id: number) => {
    setDeletingTaskId(id);
    setConfirmOpen(true);
  }, []);

  const handleDialogSubmit = useCallback(
    (data: { title: string; description: string; status: TaskStatus }) => {
      if (editingTask) {
        editTask(editingTask.id, {
          title: data.title,
          description: data.description,
        });
      } else {
        addTask(data);
      }
    },
    [editingTask, editTask, addTask],
  );

  const handleConfirmDelete = useCallback(() => {
    if (deletingTaskId !== null) {
      removeTask(deletingTaskId);
    }
  }, [deletingTaskId, removeTask]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900">任务看板</h1>
        <p className="text-sm text-gray-500 mt-1">
          拖拽任务卡片来更改状态或调整排序
        </p>
      </header>
      <main className="max-w-5xl mx-auto flex gap-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          {columns.map((col) => {
            return (
              <Column
                key={col.status}
                tasks={col.tasks}
                status={col.status}
                className="flex-1"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })}
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </main>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
        onSubmit={handleDialogSubmit}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default App;
