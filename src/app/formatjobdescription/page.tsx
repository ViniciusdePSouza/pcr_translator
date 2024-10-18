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
import { ConfigProps } from "@/@types";

const GenerateJobDescriptionSchema = yup.object({
  jobDescription: yup.string().required("Job description is required"),
  targetJob: yup.string().required("Target Job is required"),
});

interface GenerateJobDescriptionFormData {
  jobDescription: string;
  targetJob: string;
}

export default function FormatJobDescription() {
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState(1);

  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
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
  }: GenerateJobDescriptionFormData) {
    try {
      setIsLoading(true);
      
      const configString = localStorage.getItem("@pcr-translator:config");
      let configObj: ConfigProps;
      let error;
      
      if (!configString) {
        error = new Error("Please update your account preferences");
        (error as any).errorType = "config";
        throw error;
      } else {
        configObj = JSON.parse(configString);
        if (!configObj.htmlPattern) {
          error = new Error(
            "Please update your htmlPattern on your account preferences"
          );
          (error as any).errorType = "config";
          throw error;
        }

        if (!configObj.apiKeys.openAI) {
          error = new Error(
            "Please update your OpenAi ApiKey on your account preferences"
          );
          (error as any).errorType = "config";
          throw error;
        }
      }

      const pcrJob = await fetchPosition(
        targetJob,
        ["JobDescription", "JobId", "JobTitle"],
        user.SessionId
      );

      setSteps(2);
      const prompt = `Please format this job description ${jobDescription} the following way: [Insert Position Title Here] Our client: [Insert Brief Description About Client Company Here] The Opportunity: [Describe Briefly the Position] Benefits: [What Are the Benefits of the Position] Duties and Responsibilities: [What Are the Duties to Perform in This Position] Qualifications: [What Are the Required Qualifications] Here is an example layout in HTML Format. I need the output to be in HTML also according to this html pattern ${configObj.htmlPattern}. If you can not find information for any of the components (Our client, The Opportunity, Benefits, Duties and Responsibilities, Qualifications) please say "Text needed here".`;

      const htmlGenerated = await generateDescriptionHtml(
        prompt,
        configObj.apiKeys.openAI
      );

      console.log("htmlGenerated", htmlGenerated.length);
      setSteps(3);

      await updateJobDescription(pcrJob.JobId, user.SessionId, htmlGenerated);
      setSteps(4);
    } catch (error: any) {
      if ((error as any).errorType === "config") {
        alert(error.message);
        navigator.push("/userconfig");
        setIsLoading(false);
        return;
      }
      alert(error.message);
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
                message={"Fetching Position from PCR list..."}
              />
            </Content>
          </Container>
        );
      case 2:
        return (
          <Container>
            <Header title={"Welcome to PCR Translator !"} />
            <Content>
              <LoadingPlaceholder
                message={"Generating Job Description with AI..."}
              />
            </Content>
          </Container>
        );
      case 3:
        return (
          <Container>
            <Header title={"Welcome to PCR Translator !"} />
            <Content>
              <LoadingPlaceholder message={"Updating Position on PCR..."} />
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
                  {`Awesome, everything went right!! Check your PCR System and you'll see your position data updated`}
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
