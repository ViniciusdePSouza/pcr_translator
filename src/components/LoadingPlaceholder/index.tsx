import { Loading } from "../Loading";
import { Container } from "./styles";

interface LoadingPlaceholderProps {
  message: string; // Define message as a string type
}

export function LoadingPlaceholder({message}: LoadingPlaceholderProps) {
  return (
    <Container>
      <h1>{message}</h1>
      <Loading />
    </Container>
  );
}
