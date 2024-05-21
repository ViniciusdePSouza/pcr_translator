import { InputHTMLAttributes, ButtonHTMLAttributes } from "react";
import { CandidateProps } from "./candidates";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  label: string;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  isLoading: boolean;
}

export interface CandidateCardProps {
  candidate: CandidateProps;
}
