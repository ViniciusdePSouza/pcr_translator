import styled from "styled-components";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const Container = styled.div`
  width: 100%;
  height: 12px;
  background-color: ${({ theme }) => theme.COLORS.WHITE_100};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.2rem;
`;

export const Filler = styled.div<{ width: number }>`
  height: 100%;
  background-color: ${({ theme }) => theme.COLORS.SECONDARY};
  width: ${({ width }) => `${width}%`};
  transition: width 0.3s ease-in-out;
`;
