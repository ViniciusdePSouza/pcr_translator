import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 1.6rem;
  label {
    width: 100%;
    text-align: start;
    color: ${({ theme }) => theme.COLORS.YELLOW_300};
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
  }

  input {
    all: unset;
    width: 100%;

    background-color: ${({ theme }) => theme.COLORS.PURPLE_100};

    border-radius: 8px;
    border: none;

    color: ${({ theme }) => theme.COLORS.GRAY_200};
    font-size: 1.2rem;
    font-weight: 900;

    padding: 0.5rem 0.5rem;
  }
`;
