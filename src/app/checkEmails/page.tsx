"use client";

import { Header } from "@/components/Header";
import { Container, Content } from "./styles";
import { Modal } from "@/components/Modal";
import { CandidateProps, CheckedEmailProps } from "@/@types";
import { useCandidates } from "../hooks/candidatesContext";
import { validateEmail } from "@/services/ZeroBounce/emailService";
import { useState } from "react";
import { Button } from "@/components/Button";

export default function CheckEmails() {
  const { allCandidates, saveCandidates } = useCandidates();
  const [isLoading, setIsLoading] = useState(false);

  function getCandidatesEmails(candidates: CandidateProps[]) {
    const emailsBatch = candidates.map((candidate) => {
      if (candidate.EmailAddress == null) return "";

      return candidate.EmailAddress;
    });
    return emailsBatch;
  }

  async function handleClick() {
    setIsLoading(true);
    const emailsBatch = getCandidatesEmails(allCandidates);
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
      const checkedCandidates = allCandidates.map((candidate) => {
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
      saveCandidates(checkedCandidates);
      setIsLoading(false);
      return checkedCandidates;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  return (
    <Container>
      <Header title={"Check your candidates emails !"} />
      <Content>
        <Modal content={<Button title={"Check Emails"} isLoading={isLoading} onClick={handleClick}/>} />
      </Content>
    </Container>
  );
}
