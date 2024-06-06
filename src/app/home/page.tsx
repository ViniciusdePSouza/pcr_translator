"use client";

import { useEffect, useState } from "react";
import { useUser } from "../hooks/userContext";

import { CandidateFields, CandidateProps } from "@/@types";
import { getCandidates } from "@/services/PCR/candidatesService";
import { UtilsBar } from "@/components/UtilsBar";

export default function Home() {
  const { user } = useUser();

  const [page, setPage] = useState(1);
  const [qtPerPage, setQtPerPage] = useState(500);
  const [totalResults, setTotalResults] = useState(0);
  const [candidates, setCandidates] = useState<CandidateProps[]>([]);

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
    } catch (error) {
      console.log(error);
    }
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

  useEffect(() => {
    populteAllCandidates(
      user.SessionId,
      user.Login,
      ["EmailAddress", "CandidateId", "FirstName", "LastName", "UserName"],
      qtPerPage
    );
  }, [totalResults]);

  useEffect(() => {
    console.log(candidates);
  }, [candidates]);

  return <UtilsBar candidates={candidates} />;
}
