import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Task, TaskStatus, CreateTaskDto } from "../types/task";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface TaskFormValues {
  title: string;
  description: string;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
  onSubmit: (data: Omit<CreateTaskDto, 'position'>) => void;
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  defaultStatus = "todo",
  onSubmit,
}: TaskDialogProps) {
  const { register, handleSubmit, reset, formState: { isValid } } = useForm<TaskFormValues>({
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      title: task?.title ?? "",
      description: task?.description ?? "",
    });
  }, [task, open, reset]);

  const onFormSubmit = (data: TaskFormValues) => {
    if (!data.title.trim()) return;
    onSubmit({
      title: data.title.trim(),
      description: data.description.trim(),
      status: task?.status ?? defaultStatus,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "编辑任务" : "新建任务"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">标题</label>
            <Input
              {...register("title", { required: true, validate: v => v.trim().length > 0 })}
              placeholder="输入任务标题"
              className="mt-1"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">描述</label>
            <Textarea
              {...register("description")}
              placeholder="输入任务描述（可选）"
              className="mt-1"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={!isValid}>
              {task ? "保存" : "创建"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
