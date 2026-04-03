import { cloneElement, type ReactElement } from "react";
import { useDroppable } from "@dnd-kit/core";

export interface DropableInjectedProps {
  ref: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
}

interface DropableProps {
  id: string | number;
  children: ReactElement<Partial<DropableInjectedProps>>;
}

export function Dropable({ id, children }: DropableProps) {
  const {
    setNodeRef,
  } = useDroppable({ id });

  return cloneElement(children, {
    ref: setNodeRef,
  });
}
