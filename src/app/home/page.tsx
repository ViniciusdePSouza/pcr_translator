"use client";
import {
  CandidatesProps,
  CheckEmailsFormData,
  LoginApiResponseType,
  SelectOptionsProps,
} from "@/@types";

import { useEffect, useState } from "react";

import { useUser } from "../hooks/userContext";

import { useRouter } from "next/navigation";

import {
  Container,
  Content,
  ErrorMessage,
  FinalFeedbackWrapper,
  Form,
  StyledSelect,
  Title,
} from "./styles";

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
import { useCandidates } from "../hooks/candidatesContext";

const checkEmailsFormSchema = yup.object({
  listCode: yup.string().required(),
});

enum CheckedEmailStatusEnum {
  Valid = "valid",
  Invalid = "invalid",
}

interface ZeroBounceError {
  Message: string;
}

export default function Home() {
  const { user, signOut, saveUser, checkExpiredToken } = useUser();
  const { saveCandidates } = useCandidates();
  const [steps, setSteps] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const navigator = useRouter();

  const {
    register,
    handleSubmit,
    reset,
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
      alert(error);
    }
  }

  async function handleForm(data: CheckEmailsFormData) {
    let candidates = [];
    let emailsBatch: string[] = [];
    try {
      setIsLoading(true);
      const response = await fetchRecords(
        data.listCode,
        ["Candidate.EmailAddress", "CandidateId", "Candidate.CustomFields"],
        user.SessionId
      );

      candidates = response.Results.map((candidate: CandidatesProps) => {
        return {
          ...candidate,
          status: "",
          sub_status: "",
        };
      });

      saveCandidates(candidates)
      setSteps(1);
      setIsLoading(false);
      reset();
      navigator.push("/menu");

    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("@pcr-translator:user");

    if (user) {
      const userObj: LoginApiResponseType = JSON.parse(user);
      saveUser(userObj);
      const loginDate = new Date(userObj.loginDate);

      if (checkExpiredToken(loginDate)) {
        signOut();
        navigator.replace("/");
      }
    } else {
      signOut();
      navigator.replace("/");
    }
  }, []);

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
      default:
        return (
          <Container>
            <Header title={"Wellcome to PCR Trasnslator !"} />
            <Content>
              <FinalFeedbackWrapper>
                <span>
                  Awesome, everything went right!! Check your PCR System and you
                  will see your new roll up list updated
                </span>
                <Button
                  title={"Start Again"}
                  isLoading={false}
                  onClick={() => {
                    setSteps(1);
                    setIsLoading(false);
                  }}
                />
              </FinalFeedbackWrapper>
            </Content>
          </Container>
        );
    }
  }

  const FormComponent = () => {
    return (
      <>
        <Title>Lets Get your candidates data!</Title>
        <Form onSubmit={handleSubmit(handleForm)}>
          <h1>Your PCR Data</h1>
          <CustomInput
            placeholder={"ADMIN.001"}
            label={"Rollup List Code Will want to work with"}
            {...register("listCode")}
          />
          {errors.listCode && (
            <ErrorMessage>{errors.listCode.message}</ErrorMessage>
          )}
          <Button title={"Get Started"} type="submit" isLoading={isLoading} />
        </Form>
      </>
    );
  };

  return (
    <Container>
      <Header title={"Wellcome to PCR Translator !"} />
      <Content>
        <Modal content={<FormComponent />} />
      </Content>
    </Container>
  );
}
