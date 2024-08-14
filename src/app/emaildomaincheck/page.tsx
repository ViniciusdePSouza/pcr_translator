"use client";

import { Header } from "@/components/Header";
import { Container, Content, FinalFeedbackWrapper, Form, Title } from "./styles";
import { Modal } from "@/components/Modal";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/userContext";
import { LoginApiResponseType } from "@/@types";
import { useRouter } from "next/navigation";
import { LoadingPlaceholder } from "@/components/LoadingPlaceholder";
import { Button } from "@/components/Button";
import { CustomInput } from "@/components/CustomInput";

export default function EmailDomainCheck() {
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState(0);
  const { saveUser, signOut, checkExpiredToken } = useUser();
  const navigator = useRouter();

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
        <Title>Filter Email Domains</Title>
        <Form >
          <CustomInput
            placeholder={"Target List Code"}
            label={"Target List Code"}
            
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
      <Header title={"Filter Email Domain!"} />
      <Content>
        <Modal content={<FormComponent/>} />
      </Content>
    </Container>
  );
}
