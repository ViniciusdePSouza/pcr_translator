"use client";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
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
import { LoginApiResponseType } from "@/@types";
import { useUser } from "../hooks/userContext";
import { useRouter } from "next/navigation";
import { LoadingPlaceholder } from "@/components/LoadingPlaceholder";
import { Button } from "@/components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CustomInput } from "@/components/CustomInput";

interface CorrectNamesFormData {
  targetListCode: string;
}

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

  const { checkExpiredToken, saveUser, signOut } = useUser();
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

  async function handleForm({ targetListCode }: CorrectNamesFormData) {
    const data = {
      code: targetListCode,
      name: nameOption,
    };

    console.log(data);
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
                message={"Correcting the names and uploading profiles..."}
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
