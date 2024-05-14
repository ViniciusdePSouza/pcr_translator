import { ButtonProps } from "@/@types";
import { Container } from "./styles";

export function Button({ title, isLoading, ...rest }: ButtonProps) {
  return (
    <Container type="button" disabled={isLoading} {...rest}>
      {isLoading ? "Loading" : title}
    </Container>
  );
}
