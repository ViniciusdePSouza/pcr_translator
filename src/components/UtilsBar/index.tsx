import { validateEmail } from "@/services/ZeroBounce/emailService";
import { Button } from "../Button";
import { ButtonWrapper, Container } from "./styles";
import { CandidateProps, CheckedEmailProps, UtilsBarProps } from "@/@types";
import { useEffect } from "react";

export function UtilsBar({ candidates }: UtilsBarProps) {
  function getCandidatesEmails(candidates: CandidateProps[]) {
    const emailsBatch = candidates.map((candidate) => {
      if (candidate.EmailAddress == null) return "";

      return candidate.EmailAddress;
    });
    return emailsBatch;
  }

  async function handleClick() {
    const emailsBatch = getCandidatesEmails(candidates);
    const loops = Math.ceil(emailsBatch.length / 200);

    const apikEY = prompt("please enter your apikey address");

    let checkedEmails: CheckedEmailProps[] = [] as CheckedEmailProps[];
    try {
      for (let i = 0; i < loops; i++) {

        const emailsBatchSubset = emailsBatch.slice(i * 200, i * 200 + 199);

        let responseZeroBounce = await validateEmail(
          apikEY!,
          emailsBatchSubset
        );

        if (responseZeroBounce === undefined) {
          responseZeroBounce = [] as CheckedEmailProps[];
        }

        checkedEmails = [...checkedEmails, ...responseZeroBounce];
      }
      const checkedCandidates = candidates.map((candidate) => {
        const updatedCandidate = candidate;
        checkedEmails.forEach((item: CheckedEmailProps) => {
          if (item.emailAddress === candidate.EmailAddress) {
            updatedCandidate.status = item.status;
            updatedCandidate.sub_status = item.sub_status;
          }
        });
        return updatedCandidate;
      });
      console.log(checkedCandidates);
      return checkedCandidates;
    } catch (error) {
      console.log(error);
    }
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
