"use client";

import { useEffect, useState } from "react";
import { useUser } from "../hooks/userContext";
import { getCandidates } from "@/services/candidatesService";
import { CandidateFields, CandidateProps } from "@/@types";

export default function Home() {
  const { user } = useUser();

  const [page, setPage] = useState(1);
  const [qtPerPage, setQtPerPage] = useState(9);
  const [candidates, setCandidates] = useState<CandidateProps[]>([]);

  async function fetchCandidates(
    sessionId: string,
    userName: string,
    fieldParams: CandidateFields[],
    page: number,
    resultsPerPage: number
  ) {
    const response = await getCandidates(
      sessionId,
      userName,
      fieldParams,
      page,
      resultsPerPage
    );

    setCandidates(response.Results);
  }

  useEffect(() => {
    fetchCandidates(
      user.SessionId,
      user.Login,
      ["FirstName", "LastName", "EmailAddress", "UserName"],
      page,
      qtPerPage
    );
  }, [user]);

  return <h1>Home component works!</h1>;
}
