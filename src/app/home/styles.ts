import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY_100};
`;
export const Container = styled.div`
  flex-grow: 1;
  padding: 1.6rem;
  align-items: center;
  justify-content: center;
`;
export const CandidatesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-content: center;
  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
  }
`;
export const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 2.4rem;
  background-color: ${({ theme }) => theme.COLORS.SECONDARY};

  span {
    color: ${({ theme }) => theme.COLORS.PRIMARY};
    font-size: 2.4rem;
    font-weight: 700;
  }

  button {
    all: unset;
    padding: 0 0.8rem;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
    }
  }
`;
