import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding: 1.2rem 0.8rem;

  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS.PURPLE_300};

  border-radius: 8px;
  -webkit-box-shadow: 10px 10px 22px -8px rgba(71, 41, 123, 1);
  -moz-box-shadow: 10px 10px 22px -8px rgba(71, 41, 123, 1);
  box-shadow: 10px 10px 22px -8px rgba(71, 41, 123, 1);

  @media (min-width: 768px) and (max-width: 1024px) {
    width: 90%;
  }

  @media (min-width: 1025px) {
    width: 95%;
  }
`;

export const Row = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 1.2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;
