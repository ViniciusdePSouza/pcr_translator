import { ButtonHTMLAttributes } from "react";
import { Container } from "./styles";

interface MenuOptionsProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isReady: boolean;
  title: string;
}

export function MenuOptions({ isReady, title, ...rest }: MenuOptionsProps) {
  return (
    <Container type="button" {...rest} disabled={isReady} isReady={isReady}>
      {title}
    </Container>
  );
}
