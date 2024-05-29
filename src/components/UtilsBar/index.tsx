import { validateEmail } from "@/services/ZeroBounce/emailService";
import { Button } from "../Button";
import { ButtonWrapper, Container, Modal } from "./styles";
import { CandidateProps, UtilsBarProps } from "@/@types";
import { useState } from "react";

export function UtilsBar({ candidates }: UtilsBarProps) {
  function getCandidatesEmails(candidates: CandidateProps[]) {
    const emailsBatch = candidates.map((candidate) => candidate.EmailAddress);

    return emailsBatch;
  }

  function handleClick() {
    const emailsBatch = getCandidatesEmails(candidates);

    const apikEY = prompt("please enter your apikey address");

    validateEmail(apikEY!, emailsBatch);
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
