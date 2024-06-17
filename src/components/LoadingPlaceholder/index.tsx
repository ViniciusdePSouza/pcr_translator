import { LoadingPlaceholderProps } from "@/@types";
import { Loading } from "../Loading";
import { Container } from "./styles";

export function LoadingPlaceholder({message}: LoadingPlaceholderProps) {
  return (
    <Container>
      <h1>{message}</h1>
      <Loading />
    </Container>
  );
}
