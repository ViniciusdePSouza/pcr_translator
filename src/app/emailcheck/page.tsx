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
import { defaultTheme } from "../styles/theme/default";

import { Modal } from "@/components/Modal";
import { CustomInput } from "@/components/CustomInput";
import { Button } from "@/components/Button";
import { LoadingPlaceholder } from "@/components/LoadingPlaceholder";
import { WarningModal } from "@/components/WarningModal";

import { Warning } from "phosphor-react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/userContext";

import { validateEmail } from "@/services/ZeroBounce/emailService";

import {
  CandidatesProps,
  CheckEmailsFormDataTrue,
  ConfigProps,
  LoginApiResponseType,
  SelectOptionsProps,
} from "@/@types";
import { ErrorMessages } from "@/@types/error";

import {
  createListonPcrSystem,
  fetchPcrRecords,
  populatePcrList,
} from "@/utils/apiTools";

const checkEmailsFormSchema = yup.object({
  targetListCode: yup.string().required(),
  description: yup.string().required(),
  memo: yup.string().required(),
});

enum CheckedEmailStatusEnum {
  Valid = "valid",
  Invalid = "invalid",
}

export default function EmailCheck() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailType, setEmailType] = useState<"Work Email" | "Personal Email">(
    "Work Email"
  );
  const [steps, setSteps] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [triggerFunction, setTriggerFunction] = useState(() => () => {});
  const [buttonText, setButtonText] = useState("Proceed"); 

  const { user, saveUser, checkExpiredToken, signOut } = useUser();

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
    } catch (error:any) {
      throw new Error(error.message);
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

  function checkIfEmailBatchIsEmpty(emailBatch: string[]) {
    return emailBatch.length === 0;
  }

  function defineWarmingModalProps(
    message: string,
    buttonText: string,
    functionToTrigger: () => void  
  ) {
    setErrorMessage(message);
    setButtonText(buttonText);  
    setIsLoading(false);
    setShowModal(true);
    setTriggerFunction(() => () => functionToTrigger());
  }

  async function handleForm({
    description,
    memo,
    targetListCode,
  }: CheckEmailsFormDataTrue) {
    setIsLoading(true);
    try {
      const config = localStorage.getItem("@pcr-translator:config");

      if (!config) {
        const error = new Error("Please update your account preferences");
        (error as any).errorType = "config";
        throw error;
      }
      const configObj: ConfigProps = JSON.parse(config);

      if (configObj.apiKeys.zeroBounce.length === 0) {
        const error = new Error(
          "Please update your Zero Bounce Api Key on your account preferences"
        );
        (error as any).errorType = "config";
        throw error;
      }

      if (emailType === null) throw new Error("Please select email type");

      const response = await fetchPcrRecords(
        targetListCode,
        ["Candidate.EmailAddress", "CandidateId", "Candidate.CustomFields"],
        user.SessionId
      );

      const candidates = response.Results.map((candidate: CandidatesProps) => {
        return {
          ...candidate,
          status: "",
          sub_status: "",
        };
      });

      setSteps(2);

      let emailsBatch: string[] = [];
      const numberOfLoops = Math.ceil(candidates.length / 100);
      let zeroBounceApiArray: any = [];

      let workEmailsBatch: string[] = [];
      candidates.forEach((candidate: any) => {
        candidate.Candidate.CustomFields.forEach((field: any) => {
          if (field.FieldName === "Email_Work") {
            workEmailsBatch = [...workEmailsBatch, ...field.Value];
          }
        });
      });
      emailsBatch = candidates.map((candidate: CandidatesProps) => {
        if (!candidate.Candidate.EmailAddress) {
          return "";
        }
        return candidate.Candidate.EmailAddress;
      });

      if (numberOfLoops > 1) {
        for (let i = 0; i < numberOfLoops; i++) {
          const start = 100 * i;
          const end = Math.min(start + 100, workEmailsBatch.length);
          let workEmailsBatchSliced = workEmailsBatch.slice(start, end);
          let emailsBatchSliced = emailsBatch.slice(start, end);

          if (
            checkIfEmailBatchIsEmpty(
              emailType === "Work Email" ? workEmailsBatch : emailsBatch
            )
          ) {
            throw new Error(ErrorMessages.NoEmailsToCheck);
          }

          const responseZB = await emailValidation(
            configObj.apiKeys.zeroBounce,
            emailType === "Work Email"
              ? workEmailsBatchSliced
              : emailsBatchSliced
          );

          if (responseZB === undefined) {
            throw new Error(
              "No response from Zero Bounce server, please try again later"
            );
          }

          zeroBounceApiArray = [...zeroBounceApiArray, ...responseZB];
        }
      } else {
        if (
          checkIfEmailBatchIsEmpty(
            emailType === "Work Email" ? workEmailsBatch : emailsBatch
          )
        ) {
          throw new Error(ErrorMessages.NoEmailsToCheck);
        }

        zeroBounceApiArray = await emailValidation(
          configObj.apiKeys.zeroBounce,
          emailType === "Work Email" ? workEmailsBatch : emailsBatch
        );
      }

      if (zeroBounceApiArray === undefined) {
        throw Error(
          "No response from Zero Bounce server, please try again later"
        );
      }

      const updatedCandidates = updateCandidates(
        candidates,
        zeroBounceApiArray,
        emailType!
      );

      const onlyCandidatesWithValidEmail = updatedCandidates.filter(
        (candidate: CandidatesProps) =>
          candidate.status === CheckedEmailStatusEnum.Valid
      );

      setSteps(3);

      const rollUpCode = await createListonPcrSystem(
        user.Login,
        description,
        memo,
        user.SessionId
      );

      setSteps(4);

      await populatePcrList(
        onlyCandidatesWithValidEmail,
        user.SessionId,
        rollUpCode
      );

      setSteps(5);
      reset();
    } catch (error: any) {
      if ((error as any).errorType === "config") {
        defineWarmingModalProps(error.message, "Proceed", () =>
          navigator.push("/userconfig")
        );
        setErrorMessage(error.message);
        return;
      }

      if (error.message === "Invalid Session Id") {
        defineWarmingModalProps(error.message, "Ok", () => {
          signOut();
          navigator.replace("/");
        });
        return;
      }

      defineWarmingModalProps(error.message, "Ok", () => setShowModal(false));
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
              <LoadingPlaceholder
                message={"Fetching candidates from PCR list..."}
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
                message={"Checking which emails are valid..."}
              />
            </Content>
          </Container>
        );
      case 3:
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
      case 4:
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
                <Button
                  title={"Go to menu"}
                  isLoading={false}
                  onClick={() => {
                    navigator.back();
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
            placeholder={"Target List Code"}
            label={"Target List Code"}
            {...register("targetListCode")}
          />
          {errors.targetListCode && (
            <ErrorMessage>{errors.targetListCode.message}</ErrorMessage>
          )}
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
      <WarningModal
        showModal={showModal}
        icon={<Warning size={36} color={defaultTheme.COLORS.PRIMARY} />}
        text={errorMessage}
        primaryButtonText={buttonText}
        secondaryButtonText="Cancel"
        onConfirm={triggerFunction}
        onCancel={() => setShowModal(false)}
      />
      <Content>
        <Modal content={<FormComponent />} />
      </Content>
    </Container>
  );
}
