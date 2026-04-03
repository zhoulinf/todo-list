import { cloneElement, type ReactElement } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { SortableContext } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface SortableInjectedProps {
  ref: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
}

interface SortableProps<T extends object = Record<string, unknown>> {
  id: string | number;
  data?: T;
  children: ReactElement<Partial<SortableInjectedProps>>;
}

export function Sortable<T extends object = Record<string, unknown>>({ id, data, children }: SortableProps<T>) {
  const { setNodeRef, transform, transition, isDragging, attributes, listeners } =
    useSortable({ id, data });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    background: isDragging ? "#f3f4f6" : undefined,
    borderRadius: isDragging ? 8 : undefined,
  };

  return cloneElement(children, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  });
}

export { SortableContext };
