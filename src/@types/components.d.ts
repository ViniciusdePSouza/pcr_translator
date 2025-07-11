import { InputHTMLAttributes, ButtonHTMLAttributes } from "react";
import { CandidateProps } from "./candidates";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  label: string;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  isLoading: boolean;
  variant?: ButtonVariantColor
}

export interface CandidateCardProps {
  candidate: CandidateProps;
}

export interface UtilsBarProps {
  candidates: CandidateProps[];
}

export interface LoadingPlaceholderProps {
  message: string;
}
