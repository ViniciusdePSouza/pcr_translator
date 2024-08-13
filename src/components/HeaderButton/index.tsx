"use client";

import { Container } from "./styles";
import { ReactElement, RefAttributes } from "react";

interface HeaderButtonProps {
  label: string;
  onClick: () => void;
  icon: ReactElement<any, any>;
}

export function HeaderButton({ label, onClick, icon }: HeaderButtonProps) {
  return (
    <Container>
      <button onClick={onClick}>
        {icon}
      <p>{label}</p>
      </button>
    </Container>
  );
}
