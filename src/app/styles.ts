import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  min-height: 100vh;

  background-color: ${({ theme }) => theme.COLORS.WHITE_100};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 18px;
  width: 80%;
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

  @media (min-width: 1024px) {
    width: 50%;
  }
`;

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.COLORS.RED};
  font-size: 16px;
  font-weight: 400;
  margin-top: .8rem;
`;
