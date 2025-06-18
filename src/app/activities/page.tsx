"use client";
import {
  ActivitiesFormData,
  ActivitiesProps,
  ActivitySummary,
  LoginApiResponseType,
} from "@/@types";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { WarningModal } from "@/components/WarningModal";
import { Button } from "@/components/Button";
import {
  CheckCircle,
  MicrosoftExcelLogo,
  Target,
  Warning,
} from "phosphor-react";
import { CustomInput } from "@/components/CustomInput";

import { ReactElement, useEffect, useState } from "react";

import {
  Container,
  Content,
  DateContainer,
  ErrorMessage,
  Form,
  Title,
} from "./styles";
import { defaultTheme } from "../styles/theme/default";

import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchPcrRecords } from "@/utils/apiTools";
import { useUser } from "../hooks/userContext";
import { getCandidateActivities } from "@/services/PCR/candidatesService";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ProgressBar } from "@/components/ProgressBar";

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
  const [showButtons, setShowButtons] = useState(false);

  const { user, saveUser, signOut, checkExpiredToken } = useUser();
  const navigator = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ActivitiesFormData>({
    resolver: yupResolver(activitiesFormSchema),
  });

  const today = new Date();
  const todayISO = format(today, "yyyy-MM-dd");
  const startDate = useWatch({ control, name: "startDate" });

  function defineWarmingModalProps(
    message: string,
    buttonText: string,
    functionToTrigger: () => void,
    icon: ReactElement | null,
    secondaryButtonText?: string,
    secondaryFunctionsToTrigger?: () => void,
    showButton: boolean = true
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
    setShowButtons(showButton);
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

      if (records.length === 0) {
        throw new Error(
          "No records found on that list, please try another roll up list code"
        );
      }

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
          defineWarmingModalProps(
            `Retrieving activity data for candidate:\n${record.Candidate.FirstName} ${record.Candidate.LastName}\n\nCurrent progress:\nStep ${i} of ${numberOfLoops}`,
            "",
            () => {},
            <ProgressBar currentStep={i - 1} totalSteps={numberOfLoops} />,
            undefined,
            undefined,
            false
          );
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

          setShowModal(true);

          defineWarmingModalProps(
            `Retrieving activity data for candidate:\n${record.Candidate.FirstName} ${record.Candidate.LastName}\n\nCurrent progress:\nStep ${i} of ${numberOfLoops}`,
            "",
            () => {},
            <ProgressBar currentStep={i} totalSteps={numberOfLoops} />,
            undefined,
            undefined,
            false
          );

          activitiesArray = [...activitiesArray, ...activities.Results];
        }

        if (activitiesArray.length === 0)
          throw new Error(
            "No activities on those records, please try another list with some records which contain activities"
          );

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

      defineWarmingModalProps(
        `Now we are creating your spreadsheet...`,
        "",
        () => {},
        <MicrosoftExcelLogo
          size={40}
          color={defaultTheme.COLORS.PRIMARY_500}
        />,
        undefined,
        undefined,
        false
      );

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
          },
          true
        );
      } else {
        throw Error(responseJson.message);
      }
    } catch (error: any) {
      if (error.message === "Invalid Session Id") {
        defineWarmingModalProps(
          error.message,
          "Ok",
          () => {
            signOut();
            navigator.replace("/");
            setShowModal(false);
          },
          <Warning size={32} color={defaultTheme.COLORS.PRIMARY_700} />
        );
        return;
      }

      defineWarmingModalProps(
        error.message,
        "Ok",
        () => setShowModal(false),
        <Warning size={32} color={defaultTheme.COLORS.PRIMARY_700} />,
        undefined,
        undefined,
        true
      );
    } finally {
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

  const FormComponent = () => {
    return (
      <>
        <Title>Activities</Title>
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
              max={todayISO}
              {...register("startDate")}
            />

            <CustomInput
              placeholder={"Select Interval"}
              label={"To"}
              type="date"
              min={startDate || undefined}
              max={todayISO}
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
        icon={modalIcon}
        text={errorMessage}
        primaryButtonText={buttonText}
        secondaryButtonText="Cancel"
        onConfirm={triggerFunction}
        onCancel={() => setShowModal(false)}
        showButton={showButtons}
      />
      <Content>
        <Modal content={<FormComponent />} />
      </Content>
    </Container>
  );
}
