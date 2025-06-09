"use client";
import { ActivitiesFormData } from "@/@types";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { WarningModal } from "@/components/WarningModal";
import { Button } from "@/components/Button";
import { Warning } from "phosphor-react";
import { CustomInput } from "@/components/CustomInput";

import { useState } from "react";

import { Container, Content, ErrorMessage, Form, Title } from "./styles";
import { defaultTheme } from "../styles/theme/default";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchPcrRecords } from "@/utils/apiTools";
import { useUser } from "../hooks/userContext";

const activitiesFormSchema = yup.object({
  targetListCode: yup.string().required(),
});

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
      const response = await fetchPcrRecords(
        data.targetListCode,
        ["Candidate.EmailAddress", "CandidateId", "Candidate.CustomFields"],
        user.SessionId
      );

      console.log(response.Results);
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
