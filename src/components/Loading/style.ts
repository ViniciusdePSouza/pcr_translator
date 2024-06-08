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

export const Loader = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid ${({ theme }) => theme.COLORS.PRIMARY};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
