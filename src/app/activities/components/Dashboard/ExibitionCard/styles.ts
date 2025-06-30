import styled from "styled-components";

export const Container = styled.div`
  background-color:${({ theme }) => theme.COLORS.WHITE};
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
  padding: 1rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  span:first-child {
    font-size: 0.9rem;
    color: #555;
    font-weight: 500;
    margin-bottom: 0.3rem;
  }

  span:last-child {
    font-size: 2rem;
    font-weight: bold;
    color: #1f2937;
  }
`;