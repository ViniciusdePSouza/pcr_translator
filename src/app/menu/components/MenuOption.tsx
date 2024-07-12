import { ButtonHTMLAttributes } from "react";

import { Container } from "./styles";

interface MenuOptionsProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isReady: boolean;
  title: string;
  onClick: () => void
}

export function MenuOptions({
  isReady,
  title,
  onClick,
  ...rest
}: MenuOptionsProps) {
  return (
    <Container type="button" {...rest} disabled={!isReady} isReady={isReady} onClick={onClick}>
      {title}
    </Container>
  );
}
