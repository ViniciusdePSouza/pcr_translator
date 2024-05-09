import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  min-height: 100vh;

  >h1{ 
    color: ${({ theme }) => theme.COLORS.PRIMARY};
  };
  
`;