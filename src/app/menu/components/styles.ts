import styled from "styled-components";

export const Container = styled.button<{ isReady: boolean }>`
  all: unset;

  border-radius: 8px;
  padding: 1.2rem;
  background-color: ${({ theme, isReady }) =>
    isReady ? theme.COLORS.PRIMARY : theme.COLORS.GRAY_200};

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 1.6rem;
  font-weight: 400;
  color: ${({ theme }) => theme.COLORS.WHITE_100};

  cursor:  ${({ theme, isReady }) =>
    isReady ? "pointer" : "not-allowed"};;
`;
