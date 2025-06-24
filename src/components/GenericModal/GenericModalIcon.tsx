import { ReactNode } from "react";
import { IconContainer } from "./styles";

interface GenericModalIconProps {
  icon: ReactNode;
}

export function GenericModalIcon({ icon }: GenericModalIconProps) {
  return  <IconContainer>{icon}</IconContainer>
}