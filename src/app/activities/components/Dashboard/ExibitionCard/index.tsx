"use client";
import { Container } from "./styles";

interface ExibitionCardProps {
  title: string;
  amount: number;
}

export function ExibitionCard({ title, amount }: ExibitionCardProps) {
  return (
    <Container>
      <span> {title} </span>
      <span> {amount}</span>
    </Container>
  );
}
