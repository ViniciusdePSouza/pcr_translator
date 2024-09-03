import { ButtonHTMLAttributes } from "react";
import { MonitorPlay } from "phosphor-react";

import { Container, ContainerIcon } from "./styles";

interface MenuOptionsProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isReady: boolean;
  title: string;
  tutorialLink: string;
  onClick: () => void;
}

export function MenuOptions({
  isReady,
  title,
  onClick,
  tutorialLink,
  ...rest
}: MenuOptionsProps) {
  return (
    <Container
      type="button"
      {...rest}
      disabled={!isReady}
      isReady={isReady}
      onClick={onClick}
    >
      {title}
      <ContainerIcon href={tutorialLink} onClick={(e) => e.stopPropagation()} target="_blank">
        <MonitorPlay size={32} weight="fill" />
        <p>Tutorial Vídeo</p>
      </ContainerIcon>
    </Container>
  );
}
