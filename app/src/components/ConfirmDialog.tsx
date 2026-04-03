import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "确认删除",
  description = "删除后无法恢复，确认要删除这个任务吗？",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            删除
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
