"use client";
import { Container, Content, Form, Title } from "./styles";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useState } from "react";
import { CustomInput } from "@/components/CustomInput";
import { Button } from "@/components/Button";
import { useCandidates } from "../hooks/candidatesContext";
import { CandidatesProps } from "@/@types";
import {
  createRollUpList,
  insertRecordOnRollUpList,
} from "@/services/PCR/rollupService";
import { useUser } from "../hooks/userContext";
import { updateCandidate } from "@/services/PCR/candidatesService";

const linkedinCheckSchema = yup.object({
  doubledLinkedinListName: yup.string().required(),
  differentLinkedinListName: yup.string().required(),
});

interface LinkedinCheckFormData {
  doubledLinkedinListName: string;
  differentLinkedinListName: string;
}

export default function LinkedinCheck() {
  const [steps, setSteps] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { candidates } = useCandidates();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkedinCheckFormData>({
    resolver: yupResolver(linkedinCheckSchema),
  });

  function filterLinkedinCandidates(candidates: CandidatesProps[]) {
    const filteredCandidates = candidates.filter((candidate: any) => {
      return candidate.Candidate.CustomFields.some(
        (field: any) => field.FieldName === "Social_LinkedIn"
      );
    });

    return filteredCandidates;
  }

  function normalizeLinkedinURL(url: string): string {
    return url
      .replace(/https?:\/\//, "")
      .replace(/www\./, "")
      .replace(/cr\./, "")
      .replace(/\/+$/, "")
      .replace(/linkedin\.com\/in\/+/i, "linkedin.com/in/");
  }

  async function insertCandidateInList(
    candidate: CandidatesProps,
    rollUpCode: string,
    sessionId: string
  ) {
    const response = await insertRecordOnRollUpList(
      rollUpCode,
      sessionId,
      candidate.CandidateId
    );

    return response;
  }

  async function createList(
    userName: string,
    description: string,
    memo: string
  ) {
    try {
      const response = await createRollUpList(
        {
          userName,
          description,
          memo,
        },
        user.SessionId
      );

      return response.RollupCode;
    } catch (error) {
      alert(error);
    }
  }

  async function updateAllCandidates(
    candidates: CandidatesProps[],
    sessionId: string
  ) {
    try {
      candidates.forEach((candidate: CandidatesProps) => {
        updatePerson(candidate, sessionId);
      });
    } catch (error) {
      alert(error);
    }
  }

  async function updatePerson(candidate: CandidatesProps, sessionId: string) {
    const customFields = candidate.Candidate.CustomFields;

    const linkedInField = customFields.find(
      (field) => field.FieldName === "Social_LinkedIn"
    );

    let body = {};

    if (linkedInField) {
      body = {
        CustomFields: [
          {
            FieldName: "Social_LinkedIn",
            Value: [linkedInField.Value[0].split(" ")[0]],
            Action: "URL",
          },
        ],
      };
    }
    try {
      const response = await updateCandidate(
        sessionId,
        body,
        candidate.CandidateId
      );

      return response;
    } catch (error) {
      alert(error);
    }
  }

  async function insertCandidates(candidates: CandidatesProps[], code: string, sessionId: string){
    candidates.forEach((candidate: CandidatesProps) => {
      insertCandidateInList(candidate, code, user.SessionId)
    });
  }

  async function handleForm({
    differentLinkedinListName,
    doubledLinkedinListName,
  }: LinkedinCheckFormData) {
    try {
      setIsLoading(true);
      let doubledLinkedinCandidates: CandidatesProps[] = [];
      let differentLinkedinCandidates: CandidatesProps[] = [];

      const onlyCandidatesWhichContainsLinkedin =
        filterLinkedinCandidates(candidates);

      if (
        !onlyCandidatesWhichContainsLinkedin ||
        onlyCandidatesWhichContainsLinkedin.length == 0
      )
        throw new Error("No candidates with linkedin fields available");

      onlyCandidatesWhichContainsLinkedin.forEach((candidate: any) => {
        candidate.Candidate.CustomFields.forEach((field: any) => {
          if (field.FieldName === "Social_LinkedIn") {
            const linkedinArrayValues = field.Value[0]
              .replace(/\|/g, "")
              .split(" ")
              .map((link: string) => normalizeLinkedinURL(link));

            if (linkedinArrayValues.length > 1) {
              const uniqueLinks = new Set(linkedinArrayValues);

              if (uniqueLinks.size !== linkedinArrayValues.length) {
                doubledLinkedinCandidates = [
                  ...doubledLinkedinCandidates,
                  candidate,
                ];
              } else {
                differentLinkedinCandidates = [
                  ...differentLinkedinCandidates,
                  candidate,
                ];
              }
            }
          }
        });
      });

      const duplicatedCandidatesListDescription =
        "This is a list of candidates which have duplicated linkedin links";
      const differentCandidatesListDescription =
        "This is a list of candidates which have different linkedin links";

      const rollUpCodeDifferent = await createList(
        user.Login,
        differentLinkedinListName,
        duplicatedCandidatesListDescription
      );
      const rollUpCodeDoubled = await createList(
        user.Login,
        doubledLinkedinListName,
        differentCandidatesListDescription
      );

      await insertCandidates(differentLinkedinCandidates, rollUpCodeDifferent, user.SessionId);

      if (doubledLinkedinCandidates.length === 0) {
        throw Error("no duplicated linkedin candidates");
      }

      await updateAllCandidates(doubledLinkedinCandidates, user.SessionId);

      await insertCandidates(doubledLinkedinCandidates, rollUpCodeDoubled, user.SessionId);

      alert("Awesome! Everything went as expected, now you can check your PCR system and see the two new rollup list that we created for you");
      setIsLoading(false);
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  }

  const FormComponent = () => {
    return (
      <>
        <Title>Linkedin Check Form!</Title>
        <Form onSubmit={handleSubmit(handleForm)}>
          <CustomInput
            placeholder={"ADMIN.001"}
            label={"Rollup List Name for doubled linkedin links"}
            {...register("doubledLinkedinListName")}
          />
          <CustomInput
            placeholder={"ADMIN.001"}
            label={"Rollup List Name for different linkedin links"}
            {...register("differentLinkedinListName")}
          />
          <Button
            title={"Check Linkedin"}
            type="submit"
            isLoading={isLoading}
          />
        </Form>
      </>
    );
  };

  return (
    <Container>
      <Header title={"Linkedin Check !"} />
      <Content>
        <Modal content={<FormComponent />} />
      </Content>
    </Container>
  );
}
