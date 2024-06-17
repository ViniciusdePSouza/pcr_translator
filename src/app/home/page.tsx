"use client";
import { CandidatesProps, CheckEmailsFormData } from "@/@types";

import { useState } from "react";

import { useUser } from "../hooks/userContext";

import { Container, Content, ErrorMessage, Form, Title } from "./styles";

import { LoadingPlaceholder } from "@/components/LoadingPlaceholder";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Header } from "@/components/Header";
import { CustomInput } from "@/components/CustomInput";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  createRollUpList,
  getRollUpListsRecords,
  insertRecordOnRollUpList,
} from "@/services/PCR/rollupService";
import { validateEmail } from "@/services/ZeroBounce/emailService";

const checkEmailsFormSchema = yup.object({
  listCode: yup.string().required(),
  description: yup.string().required(),
  memo: yup.string().required(),
  ZBApiKey: yup.string().required(),
});

enum CheckedEmailStatusEnum {
  Valid = "valid",
  Invalid = "invalid",
}

export default function Home() {
  const { user } = useUser();
  const [steps, setSteps] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckEmailsFormData>({
    resolver: yupResolver(checkEmailsFormSchema),
  });

  async function fetchRecords(
    listCode: string,
    fields: string[],
    sessionId: string
  ) {
    try {
      const response = await getRollUpListsRecords(listCode, fields, sessionId);

      return response!.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function emailValidation(apiKey: string, emailsBatch: string[]) {
    setSteps(2);
    try {
      const response = await validateEmail(apiKey, emailsBatch);

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function createList(
    userName: string,
    description: string,
    memo: string
  ) {
    setSteps(3);
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
      console.log(error);
    }
  }

  function updateCandidates(candidates: any[], responseZBApi: any[]) {
    const updatedCandidates = candidates.map((candidate: any) => {
      const updatedCandidate = candidate;
      responseZBApi.forEach((item: any) => {
        if (item.emailAddress === candidate.Candidate.EmailAddress) {
          updatedCandidate.status = item.status;
          updatedCandidate.sub_status = item.sub_status;
        }
      });
      return updatedCandidate;
    });

    return updatedCandidates;
  }

  async function handleForm(data: CheckEmailsFormData) {
    let candidates = [];
    let emailsBatch: string[] = [];
    try {
      setIsLoading(true);
      const response = await fetchRecords(
        data.listCode,
        ["Candidate.EmailAddress", "CandidateId"],
        user.SessionId
      );

      candidates = response.Results.map((candidate: CandidatesProps) => {
        return {
          ...candidate,
          status: "",
          sub_status: "",
        };
      });

      emailsBatch = candidates.map((candidate: CandidatesProps) => {
        if (!candidate.Candidate.EmailAddress) return "";
        return candidate.Candidate.EmailAddress;
      });

      const responseZB = await emailValidation(data.ZBApiKey, emailsBatch);

      if (responseZB === undefined) throw Error("Deu bigode");

      const updatedCandidates = updateCandidates(candidates, responseZB);

      candidates = updatedCandidates;

      const onlyCandidatesWithValidEmail = candidates.filter(
        (candidate: CandidatesProps) => candidate.status === CheckedEmailStatusEnum.Valid
      );

      const rollUpCode = await createList(
        user.Login,
        data.description,
        data.memo
      );

      setSteps(4)

      onlyCandidatesWithValidEmail.forEach((candidate: any) => {
        insertRecordOnRollUpList(
          rollUpCode,
          user.SessionId,
          candidate.CandidateId
        );
      });

      setIsLoading(false);
      setSteps(1);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    switch (steps) {
      case 1:
        return (
          <Container>
            <Header title={"Wellcome to PCR Trasnslator !"} />
            <Content>
              <LoadingPlaceholder message={"Getting your rollup records..."} />
            </Content>
          </Container>
        );
      case 2:
        return (
          <Container>
            <Header title={"Wellcome to PCR Trasnslator !"} />
            <Content>
              <LoadingPlaceholder
                message={"Checking your candidates email..."}
              />
            </Content>
          </Container>
        );
      case 3:
        return (
          <Container>
            <Header title={"Wellcome to PCR Trasnslator !"} />
            <Content>
              <LoadingPlaceholder message={"Creating your rollup list..."} />
            </Content>
          </Container>
        );
      case 4:
        return (
          <Container>
            <Header title={"Wellcome to PCR Trasnslator !"} />
            <Content>
              <LoadingPlaceholder message={"Populating your rollup list..."} />
            </Content>
          </Container>
        );

      default:
        return null;
    }
  }

  const FormComponent = () => {
    return (
      <>
        <Title>Check emails and create a rollup list for it</Title>
        <Form onSubmit={handleSubmit(handleForm)}>
          <h1>Your Data</h1>
          <CustomInput
            placeholder={"ADMIN.001"}
            label={"Rollup List Code"}
            {...register("listCode")}
          />
          {errors.listCode && (
            <ErrorMessage>{errors.listCode.message}</ErrorMessage>
          )}
          <CustomInput
            placeholder={"Your Rollup List Title"}
            label={"Description"}
            {...register("description")}
          />
          {errors.description && (
            <ErrorMessage>{errors.description.message}</ErrorMessage>
          )}
          <CustomInput
            placeholder={"A brief description "}
            label={"Memo"}
            {...register("memo")}
          />
          {errors.memo && <ErrorMessage>{errors.memo.message}</ErrorMessage>}
          <CustomInput
            placeholder={""}
            label={"Zero Bounce API Key"}
            {...register("ZBApiKey")}
          />
          {errors.ZBApiKey && (
            <ErrorMessage>{errors.ZBApiKey.message}</ErrorMessage>
          )}
          <Button title={"Get Started"} type="submit" isLoading={isLoading} />
        </Form>
      </>
    );
  };

  return (
    <Container>
      <Header title={"Wellcome to PCR Trasnslator !"} />
      <Content>
        <Modal content={<FormComponent />} />
      </Content>
    </Container>
  );
}
