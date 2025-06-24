import { ReactNode } from "react";
import { ModalContainer } from "./styles";

interface GenericModalRootProps {
  children: ReactNode;
  show: boolean;
}

export function GenericModalRoot({show, children }: GenericModalRootProps) {
  if (!show) return null; 
  return <ModalContainer >{children}</ModalContainer>;
}
