import styled from "styled-components";

export const Container = styled.button<{ isready: boolean }>`
  all: unset;

  border-radius: 8px;
  padding: 1.2rem;
  background-color: ${({ theme, isready }) =>
    isready ? theme.COLORS.PRIMARY : theme.COLORS.GRAY_200};

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 2.4rem;

  font-size: 1.6rem;
  font-weight: 400;
  color: ${({ theme }) => theme.COLORS.WHITE_100};

  cursor:  ${({ isready }) =>
    isready ? "pointer" : "not-allowed"};;
`;
