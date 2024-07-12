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

  span {
    font-size: 1.8rem;
    font-weight: 400;
    text-align: center;
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    margin-bottom: 1.8rem;
  }
`;

export const MenuWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.8rem;
`;

export const MenuTitle = styled.h1`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  margin-bottom: .8rem;
  `
