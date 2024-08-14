import { Container } from "./styles";

type ContentComponentType = React.ReactNode;

interface ModalProps {
  content: ContentComponentType;
}

export function Modal({ content }: ModalProps) {
  return <Container>{content}</Container>;
}
