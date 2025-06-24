import { Button } from "../Button";
import { ButtonContainer } from "./styles";

interface GenericModalActionsProps {
  primaryButtonText: string;
  secondaryButtonText?: string;
  primaryButtonClick: () => void;
  secondaryButtonClick?: () => void;
}

export function GenericModalActions({
  primaryButtonText,
  secondaryButtonText,
  primaryButtonClick,
  secondaryButtonClick,
}: GenericModalActionsProps) {
  return (
    <ButtonContainer>
      {secondaryButtonText && (
        <Button
          title={secondaryButtonText}
          isLoading={false}
          onClick={secondaryButtonClick}
          variant={"SECONDARY"}
        />
      )}
      <Button
        title={primaryButtonText}
        isLoading={false}
        onClick={primaryButtonClick}
        variant={"PRIMARY"}
      />
    </ButtonContainer>
  );
}
