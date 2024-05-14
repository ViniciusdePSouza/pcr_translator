import styled from "styled-components";

export const Container = styled.button`
  all: unset;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1.2rem 0;

  margin-top: 2.6rem;

  font-size: 2rem;
  font-weight: 700;

  border-radius: 8px;

  color: ${({ theme }) => theme.COLORS.GRAY_200};

  background: ${({ theme }) => theme.COLORS.SECONDARY};

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
