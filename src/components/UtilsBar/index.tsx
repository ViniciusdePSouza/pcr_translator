import { validateEmail } from "@/services/ZeroBounce/emailService";
import { Button } from "../Button";
import { ButtonWrapper, Container } from "./styles";

export function UtilsBar() {
  const emailsBatch = ["invalid@example.com", "dev.souzavinicius@gmail.com"];
  function handleClick() {
    validateEmail("996d61bc799f43c4b4d085ebe093672a", emailsBatch);
  }

  return (
    <Container>
      <ButtonWrapper>
        <Button
          title={"Check Emails"}
          isLoading={false}
          onClick={handleClick}
        />
      </ButtonWrapper>
    </Container>
  );
}
