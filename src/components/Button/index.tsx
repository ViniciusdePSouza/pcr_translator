import { ButtonProps } from "@/@types";
import { Container } from "./styles";

export function Button({ title, isLoading, variant = "PRIMARY", ...rest }: ButtonProps) {
  return (
    <Container type="button" disabled={isLoading} {...rest} variant={variant}>
      {isLoading ? "Loading" : title}
    </Container>
  );
}
