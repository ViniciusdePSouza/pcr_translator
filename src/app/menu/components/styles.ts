import styled from "styled-components";

export const Container = styled.button<{ isReady: boolean }>`
  all: unset;

  border-radius: 8px;
  padding: 1.2rem;
  background-color: ${({ theme, isReady }) =>
    isReady ? theme.COLORS.PRIMARY : theme.COLORS.GRAY_200};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 2.4rem;

  font-size: 1.6rem;
  font-weight: 400;
  color: ${({ theme }) => theme.COLORS.WHITE_100};

  cursor: ${({ isReady }) => (isReady ? "pointer" : "not-allowed")};

  @media (min-width: 768px) and (max-width: 1024px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const ContainerIcon = styled.a`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.8rem;

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.COLORS.WHITE_100};
  padding: 0.8rem;

  margin-top: 1.2rem;

  cursor: pointer;
  color: unset;

  @media (min-width: 768px) and (max-width: 1024px) {
    width: 50%;
    margin-top: 0;
    gap: 2rem;
  }
`;
