import { styled } from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.COLORS.WHITE_100};
`;

export const Content = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS.GRAY_50};
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

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.COLORS.RED};
  font-size: 16px;
  font-weight: 400;
  margin-top: .8rem;
`;
