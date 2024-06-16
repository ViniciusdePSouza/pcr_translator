"use client";
import { CandidateProps, CheckedEmailProps } from "@/@types";

import { useState } from "react";

import { useCandidates } from "../hooks/candidatesContext";
import { useUser } from "../hooks/userContext";

import { useRouter } from "next/navigation";

import { Container, Content, ErrorMessage, Form } from "./styles";

import { validateEmail } from "@/services/ZeroBounce/emailService";
import { createRollUpList } from "@/services/PCR/rollupService";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { CustomInput } from "@/components/CustomInput";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const createRollupListFormSchema = yup.object({
  description: yup.string().required("this field is required"),
  memo: yup.string().required("this field is required"),
});

interface CreateRollupListFormData {
  description: string;
  memo: string;
}

export default function CheckEmails() {
  const { allCandidates, saveCandidates } = useCandidates();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState(1);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<CreateRollupListFormData>({
    resolver: yupResolver(createRollupListFormSchema),
  });

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
    const loops = Math.ceil(emailsBatch.length / 5);

    const apikEY = prompt("please enter your apikey address");

    let checkedEmails: CheckedEmailProps[] = [] as CheckedEmailProps[];
    try {
      for (let i = 0; i < loops; i++) {
        console.log(`pegando array no intervalor ${i * 5} ate ${i * 5 + 4}`);
        const emailsBatchSubset = emailsBatch.slice(i * 5, i * 5 + 4);

        let responseZeroBounce = await validateEmail(
          apikEY!,
          emailsBatchSubset
        );

        if (responseZeroBounce === undefined) {
          responseZeroBounce = [] as CheckedEmailProps[];
        }

        checkedEmails = [...checkedEmails, ...responseZeroBounce];
      }
      const checkedCandidates: CandidateProps[] = allCandidates.map(
        (candidate) => {
          const updatedCandidate = candidate;
          checkedEmails.forEach((item: CheckedEmailProps) => {
            if (item.emailAddress === candidate.EmailAddress) {
              updatedCandidate.status = item.status;
              updatedCandidate.sub_status = item.sub_status;
            }
          });
          return updatedCandidate;
        }
      );
      saveCandidates(checkedCandidates);
      setIsLoading(false);
      setSteps(2);
      return checkedCandidates;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  async function handleCreateRollupList({
    description,
    memo,
  }: CreateRollupListFormData) {
    try {
      const response = await createRollUpList(
        {
          userName: user.Login,
          description,
          memo,
        },
        user.SessionId
      );

      alert(
        `Awesome! Your Rollup list has been created, this is its code: ${response.RollupCode}`
      );
    } catch (error) {
      console.log(error);
    }
  }
  const StepsComponent = () => {
    switch (steps) {
      case 1:
        return (
          <>
            <h1>Check Emails</h1>
            <Button
              title={"Check Emails"}
              isLoading={isLoading}
              onClick={handleClick}
            />
          </>
        );

      case 2:
        return (
          <Form onSubmit={handleSubmit(handleCreateRollupList)}>
            <h1>Create your Rollup List</h1>
            <CustomInput
              placeholder={"Translator List..."}
              label={"Description"}
              {...register("description")}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
            <CustomInput
              placeholder={"This is a brief Rollup list description"}
              label={"Memo"}
              {...register("memo")}
            />

            {errors.memo && <ErrorMessage>{errors.memo.message}</ErrorMessage>}

            <Button
              title={"Create Rollup List"}
              isLoading={false}
              type="submit"
            />
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <Header title={"Check your candidates emails !"} />
      <Content>
        <Modal content={<StepsComponent />} />
      </Content>
    </Container>
  );
}
