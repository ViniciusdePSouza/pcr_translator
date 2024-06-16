import styled from "styled-components";

export const Content = styled.div`
  width: 100%;
  padding: 2.4rem 1.2rem;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS.GRAY_50};
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;

  background-color: ${({ theme }) => theme.COLORS.WHITE_100};
`;

export const Menu = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;

  padding: 0.4rem;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 18px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  align-items: center;

  > h1 {
    font-size: 2.4rem;
    font-weight: 700;
    text-align: center;
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    margin-bottom: 1.8rem;
  }
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 2.4rem;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.COLORS.PRIMARY};
  margin-bottom: 1.8rem;
`;