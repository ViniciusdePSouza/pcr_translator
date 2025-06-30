import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  padding: 1.2rem;
  gap: 0.8rem;

  h1 {
    text-align: center;
    color: ${({ theme }) => theme.COLORS.GRAY_500};
    font-size: 2.4rem;
  }
`;

export const CardsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  margin-top: 2rem;
`;

export const SubtitleInfo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;

  h3 {
    color: ${({ theme }) => theme.COLORS.GRAY_100};
   font-size: 1.2rem ;
  }
`;

export const Divisor = styled.div`
width: 5px;
height: 5px;
border-radius: 100%;

background-color: ${({ theme }) => theme.COLORS.GRAY_100};
`
