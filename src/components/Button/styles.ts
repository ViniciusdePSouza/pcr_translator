import { defaultTheme } from "@/app/styles/theme/default";
import styled from "styled-components";

export type ButtonVariantColor = "PRIMARY" | "SECONDARY" | "TERCIARY";

const buttonVariantBackgroundColor = {
  PRIMARY: `${defaultTheme.COLORS.SECONDARY};`,
  SECONDARY: `transparent`,
  TERCIARY: `transparent`,
};

const buttonVariantBorder = {
  PRIMARY: `none`,
  SECONDARY: `1px solid ${defaultTheme.COLORS.SECONDARY};`,
  TERCIARY: `1px solid ${defaultTheme.COLORS.WHITE_100}`,
};
const buttonVariantTextColor = {
  PRIMARY: `${defaultTheme.COLORS.WHITE};`,
  SECONDARY: `${defaultTheme.COLORS.SECONDARY};`,
  TERCIARY: `${defaultTheme.COLORS.WHITE_100}`,
};
const buttonVariantTextWeight = {
  PRIMARY: `700`,
  SECONDARY: `400`,
  TERCIARY: `400`,
};

export const Container = styled.button<{ variant: ButtonVariantColor }>`
  all: unset;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1.2rem 0.4rem;

  margin-top: 2.6rem;

  font-size: 2rem;
  ${(props) => `font-weight: ${buttonVariantTextWeight[props.variant]}`};

  border-radius: 8px;

  ${(props) => `color: ${buttonVariantTextColor[props.variant]}`};

  ${(props) => `background: ${buttonVariantBackgroundColor[props.variant]}`};

  ${(props) => `border: ${buttonVariantBorder[props.variant]}`};

  cursor: pointer;

  transition: transform 0.2s;

  &:active {
    box-shadow: inset -4px 4px 0 ${({ theme }) => theme.COLORS.GRAY_400};
  }

  &:disabled {
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.COLORS.GRAY_100};
  }
`;
