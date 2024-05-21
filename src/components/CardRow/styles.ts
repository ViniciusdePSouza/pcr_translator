import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.span`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.COLORS.SECONDARY};
  font-weight: 700;
  margin-bottom: 0.4rem;
  @media (min-width: 1024px) {
    font-size: 1.6rem;
  }
`;

export const Text = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.COLORS.WHITE_100};
  font-weight: 700;

  @media (min-width: 1024px) {
    font-size: 1.2rem;
  }
`;
