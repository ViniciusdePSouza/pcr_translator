import { Text } from "./styles";

interface GenericModalTextProps {
  text: string;
}

export function GenericModalText({ text }: GenericModalTextProps) {
  return <Text>{text}</Text>;
}
