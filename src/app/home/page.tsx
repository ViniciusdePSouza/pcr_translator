"use client";
import { CandidateFields, CandidateProps } from "@/@types";

import { useState } from "react";

import { useUser } from "../hooks/userContext";

import { useRouter } from "next/navigation";

import { Container, Content, Form, Menu, Title } from "./styles";

import { getCandidates } from "@/services/PCR/candidatesService";

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

interface CheckEmailsFormData {
  listCode: string;
  description: string;
  memo: string;
  ZBApiKey: string;
}

export default function Home() {
  const { user } = useUser();

  const router = useRouter();
  const [steps, setSteps] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<CheckEmailsFormData>({
    resolver: yupResolver(checkEmailsFormSchema),
  });

  async function handleForm(data: CheckEmailsFormData) {
    let candidates = [];
    let emailsBatch: string[] = [];
    try {
      setIsLoading(true);
      const response = await getRollUpListsRecords(
        data.listCode,
        ["Candidate.EmailAddress", "CandidateId"],
        user.SessionId
      );

      candidates = response!.data.Results.map((candidate: CandidateProps) => {
        return {
          ...candidate,
          status: "",
          sub_status: "",
        };
      });

      emailsBatch = response!.data.Results.map((candidate: any) => {
        if (!candidate.Candidate.EmailAddress) return "";
        return candidate.Candidate.EmailAddress;
      });

      const responseZB = await validateEmail(data.ZBApiKey, emailsBatch);

      if (responseZB === undefined) throw Error("Deu bigode");

      const updatedCandidates = candidates.map((candidate: any) => {
        const updatedCandidate = candidate;
        responseZB.forEach((item: any) => {
          if (item.emailAddress === candidate.Candidate.EmailAddress) {
            updatedCandidate.status = item.status;
            updatedCandidate.sub_status = item.sub_status;
          }
        });
        return updatedCandidate;
      });
      candidates = updatedCandidates;

      const onlyCandidatesWithValidEmail = candidates.filter(
        (candidate: any) => candidate.status === "valid"
      );

      const responseRollupService = await createRollUpList(
        {
          userName: user.Login,
          description: data.description,
          memo: data.memo,
        },
        user.SessionId
      );

      onlyCandidatesWithValidEmail.forEach((candidate: any) => {
        insertRecordOnRollUpList(
          responseRollupService.RollupCode,
          user.SessionId,
          candidate.CandidateId
        );
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const StepsComponent = () => {
    switch (steps) {
      case 1:
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
              <CustomInput
                placeholder={"Your Rollup List Title"}
                label={"Description"}
                {...register("description")}
              />
              <CustomInput
                placeholder={"A brief description "}
                label={"Memo"}
                {...register("memo")}
              />
              <CustomInput
                placeholder={""}
                label={"Zero Bounce API Key"}
                {...register("ZBApiKey")}
              />
              <Button
                title={"Get Started"}
                type="submit"
                onClick={() => {}}
                isLoading={isLoading}
              />
            </Form>
          </>
        );

      case 2:
        return (
          <>
            <h1>Menu</h1>
            <Menu>
              <Button
                title={"Check Emails"}
                isLoading={false}
                onClick={() => router.push("/checkEmails")}
              />
            </Menu>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <Header title={"Wellcome to PCR Trasnslator !"} />
      <Content>
        <Modal content={<StepsComponent />} />
      </Content>
    </Container>
  );
}
