import { Container } from "./styles";

type ContentComponentType = React.ReactNode;

// Props do componente Modal
interface ModalProps {
  content: ContentComponentType;
}

export function Modal({ content }: ModalProps) {
  return <Container>{content}</Container>;
}
