"use client";
import { ActivitiesFormData, ActivitiesProps, ActivitySummary } from "@/@types";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { WarningModal } from "@/components/WarningModal";
import { Button } from "@/components/Button";
import { CheckCircle, Target, Warning } from "phosphor-react";
import { CustomInput } from "@/components/CustomInput";

import { ReactElement, useState } from "react";

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
import { google } from "googleapis";

const activitiesFormSchema = yup.object({
  targetListCode: yup.string().required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
  sheetName: yup.string().required(),
  folderLink: yup.string().required(),
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
  const [modalIcon, setModalIcon] = useState<ReactElement | null>(null);
  const [secondaryButtonText, setSecondaryButtonText] = useState("");
  const [triggerSecondaryFunction, setTriggerSecondaryFunction] = useState(
    () => () => {}
  );

  const { user } = useUser();

  function defineWarmingModalProps(
    message: string,
    buttonText: string,
    functionToTrigger: () => void,
    icon: ReactElement | null,
    secondaryButtonText?: string,
    secondaryFunctionsToTrigger?: () => void
  ) {
    setErrorMessage(message);
    setButtonText(buttonText);
    setShowModal(true);
    setTriggerFunction(() => () => functionToTrigger());
    if (secondaryButtonText && secondaryFunctionsToTrigger) {
      setSecondaryButtonText(secondaryButtonText);
      setTriggerSecondaryFunction(() => () => secondaryFunctionsToTrigger());
    }
    setModalIcon(icon);
  }

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

      const allActivityTypes = new Set<string>();

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

          activities.Results.forEach((activity: ActivitiesProps) => {
            allActivityTypes.add(activity.ActivityType);
          });

          activitiesArray = [...activitiesArray, ...activities.Results];
        }
        const result = summarizeActivities(
          record.CandidateId,
          record.Candidate.FirstName,
          record.Candidate.LastName,
          activitiesArray
        );

        googleSheetRows.push(result);
      }

      for (let i = 0; i < googleSheetRows.length; i++) {
        const row = googleSheetRows[i];
        const activityTypesArray = Array.from(allActivityTypes);

        for (let j = 0; j < activityTypesArray.length; j++) {
          const activityType = activityTypesArray[j];
          if (!(activityType in row)) {
            row[activityType] = 0;
          }
        }
      }

      const match = data.folderLink.match(/folders\/([a-zA-Z0-9_-]+)/);
      const folderId = match?.[1];

      const body = {
        records: googleSheetRows,
        folderId,
        spreadsheetName: data.sheetName,
      };

      const responseData = await fetch("/api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseJson = await responseData.json();
      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${responseJson.spreadsheetId}/edit`;

      if (responseData.ok) {
        defineWarmingModalProps(
          "Congratulations, your spreadsheet was successfully generated! Check it out on your google drive",
          "See Spreadsheet",
          () => {
            setShowModal(false);
            window.open(spreadsheetUrl, "_blank");
          },
          <CheckCircle size={40} color={defaultTheme.COLORS.PRIMARY_500} />,
          "Close",
          () => {
            setShowModal(false);
          }
        );
      } else {
        throw Error(responseJson.message);
      }
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

          <CustomInput
            placeholder={"drive.google/link"}
            label={"Drive Folder Link"}
            {...register("folderLink")}
          />

          {errors.folderLink && (
            <ErrorMessage>{errors.folderLink.message}</ErrorMessage>
          )}
          <CustomInput
            placeholder={"Some Spreadsheet"}
            label={"Spreadsheet Name"}
            {...register("sheetName")}
          />

          {errors.sheetName && (
            <ErrorMessage>{errors.sheetName.message}</ErrorMessage>
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
