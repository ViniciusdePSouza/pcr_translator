"use client";

import { useEffect, useState } from "react";
import { useUser } from "../hooks/userContext";

import { CandidateFields, CandidateProps } from "@/@types";
import { Header } from "@/components/Header";
import { CandidatesWrapper, Container, Footer, Wrapper } from "./styles";
import { CandidateCard } from "@/components/CandidateCard";
import { ArrowLeft, ArrowRight } from "phosphor-react";
import { defaultTheme } from "../styles/theme/default";
import { getCandidates } from "@/services/PCR/candidatesService";
import { UtilsBar } from "@/components/UtilsBar";

export default function Home() {
  const { user } = useUser();

  const [page, setPage] = useState(1);
  const [qtPerPage, setQtPerPage] = useState(12);
  const [totalResults, setTotalResults] = useState(0);
  const [candidates, setCandidates] = useState<CandidateProps[]>([])

  async function fetchCandidates(
    sessionId: string,
    userName: string,
    fieldParams: CandidateFields[],
    page: number,
    resultsPerPage: number
  ) {
    try {
      const response = await getCandidates(
        sessionId,
        userName,
        fieldParams,
        page,
        resultsPerPage
      );

      const candidates = response.Results.map((candidate: CandidateProps) => {
        return {
          ...candidate, 
          status: "", 
          sub_status: ""
        };
      })

      setCandidates(candidates);
      setTotalResults(response.TotalResults);
    } catch (error) {
      console.log(error);
    }
  }

  function handlePageChange(operation: boolean) {
    if (operation) {
      setPage((state) => state + 1);
    } else {
      if (page === 0) return;
      setPage((state) => state - 1);
    }
  }

  useEffect(() => {
    fetchCandidates(
      user.SessionId,
      user.Login,
      ["FirstName", "LastName", "EmailAddress", "UserName", "Title"],
      page,
      qtPerPage
    );
  }, [user, page]);

  return (
    <Wrapper>
      <Container>
        <Header title={"See your candidates"} />
        <UtilsBar candidates={candidates}/>
        <CandidatesWrapper>
          
        {candidates &&
          candidates.map((candidate) => (
            <CandidateCard candidate={candidate} />
          ))}
          </CandidatesWrapper>
      </Container>
      <Footer>
        <button onClick={() => handlePageChange(false)} disabled={page <= 1}>
          <ArrowLeft size={32} color={page > 1 ? defaultTheme.COLORS.PRIMARY : defaultTheme.COLORS.GRAY_50} />
        </button>
        <span>{page}</span>
        <button onClick={() => handlePageChange(true)}>
          <ArrowRight size={32} color={defaultTheme.COLORS.PRIMARY} />
        </button>
      </Footer>
    </Wrapper>
  );
}
