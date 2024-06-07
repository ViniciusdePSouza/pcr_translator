"use client";

import { useEffect, useState } from "react";
import { useUser } from "../hooks/userContext";

import { CandidateFields, CandidateProps } from "@/@types";
import { getCandidates } from "@/services/PCR/candidatesService";
import { UtilsBar } from "@/components/UtilsBar";
import { Button } from "@/components/Button";
import { createRollUpList } from "@/services/PCR/rollupService";
import { Header } from "@/components/Header";
import { Container } from "./styles";
import { Loading } from "@/components/Loading";

export default function Home() {
  const { user } = useUser();

  const [page, setPage] = useState(1);
  const [qtPerPage, setQtPerPage] = useState(500);
  const [totalResults, setTotalResults] = useState(0);
  const [candidates, setCandidates] = useState<CandidateProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function populteAllCandidates(
    sessionId: string,
    userName: string,
    fieldParams: CandidateFields[],
    resultsPerPage: number
  ) {
    const loops = Math.ceil(totalResults / qtPerPage);
    let newCandidatesArray: CandidateProps[] = [];

    for (let i = 2; i < loops + 1; i++) {
      const response = await getCandidates(
        sessionId,
        userName,
        fieldParams,
        i,
        resultsPerPage
      );

      const responseCandidates = response.Results.map(
        (candidate: CandidateProps) => {
          return {
            ...candidate,
            status: "",
            sub_status: "",
          };
        }
      );

      newCandidatesArray = [...newCandidatesArray, ...responseCandidates];

      console.log(newCandidatesArray.length);
    }

    setCandidates((prevCandidates) => [
      ...prevCandidates,
      ...newCandidatesArray,
    ]);
  }

  async function fetchCandidates(
    sessionId: string,
    userName: string,
    fieldParams: CandidateFields[],
    page: number,
    resultsPerPage: number
  ) {
    setIsLoading(true);
    try {
      const response = await getCandidates(
        sessionId,
        userName,
        fieldParams,
        page,
        resultsPerPage
      );

      const responseCandidates = response.Results.map(
        (candidate: CandidateProps) => {
          return {
            ...candidate,
            status: "",
            sub_status: "",
          };
        }
      );

      setCandidates(responseCandidates);
      setTotalResults(response.TotalRecords);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function handleRollUpList() {
    createRollUpList(
      {
        userName: "vini",
        description: "oi",
        memo: "apenas um teste",
      },
      user.SessionId
    );
  }

  useEffect(() => {
    fetchCandidates(
      user.SessionId,
      user.Login,
      ["EmailAddress", "CandidateId", "FirstName", "LastName", "UserName"],
      page,
      qtPerPage
    );
    
  }, []);

  if (!isLoading) {
    return (
      <Container>
        <Loading/>
      </Container>
    );
  }

  return (
    <>
      <Header title={`Hello ${user.Login}`} />
      <Container>
        <UtilsBar candidates={candidates} />;
        <Button
          title={"Get Started"}
          isLoading={false}
          onClick={() => {
            fetchCandidates(
              user.SessionId,
              user.Login,
              [
                "EmailAddress",
                "CandidateId",
                "FirstName",
                "LastName",
                "UserName",
              ],
              page,
              qtPerPage
            );
            populteAllCandidates(
              user.SessionId,
              user.Login,
              [
                "EmailAddress",
                "CandidateId",
                "FirstName",
                "LastName",
                "UserName",
              ],
              qtPerPage
            );
          }}
        />
        <Button
          title={"Create Rollup List"}
          isLoading={false}
          onClick={handleRollUpList}
        />
      </Container>
    </>
  );
}
