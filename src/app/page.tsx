"use client";
import { LoginApiResponseType, LoginFormData } from "@/@types";

import { CustomInput } from "@/components/CustomInput";
import { Button } from "@/components/Button";

import { Container, ErrorMessage, Form } from "./styles";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./hooks/userContext";
import { login } from "@/services/PCR/loginService";
import { WarningModal } from "@/components/WarningModal";
import { Warning } from "phosphor-react";
import { defaultTheme } from "./styles/theme/default";

const loginFormSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
  apiKey: yup.string().required(),
  appId: yup.string().required(),
  databaseId: yup.string().required(),
});

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [triggerFunction, setTriggerFunction] = useState(() => () => {});
  const [buttonText, setButtonText] = useState("Proceed");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    setValue
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginFormSchema),
  });

  const router = useRouter();

  const { saveUser, checkExpiredToken } = useUser();

  function savePcrLoginInfo({ apiKey, appId, databaseId }: LoginFormData) {
    const pcrInfoObject = {
      apiKey,
      appId,
      databaseId,
    };

    localStorage.setItem(
      "@pcr-translator:pcrInfoObject",
      JSON.stringify(pcrInfoObject)
    );
  }

  async function handleLogin(data: LoginFormData) {
    try {
      const response = await login(data);
      const loginDate = new Date();
      const userObject = {
        ...response,
        loginDate,
      };

      saveUser(userObject);
      savePcrLoginInfo(data);

      if (response?.SessionId) {
        router.push("/menu");
      }
    } catch (error: any) {
      defineWarmingModalProps(error, "Ok", () => setShowModal(false));
    }
  }

  function defineWarmingModalProps(
    message: string,
    buttonText: string,
    functionToTrigger: () => void
  ) {
    setErrorMessage(message);
    setButtonText(buttonText);
    setShowModal(true);
    setTriggerFunction(() => () => functionToTrigger());
  }

  useEffect(() => {
    if (isSubmitting && !isValid && isDirty) {
      defineWarmingModalProps("Please fill out the form correctly", "Ok", () => setShowModal(false));
    }
  }, [errors, isSubmitting, isValid, isDirty]);

  useEffect(() => {
    const pcrLoginInfo = localStorage.getItem("@pcr-translator:pcrInfoObject");

    if (pcrLoginInfo) {
      const { apiKey, appId, databaseId } = JSON.parse(pcrLoginInfo);
      setValue("apiKey", apiKey);
      setValue("appId", appId);
      setValue("databaseId", databaseId);
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("@pcr-translator:user");

    if(user) {
      const userObj: LoginApiResponseType = JSON.parse(user);
      const loginDate = new Date(userObj.loginDate);
      
      if(!checkExpiredToken(loginDate)) router.push("/menu");
    }
  }, [])

  return (
    <Container>
      <WarningModal
        showModal={showModal}
        icon={<Warning size={36} color={defaultTheme.COLORS.PRIMARY} />}
        text={errorMessage}
        primaryButtonText={buttonText}
        secondaryButtonText="Cancel"
        onConfirm={triggerFunction}
        onCancel={() => setShowModal(false)}
      />
      <Form onSubmit={handleSubmit(handleLogin)}>
        <h1>Login</h1>
        <CustomInput
          placeholder={"Add your username"}
          label={"Username"}
          {...register("username")}
        />
        {errors.username && (
          <ErrorMessage>{errors.username.message}</ErrorMessage>
        )}

        <CustomInput
          placeholder={"Add your password"}
          label={"Password"}
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
        <CustomInput
          placeholder={"Add your ApiKey: "}
          label={"ApiKey"}
          {...register("apiKey")}
        />
        {errors.apiKey && <ErrorMessage>{errors.apiKey.message}</ErrorMessage>}
        <CustomInput
          placeholder={"Add your AppId"}
          label={"AppId"}
          {...register("appId")}
        />
        {errors.appId && <ErrorMessage>{errors.appId.message}</ErrorMessage>}
        <CustomInput
          placeholder={"Add your Database Id"}
          label={"Database Id"}
          {...register("databaseId")}
        />
        {errors.databaseId && (
          <ErrorMessage>{errors.databaseId.message}</ErrorMessage>
        )}
        <Button title={"SignIn"} type="submit" isLoading={isSubmitting} />
      </Form>
    </Container>
  );
}
