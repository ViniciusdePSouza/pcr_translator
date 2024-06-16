import { styled } from "styled-components";

export const Container = styled.div`
  padding: 1.2rem;
  border-radius: 8px;
  align-items: center;
  width: 80%;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.WHITE_100};
`;
