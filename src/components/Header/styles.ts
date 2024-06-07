import styled from "styled-components";

export const Container = styled.header`
  width: 100%;

  text-align: center;
  align-items: center;
  justify-content: center;

  padding: 1.2rem 0.4rem;

  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  h1 {
    color: ${({ theme }) => theme.COLORS.WHITE_100};
  }
`;
