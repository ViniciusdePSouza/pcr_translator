"use client";
import {
  CandidatesProps,
  CheckEmailsFormData,
  LoginApiResponseType,
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
  // description: yup.string().required(),
  // memo: yup.string().required(),
  // ZBApiKey: yup.string().required(),
});

enum CheckedEmailStatusEnum {
  Valid = "valid",
  Invalid = "invalid",
}

interface ZeroBounceError {
  Message: string;
}

interface SelectOptionsProps {
  value: string;
  label: string;
}

export default function Home() {
  const { user, signOut, saveUser, checkExpiredToken } = useUser();
  const { saveCandidates } = useCandidates();
  const [steps, setSteps] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [emailType, setEmailType] = useState<
    "Work Email" | "Personal Email" | null
  >(null);

  const navigator = useRouter();

  const options: SelectOptionsProps[] = [
    { value: "Work Email", label: "Work Email" },
    { value: "Personal Email", label: "Personal Email" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
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

  async function emailValidation(apiKey: string, emailsBatch: string[]) {
    setSteps(2);
    try {
      const response = await validateEmail(apiKey, emailsBatch);

      localStorage.setItem(
        "@pcr-translator:zerouBounceApi",
        JSON.stringify(apiKey)
      );

      return response;
    } catch (error) {
      alert(error);
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
      alert(error);
    }
  }

  function updateCandidates(
    candidates: any[],
    responseZBApi: any[],
    action: "Work Email" | "Personal Email"
  ) {
    const updatedCandidates = candidates.map((candidate: any) => {
      const updatedCandidate = candidate;
      if (action === "Work Email") {
        const workEmailValue = candidate.Candidate.CustomFields.find(
          (field: any) => field.FieldName === "Email_Work"
        )?.Value;
        if (workEmailValue) {
          responseZBApi.forEach((item: any) => {
            if (
              workEmailValue.some(
                (email: string) => email === item.emailAddress
              )
            ) {
              updatedCandidate.status = item.status;
              updatedCandidate.sub_status = item.sub_status;
            }
          });
        }
      } else {
        responseZBApi.forEach((item: any) => {
          if (item.emailAddress === candidate.Candidate.EmailAddress) {
            updatedCandidate.status = item.status;
            updatedCandidate.sub_status = item.sub_status;
          }
        });
      }
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
      navigator.push("/menu");
      return;

      let workEmailsBatch: string[] = [];
      candidates.forEach((candidate: any) => {
        candidate.Candidate.CustomFields.forEach((field: any) => {
          if (field.FieldName === "Email_Work") {
            workEmailsBatch = [...workEmailsBatch, ...field.Value];
          }
        });
      });

      emailsBatch = candidates.map((candidate: CandidatesProps) => {
        if (!candidate.Candidate.EmailAddress) return "";
        return candidate.Candidate.EmailAddress;
      });

      const responseZB = await emailValidation(
        data.ZBApiKey,
        emailType === "Work Email" ? workEmailsBatch : emailsBatch
      );

      if (responseZB === undefined)
        throw Error(
          "No response from Zero Bounce server, please try again later"
        );

      const updatedCandidates = updateCandidates(
        candidates,
        responseZB,
        emailType!
      );
      candidates = updatedCandidates;

      const onlyCandidatesWithValidEmail = candidates.filter(
        (candidate: CandidatesProps) =>
          candidate.status === CheckedEmailStatusEnum.Valid
      );

      const rollUpCode = await createList(
        user.Login,
        data.description,
        data.memo
      );

      setSteps(4);

      onlyCandidatesWithValidEmail.forEach((candidate: any) => {
        insertRecordOnRollUpList(
          rollUpCode,
          user.SessionId,
          candidate.CandidateId
        );
      });

      setSteps(5);

      reset();
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  }

  const handleEmailTypeChange = () => {
    setEmailType(emailType === "Work Email" ? "Personal Email" : "Work Email");
  };

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

  useEffect(() => {
    const zerobounceApi = localStorage.getItem(
      "@pcr-translator:zerouBounceApi"
    );

    if (zerobounceApi) {
      setValue("ZBApiKey", zerobounceApi);
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

          {/* <CustomInput
            placeholder={"Your Rollup List Title"}
            label={"Name of the New List with Verified Emails"}
            {...register("description")}
          />
          {errors.description && (
            <ErrorMessage>{errors.description.message}</ErrorMessage>
          )}

          <CustomInput
            placeholder={"A brief description "}
            label={"Description of the New List with Verified Emails"}
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

          <StyledSelect
            options={options}
            onChange={handleEmailTypeChange}
            value={options.find((option) => option.value === emailType)}
          /> */}
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
