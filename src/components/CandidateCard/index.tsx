import { User } from "phosphor-react";
import { Container, Row } from "./styles";

import { defaultTheme } from "@/app/styles/theme/default";
import { CandidateCardProps } from "@/@types";
import { CardRow } from "../CardRow";

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Container>
      <User size={32} weight="fill" color={defaultTheme.COLORS.SECONDARY} />
      <Row>
        <CardRow
          title={"Name"}
          content={`${candidate.FirstName} ${candidate.LastName}`}
        />
        <CardRow
          title={"Email"}
          content={
            candidate.EmailAddress ? `${candidate.EmailAddress}` : "Not Registered"
          }
        />
        <CardRow title={"Title"} content={`${candidate.Title}`} />
      </Row>
    </Container>
  );
}
