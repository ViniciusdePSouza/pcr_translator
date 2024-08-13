import { styled } from "styled-components";

export const Container = styled.div`
  padding: 1.2rem;
  border-radius: 8px;
  align-items: center;
  width: 100%;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.WHITE_100};

  @media (min-width: 768px) {
    width: 30%;
  }
`;
