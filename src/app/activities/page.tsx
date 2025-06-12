"use client";
import { ActivitiesFormData, ActivitiesProps, ActivitySummary } from "@/@types";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { WarningModal } from "@/components/WarningModal";
import { Button } from "@/components/Button";
import { Target, Warning } from "phosphor-react";
import { CustomInput } from "@/components/CustomInput";

import { useState } from "react";

import {
  Container,
  Content,
  DateContainer,
  ErrorMessage,
  Form,
  Title,
} from "./styles";
import { defaultTheme } from "../styles/theme/default";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchPcrRecords } from "@/utils/apiTools";
import { useUser } from "../hooks/userContext";
import { getCandidateActivities } from "@/services/PCR/candidatesService";

const activitiesFormSchema = yup.object({
  targetListCode: yup.string().required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
});

function summarizeActivities(
  candidateId: number,
  firstName: string,
  lastName: string,
  activities: ActivitiesProps[]
) {
  const result: ActivitySummary = {
    candidateid: candidateId,
    "first name": firstName,
    "last name": lastName,
  };

  for (const activity of activities) {
    const type = activity.ActivityType;
    if (!result[type]) {
      result[type] = 1;
    } else {
      result[type]++;
    }
  }

  return result;
}

export default function Activities() {
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [triggerFunction, setTriggerFunction] = useState(() => () => {});
  const [buttonText, setButtonText] = useState("Proceed");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();

  async function handleActivities(data: ActivitiesFormData) {
    setIsLoading(true);
    try {
      let googleSheetRows = [];
      const response = await fetchPcrRecords(
        data.targetListCode,
        [
          "Candidate.EmailAddress",
          "CandidateId",
          "Candidate.CustomFields",
          "Candidate.FirstName",
          "Candidate.LastName",
        ],
        user.SessionId
      );

      const records = response.Results;

      for (const record of records) {
        const activitiesAmount = await getCandidateActivities(
          record.CandidateId,
          user.SessionId,
          1,
          new Date(data.startDate),
          new Date(data.endDate)
        );

        const numberOfLoops = Math.ceil(activitiesAmount.TotalRecords / 500);
        let activitiesArray: ActivitiesProps[] = [];

        for (let i = 1; i <= numberOfLoops; i++) {
          const activities = await getCandidateActivities(
            record.CandidateId,
            user.SessionId,
            i,
            new Date(data.startDate),
            new Date(data.endDate)
          );

          activitiesArray = [...activitiesArray, ...activities.Results];
        }
        const result = summarizeActivities(
          record.CandidateId,
          record.Candidate.FirstName,
          record.Candidate.LastName,
          activitiesArray
        );

        googleSheetRows.push(result)
      }

      console.log("results =>" , googleSheetRows)
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivitiesFormData>({
    resolver: yupResolver(activitiesFormSchema),
  });

  const FormComponent = () => {
    return (
      <>
        <Title>Email Checking</Title>
        <Form onSubmit={handleSubmit(handleActivities)}>
          <CustomInput
            placeholder={"Target List Code"}
            label={"Target List Code"}
            {...register("targetListCode")}
          />
          {errors.targetListCode && (
            <ErrorMessage>{errors.targetListCode.message}</ErrorMessage>
          )}
          <DateContainer>
            <CustomInput
              placeholder={"Select Interval"}
              label={"From"}
              type="date"
              {...register("startDate")}
            />

            <CustomInput
              placeholder={"Select Interval"}
              label={"To"}
              type="date"
              {...register("endDate")}
            />
          </DateContainer>

          {errors.startDate && (
            <ErrorMessage>{errors.startDate.message}</ErrorMessage>
          )}

          {errors.endDate && (
            <ErrorMessage>{errors.endDate.message}</ErrorMessage>
          )}

          <Button title={"Start"} type="submit" isLoading={isLoading} />
        </Form>
      </>
    );
  };

  return (
    <Container>
      <Header title={"Activities"} />
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
