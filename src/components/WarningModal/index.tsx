import { Dispatch, ReactNode, SetStateAction } from "react";
import { Button } from "../Button";
import { ButtonContainer, IconContainer, ModalContainer, ModalContent, Text } from "./styles";

interface WarningModalProps {
  showModal: boolean;
  primaryButtonText:string;
  secondaryButtonText: string;
  icon: ReactNode;
  text: string;
  onConfirm: () => void;
  onCancel: () => void
}

export function WarningModal({text, icon, showModal, primaryButtonText, secondaryButtonText, onConfirm, onCancel}: WarningModalProps) { 
  return (
    <ModalContainer show={showModal}>
      <ModalContent>
        <IconContainer>{icon}</IconContainer>
        <Text>{text}</Text>
        <ButtonContainer>
          <Button title={secondaryButtonText} isLoading={false} onClick={onCancel} variant={"SECONDARY"}/>
          <Button title={primaryButtonText} isLoading={false} onClick={onConfirm}/>
        </ButtonContainer>
      </ModalContent>
    </ModalContainer>
  );
}
