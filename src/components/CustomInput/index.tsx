import { forwardRef } from "react";
import { Container } from "./styles";
import { CustomInputProps } from "@/@types";

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, placeholder, ...rest }, ref) => {
    return (
      <Container>
        <label>{label}</label>
        <input placeholder={placeholder} ref={ref} {...rest} />
      </Container>
    );
  }
);
