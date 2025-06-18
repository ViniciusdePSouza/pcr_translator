'use client'

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

import { Container, Filler } from "./styles";

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <Container>
      <Filler width={progress} />
    </Container>
  );
}
