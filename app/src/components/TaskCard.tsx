import { forwardRef } from "react";
import type { Task } from "../types/task";
import { Button } from "./ui/button";
import {Pencil, Trash2 } from "lucide-react";

interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onEdit, onDelete, style, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`rounded-lg border border-gray-200 bg-white p-3 shadow-sm ${className ?? ""}`}
        {...rest}
      >
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {task.title}id: {task.id}
            </h3>
            {task.description && (
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                {task.description}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => onEdit?.(task)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete?.(task.id)}>
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

TaskCard.displayName = "TaskCard";
