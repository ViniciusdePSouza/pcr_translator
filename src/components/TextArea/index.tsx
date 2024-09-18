import { forwardRef, TextareaHTMLAttributes } from "react";
import { Container, CustomTextArea } from "./styles";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, ...rest }, ref) => {
    return (
      <Container>
        <label>{label}</label>
        <CustomTextArea ref={ref} {...rest} />
      </Container>
    );
  }
);
