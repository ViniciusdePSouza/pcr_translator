import styled from "styled-components";

export const Container = styled.header`
  width: 100%;

  text-align: center;
  align-items: center;
  justify-content: center;

  margin-bottom: 2.4rem;

  h1 {
    color: ${({ theme }) => theme.COLORS.PRIMARY};
  }
`;
