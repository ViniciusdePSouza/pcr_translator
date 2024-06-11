"use client";
import { CandidateFields, CandidateProps } from "@/@types";

import { useEffect, useState } from "react";

import { useUser } from "../hooks/userContext";
import { useCandidates } from "../hooks/candidatesContext";

import { useRouter } from "next/navigation";

import { Container, Content, Menu } from "./styles";

import { getCandidates } from "@/services/PCR/candidatesService";

import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { Modal } from "@/components/Modal";
import { Header } from "@/components/Header";

export default function Home() {
  const { user } = useUser();
  const { saveCandidates } = useCandidates();

  const router = useRouter();

  const [page, setPage] = useState(1);
  const [qtPerPage, setQtPerPage] = useState(5);
  const [totalResults, setTotalResults] = useState(0);
  const [candidates, setCandidates] = useState<CandidateProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState(1);

  async function populteAllCandidates(
    sessionId: string,
    userName: string,
    fieldParams: CandidateFields[],
    resultsPerPage: number
  ) {
    setIsLoading(true);
    const loops = Math.ceil(totalResults / qtPerPage);
    let newCandidatesArray: CandidateProps[] = [];
    console.log(`loop qtd => ${loops}`);
    try {
      for (let i = 2; i < loops + 1; i++) {
        console.log(` estamos no loop ${i}`);
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

        console.log(`tamanho do novo array ==> ${newCandidatesArray.length}`);
      }

      setCandidates((prevCandidates) => [
        ...prevCandidates,
        ...newCandidatesArray,
      ]);

      setIsLoading(false);
      setSteps(2);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function fetchCandidates(
    sessionId: string,
    userName: string,
    fieldParams: CandidateFields[],
    page: number,
    resultsPerPage: number
  ) {
    setIsLoading(true);
    console.log('primeiro fetchCandidates')
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
    saveCandidates(candidates);
  }, [candidates]);

  const StepsComponent = () => {
    switch (steps) {
      case 1:
        return (
          <>
            <h1>sync all candidates stage</h1>
            <Button
              title={"Sync"}
              isLoading={isLoading}
              onClick={() => {
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
          </>
        );

      case 2:
        return (
          <>
            <h1>Menu</h1>
            <Menu>
              <Button title={"Check Emails"} isLoading={false} onClick={() => router.push("/checkEmails")}/>
            </Menu>
          </>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  return (
    <Container>
      <Header title={"Wellcome to PCR Trasnslator !"} />
      <Content>
        <Modal content={<StepsComponent />} />
      </Content>
    </Container>
  );
}
