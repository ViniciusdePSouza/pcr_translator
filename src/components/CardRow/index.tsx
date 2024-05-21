import { Container, Title, Text } from "./styles";

interface CardRowProps {
    title: string;
    content: string;
}

export function CardRow({title, content}: CardRowProps) {
  return (
    <Container>
      <Title>{title}:</Title> <Text>{content}</Text>
    </Container>
  );
}
