import styled from "styled-components";

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  visibility: "visible";
  opacity: "1";
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: ${({ theme }) => theme.COLORS.GRAY_50};
`;

export const IconContainer = styled.div`
  font-size: 48px;
`;

export const Text = styled.p`
  font-size: 1.6rem;
  text-align: start;
  color: ${({ theme }) => theme.COLORS.GRAY_700};

   max-height: 30rem; 
  overflow-y: auto;

  scrollbar-width: thin; 
  scrollbar-color: ${({ theme }) => theme.COLORS.GRAY_50} transparent; 
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 1.2rem;
`;
