import styled from "styled-components";

export const Container = styled.header`
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.4rem 0;
  position: relative;

  background-color: ${({ theme }) => theme.COLORS.PRIMARY};

  h1 {
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    width: 95%;
    text-align: center;
    font-size: 2.4rem;
  }
`;

export const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 0%;
  left: 0%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3.2rem;

  margin-left: 2.4rem;

  @media (max-width: 1025px) {
    margin-left: 1.2rem;
  }
`;
