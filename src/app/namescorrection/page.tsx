"use client";
import {
  CandidatesProps,
  CorrectNamesFormData,
  LoginApiResponseType,
} from "@/@types";

import {
  Container,
  Content,
  ErrorMessage,
  FinalFeedbackWrapper,
  Form,
  StyledSelect,
  Title,
} from "./style";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { CustomInput } from "@/components/CustomInput";
import { LoadingPlaceholder } from "@/components/LoadingPlaceholder";
import { Button } from "@/components/Button";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { updateCandidate } from "@/services/PCR/candidatesService";
import { fetchPcrRecords } from "@/utils/apiTools";

import { useUser } from "../hooks/userContext";

interface SelectOptionProps {
  value: "First Name" | "Last Name" | "Both";
  label: string;
}

const correctNamesSchema = yup.object({
  targetListCode: yup.string().required(),
});

export default function NamesCorrection() {
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState(1);
  const [nameOption, setNameOption] = useState<
    "First Name" | "Last Name" | "Both" | null
  >(null);

  const { checkExpiredToken, saveUser, signOut, user } = useUser();
  const navigator = useRouter();

  const options = [
    { value: "First Name", label: "First Name" },
    { value: "Last Name", label: "Last Name" },
    { value: "Both", label: "Both" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CorrectNamesFormData>({
    resolver: yupResolver(correctNamesSchema),
  });

  const handleNameOptionChange = (selectedOption: SelectOptionProps) => {
    setNameOption(selectedOption ? selectedOption.value : null);
  };

  function capitalizeName(name: string) {
    return name && name[0].toUpperCase() + name.slice(1).toLowerCase();
  }

  function excludeEverythingAfterComma(name: string) {
    return name.split(",")[0];
  }

  function formatName(name: string) {
    name = excludeEverythingAfterComma(name);
    name = capitalizeName(name);

    return name;
  }

  async function updateAllCandidates(
    candidates: CandidatesProps[],
    sessionId: string,
    action: "First Name" | "Last Name" | "Both"
  ) {
    try {
      const reqArray = candidates.map((candidate) =>
        updatePerson(candidate, sessionId, action)
      );
      await Promise.all(reqArray);
    } catch (error) {
      setIsLoading(false);
      alert(error);
    }
  }

  async function updatePerson(
    candidate: CandidatesProps,
    sessionId: string,
    action: "First Name" | "Last Name" | "Both"
  ) {
    let body = {};

    switch (action) {
      case "First Name":
        body = {
          FirstName: candidate.Candidate.FirstName,
        };
        break;
      case "Last Name":
        body = {
          LastName: candidate.Candidate.LastName,
        };
        break;
      case "Both":
        body = {
          FirstName: candidate.Candidate.FirstName,
          LastName: candidate.Candidate.LastName,
        };
        break;
      default:
        return;
    }

    try {
      const response = await updateCandidate(
        sessionId,
        body,
        candidate.CandidateId
      );

      return response;
    } catch (error) {
      setIsLoading(false);
      alert(error);
    }
  }

  async function handleForm({ targetListCode }: CorrectNamesFormData) {
    setIsLoading(true);
    try {
      let fieldsArray = [];

      switch (nameOption) {
        case "First Name":
          fieldsArray = ["Candidate.FirstName", "CandidateId"];
          break;
        case "Last Name":
          fieldsArray = ["Candidate.LastName", "CandidateId"];
          break;
        case "Both":
          fieldsArray = [
            "Candidate.FirstName",
            "CandidateId",
            "Candidate.LastName",
          ];
          break;
        default:
          return;
      }

      const response = await fetchPcrRecords(
        targetListCode,
        fieldsArray,
       user.SessionId
      );

      setSteps(2);

      const correctedCandidates = response.Results.map(
        (candidate: CandidatesProps) => {
          switch (nameOption) {
            case "First Name":
              candidate.Candidate.FirstName = formatName(
                candidate.Candidate.FirstName!
              );
              break;
            case "Last Name":
              candidate.Candidate.LastName = formatName(
                candidate.Candidate.LastName!
              );
              break;
            case "Both":
              candidate.Candidate.FirstName = formatName(
                candidate.Candidate.FirstName!
              );
              candidate.Candidate.LastName = formatName(
                candidate.Candidate.LastName!
              );
              break;
            default:
              return;
          }

          return candidate;
        }
      );

      setSteps(3);

      await updateAllCandidates(
        correctedCandidates,
        user.SessionId,
        nameOption
      );

      setSteps(4);
    } catch (error: any) {
      alert(error.message);
      if (error.message === "Invalid Session Id") {
        signOut();
        navigator.replace("/");
      }
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
              <LoadingPlaceholder
                message={"Fetching candidates from PCR list..."}
              />
            </Content>
          </Container>
        );
      case 2:
        return (
          <Container>
            <Header title={"Linkedin Check !"} />
            <Content>
              <LoadingPlaceholder message={"Correcting the names..."} />
            </Content>
          </Container>
        );
      case 3:
        return (
          <Container>
            <Header title={"Linkedin Check !"} />
            <Content>
              <LoadingPlaceholder message={"Uploading profiles..."} />
            </Content>
          </Container>
        );
      default:
        return (
          <Container>
            <Header title={"Linkedin Check !"} />
            <Content>
              <FinalFeedbackWrapper>
                <span>
                  {`Awesome, everything went right!! 
                  Check your PCR System and you will see your new roll up list updated

                  Ps: You might have to refresh your PCR rollup list page to see the changes
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
        <Title>Correct Names</Title>
        <Form onSubmit={handleSubmit(handleForm)}>
          <CustomInput
            placeholder={"Target List Code"}
            label={"Target List Code"}
            {...register("targetListCode")}
          />
          {errors.targetListCode && (
            <ErrorMessage>{errors.targetListCode.message}</ErrorMessage>
          )}
          <StyledSelect
            options={options}
            onChange={(value) =>
              handleNameOptionChange(value as SelectOptionProps)
            }
            value={options.find((option) => option.value === nameOption)}
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
