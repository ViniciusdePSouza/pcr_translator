"use client";
import {
  Container,
  Content,
  ErrorMessage,
  FinalFeedbackWrapper,
  Form,
  Title,
} from "./styles";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useEffect, useState } from "react";
import { CustomInput } from "@/components/CustomInput";
import { Button } from "@/components/Button";
import { CandidatesProps, LoginApiResponseType } from "@/@types";
import {
  createRollUpList,
  getRollUpListsRecords,
  insertRecordOnRollUpList,
} from "@/services/PCR/rollupService";
import { useUser } from "../hooks/userContext";
import { updateCandidate } from "@/services/PCR/candidatesService";
import { LoadingPlaceholder } from "@/components/LoadingPlaceholder";
import { useRouter } from "next/navigation";

const linkedinCheckSchema = yup.object({
  targetListCode: yup.string().required(),
  differentLinkedinListName: yup.string().required(),
});

interface LinkedinCheckFormData {
  targetListCode: string;
  differentLinkedinListName: string;
}

export default function LinkedinCheck() {
  const [steps, setSteps] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { user, saveUser, checkExpiredToken, signOut } = useUser();
  const navigator = useRouter();

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
      const reqArray = candidates.map(candidate => updatePerson(candidate, sessionId))
      await Promise.all(reqArray)

    } catch (error) {
      alert(error);
    }
  }

  async function updatePerson(candidate: CandidatesProps, sessionId: string) {
    const customFields = candidate.Candidate.CustomFields;

    const linkedInField = customFields!.find(
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

  async function insertCandidates(
    candidates: CandidatesProps[],
    code: string,
    sessionId: string
  ) {
    candidates.forEach((candidate: CandidatesProps) => {
      insertCandidateInList(candidate, code, sessionId);
    });
  }

  async function fetchRecords(
    listCode: string,
    fields: string[],
    sessionId: string
  ) {
    try {
      const response = await getRollUpListsRecords(listCode, fields, sessionId);

      return response!.data;
    } catch (error: any) {    
      alert(error);
    }
  }

  async function handleForm({
    targetListCode,
    differentLinkedinListName,
  }: LinkedinCheckFormData) {
    try {
      setIsLoading(true);

      const response = await fetchRecords(
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

      setSteps(2)

      let doubledLinkedinCandidates: CandidatesProps[] = [];
      let differentLinkedinCandidates: CandidatesProps[] = [];

      const onlyCandidatesWhichContainsLinkedin =
        filterLinkedinCandidates(candidates);

      onlyCandidatesWhichContainsLinkedin.forEach((candidate: any) => {
        candidate.Candidate.CustomFields.forEach((field: any) => {
          if (field.FieldName === "Social_LinkedIn") {
            const linkedinArrayValues = field.Value.map((link: string) =>
              normalizeLinkedinURL(link)
            );

            if (linkedinArrayValues.length > 1) {
              const uniqueLinks = new Set(linkedinArrayValues);

              if (uniqueLinks.size !== linkedinArrayValues.length) {
                if (uniqueLinks.size === 1) {
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

      setSteps(3);

      const differentCandidatesListDescription =
        "This is a list of candidates which have different linkedin links";

      const rollUpCodeDifferent = await createList(
        user.Login,
        differentLinkedinListName,
        differentCandidatesListDescription
      );

      await insertCandidates(
        differentLinkedinCandidates,
        rollUpCodeDifferent,
        user.SessionId
      );

      setSteps(4);

      await updateAllCandidates(doubledLinkedinCandidates, user.SessionId);

      setSteps(5);
      reset()
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
              <LoadingPlaceholder
                message={"Filtering candidates with linkedin..."}
              />
            </Content>
          </Container>
        );
      case 3:
        return (
          <Container>
            <Header title={"Linkedin Check !"} />
            <Content>
              <LoadingPlaceholder
                message={
                  "Creating your new list in PCR with different linkedin candidates ..."
                }
              />
            </Content>
          </Container>
        );
      case 4:
        return (
          <Container>
            <Header title={"Linkedin Check !"} />
            <Content>
              <LoadingPlaceholder
                message={"Updating doubled linkedin candidates..."}
              />
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
                    navigator.back()
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
        <Title>Linkedin Check Form!</Title>
        <Form onSubmit={handleSubmit(handleForm)}>
        <CustomInput
            placeholder={"USER.001"}
            label={"Target List Code"}
            {...register("targetListCode")}
          />
          {errors.differentLinkedinListName && (
            <ErrorMessage>
              {errors.differentLinkedinListName.message}
            </ErrorMessage>
          )}
          <CustomInput
            placeholder={"ADMIN.001"}
            label={"Rollup List Name for different linkedin links"}
            {...register("differentLinkedinListName")}
          />
          {errors.differentLinkedinListName && (
            <ErrorMessage>
              {errors.differentLinkedinListName.message}
            </ErrorMessage>
          )}
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
function checkExpiredToken(loginDate: Date) {
  throw new Error("Function not implemented.");
}

