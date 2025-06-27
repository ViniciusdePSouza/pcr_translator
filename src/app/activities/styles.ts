import { styled } from "styled-components";
import { DatePicker } from 'rsuite';

export const Content = styled.div`
  width: 100%;
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

  span {
    font-size: 1.8rem;
    font-weight: 400;
    text-align: center;
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    margin-bottom: 1.8rem;
  }
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

  > h2 {
    font-size: 1.6rem;
    font-weight: 700;
    text-align: center;
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    margin: 1.2rem 0 -1.2rem 0
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

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.COLORS.RED};
  font-size: 16px;
  font-weight: 400;
  margin-top: 0.8rem;
`;

export const DateContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
`;
