import { styled } from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    width: 80%;
    color: ${({ theme }) => theme.COLORS.PRIMARY};

    font-size: 1.6rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1.6rem;
  }
`;
