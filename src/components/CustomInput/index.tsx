import { forwardRef, useRef } from "react";
import { Container } from "./styles";
import { CustomInputProps } from "@/@types";

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, placeholder, ...rest }, ref) => {
    const internalRef = useRef<HTMLInputElement | null>(null);

    const setRefs = (el: HTMLInputElement | null) => {
      internalRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };
    return (
      <Container onClick={() => internalRef.current?.showPicker?.()}>
        <label>{label}</label>
        <input ref={setRefs} placeholder={placeholder} {...rest} />
      </Container>
    );
  }
);
