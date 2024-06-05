import { validateEmail } from "@/services/ZeroBounce/emailService";
import { Button } from "../Button";
import { ButtonWrapper, Container } from "./styles";
import { CandidateProps, UtilsBarProps } from "@/@types";
import { useState } from "react";

export function UtilsBar({ candidates }: UtilsBarProps) {
  const [x, setX] = useState<any>([]);

  function getCandidatesEmails(candidates: CandidateProps[]) {
    const emailsBatch = candidates.map((candidate) => {
      if (candidate.EmailAddress == null) return "";

      return candidate.EmailAddress;
    });
    return emailsBatch;
  }

  async function handleClick() {
    const emailsBatch = getCandidatesEmails(candidates);

    const apikEY = prompt("please enter your apikey address");

    const checkedEmails = await validateEmail(apikEY!, emailsBatch);

    const checkedCandidates = candidates.map((candidate) => {
      const updatedCandidate = candidate;
      checkedEmails?.forEach((item) => {
        if (item.emailAddress === candidate.EmailAddress) {
          updatedCandidate.status = item.status;
          updatedCandidate.sub_status = item.sub_status;
        }
      });
      return updatedCandidate;
    })
    
    return checkedCandidates
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
