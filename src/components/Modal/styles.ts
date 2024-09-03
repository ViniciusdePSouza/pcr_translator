import { styled } from "styled-components";

export const Container = styled.div`
  padding: 1.2rem;
  border-radius: 8px;
  align-items: center;
  width: 100%;
  max-width: 75rem;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.WHITE_100};

  @media (max-width: 1025px) {
    width: 75%;
  }
`;
