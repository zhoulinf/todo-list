import { cloneElement, type ReactElement } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export interface DraggableInjectedProps {
  ref: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
}

interface DraggableProps {
  id: string | number;
  children: ReactElement<Partial<DraggableInjectedProps>>;
}

export function Draggable({ id, children }: DraggableProps) {
  const {
    setNodeRef,
    attributes, listeners, transform 
  } = useDraggable({ id });

  const style ={
    transform: CSS.Transform.toString(transform),
  }

  return cloneElement(children, {
    ref: setNodeRef,
    style: { ...children.props.style, ...style },
    ...attributes,
    ...listeners,
  });
}
