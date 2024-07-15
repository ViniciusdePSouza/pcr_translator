"use client";

import { Header } from "@/components/Header";
import {
  Container,
  Content,
  ErrorMessage,
  FinalFeedbackWrapper,
  Form,
  StyledSelect,
  Title,
} from "./styles";
import { Modal } from "@/components/Modal";
import { CustomInput } from "@/components/CustomInput";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useCandidates } from "../hooks/candidatesContext";
import { validateEmail } from "@/services/ZeroBounce/emailService";
import { useUser } from "../hooks/userContext";
import {
  createRollUpList,
  insertRecordOnRollUpList,
} from "@/services/PCR/rollupService";
import {
  CandidatesProps,
  CheckEmailsFormDataTrue,
  SelectOptionsProps,
} from "@/@types";
import { LoadingPlaceholder } from "@/components/LoadingPlaceholder";

const checkEmailsFormSchema = yup.object({
  description: yup.string().required(),
  memo: yup.string().required(),
  ZBApiKey: yup.string().required(),
});

enum CheckedEmailStatusEnum {
  Valid = "valid",
  Invalid = "invalid",
}

export default function EmailCheck() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailType, setEmailType] = useState<
    "Work Email" | "Personal Email" | null
  >(null);
  const [steps, setSteps] = useState(1);

  const { candidates, saveCandidates } = useCandidates();
  const { user } = useUser();

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
  } = useForm<CheckEmailsFormDataTrue>({
    resolver: yupResolver(checkEmailsFormSchema),
  });

  const handleEmailTypeChange = () => {
    setEmailType(emailType === "Work Email" ? "Personal Email" : "Work Email");
  };

  async function emailValidation(apiKey: string, emailsBatch: string[]) {
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

  async function handleForm({
    ZBApiKey,
    description,
    memo,
  }: CheckEmailsFormDataTrue) {
    let emailsBatch: string[] = [];
    const numberOfLoops = Math.ceil(candidates.length / 200);
    let zeroBounceApiArray: any = [];
    setIsLoading(true);
    try {
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

      for (let i = 0; i < numberOfLoops; i++) {
        const start = 200 * i;
        const end = Math.min(start + 200, workEmailsBatch.length);
        const workEmailsBatchSliced = workEmailsBatch.slice(start, end);
        const emailsBatchSliced = emailsBatch.slice(start, end);

        const responseZB = await emailValidation(
          ZBApiKey,
          emailType === "Work Email" ? workEmailsBatchSliced : emailsBatchSliced
        );

        if (responseZB === undefined) {
          throw new Error(
            "No response from Zero Bounce server, please try again later"
          );
        }

        zeroBounceApiArray = [...zeroBounceApiArray, ...responseZB];
      }

      if (zeroBounceApiArray === undefined)
        throw Error(
          "No response from Zero Bounce server, please try again later"
        );

      const updatedCandidates = updateCandidates(
        candidates,
        zeroBounceApiArray,
        emailType!
      );
      saveCandidates(updatedCandidates);

      const onlyCandidatesWithValidEmail = updatedCandidates.filter(
        (candidate: CandidatesProps) =>
          candidate.status === CheckedEmailStatusEnum.Valid
      );

      setSteps(2);

      const rollUpCode = await createList(user.Login, description, memo);

      setSteps(3);

      onlyCandidatesWithValidEmail.forEach((candidate: any) => {
        insertRecordOnRollUpList(
          rollUpCode,
          user.SessionId,
          candidate.CandidateId
        );
      });

      setSteps(4);
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const zerobounceApi = localStorage.getItem(
      "@pcr-translator:zerouBounceApi"
    );

    if (zerobounceApi) {
      const noQuotesApiKey = zerobounceApi.replace(/"/g, "");
      setValue("ZBApiKey", noQuotesApiKey);
    }
  }, []);

  if (isLoading) {
    switch (steps) {
      case 1:
        return (
          <Container>
            <Header title={"Wellcome to PCR Trasnslator !"} />
            <Content>
              <LoadingPlaceholder
                message={"Checking which emails are valid..."}
              />
            </Content>
          </Container>
        );
      case 2:
        return (
          <Container>
            <Header title={"Wellcome to PCR Trasnslator !"} />
            <Content>
              <LoadingPlaceholder
                message={"Creating your new valid emails list in PCR..."}
              />
            </Content>
          </Container>
        );
      case 3:
        return (
          <Container>
            <Header title={"Wellcome to PCR Trasnslator !"} />
            <Content>
              <LoadingPlaceholder message={"Populating your list..."} />
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
                  {`Awesome, everything went right!! Check your PCR System and you
                  will see your new roll up list updated

                  Ps: You might have to refresh your PCR rollup list page
                  `}
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
        <Title>Email Checking</Title>
        <Form onSubmit={handleSubmit(handleForm)}>
          <CustomInput
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
          />

          <Button
            title={"Start Checking"}
            type="submit"
            isLoading={isLoading}
          />
        </Form>
      </>
    );
  };

  return (
    <Container>
      <Header title={"Email Check !"} />
      <Content>
        <Modal content={<FormComponent />} />
      </Content>
    </Container>
  );
}
