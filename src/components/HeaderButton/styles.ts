import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p {
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    font-size: 1.2rem;
    margin: .8rem 0;
  }
  button { 
    all: unset;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
      transition: transform 0.3s ease;
    }
  }
`