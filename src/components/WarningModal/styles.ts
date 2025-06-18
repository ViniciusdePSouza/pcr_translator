import styled from "styled-components";

interface ModalContainerProps {
  show: boolean;
}

export const ModalContainer = styled.div<ModalContainerProps>`
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
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  opacity: ${(props) => (props.show ? "1" : "0")};
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
`;

export const IconContainer = styled.div`
  width: 100%;
  font-size: 48px;
`;

export const Text = styled.p`
  font-size: 1.6rem;
  text-align: start;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 1.2rem;
`;
