import { Container } from "./styles";
interface HeaderProps {
  title: string;
}
export function Header({ title }: HeaderProps) {
  return (
    <Container>
      <h1>{title}</h1>
    </Container>
  );
}
