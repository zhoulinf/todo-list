import { forwardRef } from "react";
import type { Task, TaskStatus } from "../types/task";
import { TaskCard } from "./TaskCard";
import { Sortable, SortableContext } from "./Sortable";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

import { cn } from "../lib/utils";
import { Dropable } from "./Dropable";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: "待处理", color: "bg-gray-500" },
  in_progress: { label: "进行中", color: "bg-blue-500" },
  done: { label: "已完成", color: "bg-green-500" },
};

export interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  className?: string;
  onAdd?: (status: TaskStatus) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
}

export const Column = forwardRef<HTMLDivElement, ColumnProps>((props, ref) => {
  const { status, tasks, className, onAdd, onEdit, onDelete } = props;
  const config = STATUS_CONFIG[status];

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col rounded-xl bg-gray-100 p-4 min-h-[200px] transition-colors",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${config.color}`} />
          <h2 className="text-sm font-semibold text-gray-700">
            {config.label}
          </h2>
          <span className="text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onAdd?.(status)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Dropable id={status}>
        <div className="flex flex-col gap-2 flex-1">
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <Sortable key={task.id} id={task.id} data={task}>
                <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
              </Sortable>
            ))}
          </SortableContext>
        </div>
      </Dropable>
    </div>
  );
});
