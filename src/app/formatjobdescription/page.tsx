"use client";

import { Header } from "@/components/Header";
import {
  Container,
  Content,
  ErrorMessage,
  FinalFeedbackWrapper,
  Form,
  Title,
} from "./styles";
import { Modal } from "@/components/Modal";
import { useState } from "react";
import { LoadingPlaceholder } from "@/components/LoadingPlaceholder";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { TextArea } from "@/components/TextArea";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CustomInput } from "@/components/CustomInput";
import {
  getPositionsById,
  updatePositions,
} from "@/services/PCR/positionsService";
import { useUser } from "../hooks/userContext";
import { generateJobDescription } from "@/services/OpenAi/openAiService";

const GenerateJobDescriptionSchema = yup.object({
  jobDescription: yup.string().required("Job description is required"),
  targetJob: yup.string().required("Target Job is required"),
  htmlPattern: yup.string().required("Html pattern is required"),
  apiKey: yup.string().required("Api key is required"),
});

interface GenerateJobDescriptionFormData {
  jobDescription: string;
  targetJob: string;
  htmlPattern: string;
  apiKey: string;
}

export default function FormatJobDescription() {
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState(1);

  const { user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateJobDescriptionFormData>({
    resolver: yupResolver(GenerateJobDescriptionSchema),
  });

  const navigator = useRouter();

  async function fetchPosition(
    jobId: string,
    fields: string[],
    sessionId: string
  ) {
    const response = await getPositionsById(jobId, fields, sessionId);

    if (response?.data.Results.length === 0)
      throw Error("Job not found, please check if the Job Id is correct");

    return response?.data.Results[0];
  }

  async function generateDescriptionHtml(
    jobDescription: string,
    apiKey: string
  ) {
    try {
      const response = await generateJobDescription(jobDescription, apiKey);

      return response?.data.choices[0].message.content;
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  async function updateJobDescription(
    jobId: string,
    sessionId: string,
    html: string
  ) {
    try {
      const response = await updatePositions(sessionId, jobId, html);
      return response;
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  async function handleJobDescription({
    jobDescription,
    targetJob,
    htmlPattern,
    apiKey,
  }: GenerateJobDescriptionFormData) {
    setIsLoading(true);
    try {
      const pcrJob = await fetchPosition(
        targetJob,
        ["JobDescription", "JobId", "JobTitle"],
        user.SessionId
      );
      const prompt = `format this job description ${jobDescription} in that html pattern ${htmlPattern}`;

      if (prompt.length > 4600)
        throw Error(
          "Prompt is too long, please try to summarize the job description a little"
        );

      const htmlGenerated = await generateDescriptionHtml(prompt, apiKey);

      await updateJobDescription(pcrJob.JobId, user.SessionId, htmlGenerated);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    switch (steps) {
      case 1:
        return (
          <Container>
            <Header title={"Welcome to PCR Translator !"} />
            <Content>
              <LoadingPlaceholder
                message={"Fetching candidates from PCR list..."}
              />
            </Content>
          </Container>
        );
      default:
        return (
          <Container>
            <Header title={"Welcome to PCR Translator !"} />
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
        <Title>Format Job Description</Title>
        <Form onSubmit={handleSubmit(handleJobDescription)}>
          <CustomInput
            placeholder={"Insert your api key here"}
            label={"Open AI Api Key"}
            {...register("apiKey")}
          />
          <CustomInput
            placeholder={"000001"}
            label={"Target Job Id"}
            {...register("targetJob")}
          />
          {errors.targetJob && (
            <ErrorMessage>{errors.targetJob.message}</ErrorMessage>
          )}
          <TextArea
            label="Job Description"
            placeholder="Type the complete Job Description in here"
            {...register("jobDescription")}
          />
          {errors.jobDescription && (
            <ErrorMessage>{errors.jobDescription.message}</ErrorMessage>
          )}
          <TextArea
            label="Html pattern"
            placeholder="Type the complete Job Description in here"
            {...register("htmlPattern")}
          />
          {errors.htmlPattern && (
            <ErrorMessage>{errors.htmlPattern.message}</ErrorMessage>
          )}
          <Button
            title={"Generate Description"}
            type="submit"
            isLoading={isLoading}
          />
        </Form>
      </>
    );
  };

  return (
    <Container>
      <Header title={"Format Job Description !"} />
      <Content>
        <Modal content={<FormComponent />} />
      </Content>
    </Container>
  );
}
