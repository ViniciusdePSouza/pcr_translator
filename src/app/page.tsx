"use client";
import { LoginFormData } from "@/@types";

import { CustomInput } from "@/components/CustomInput";
import { Button } from "@/components/Button";

import { Container, ErrorMessage, Form } from "./styles";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./hooks/userContext";
import { login } from "@/services/PCR/loginService";

const loginFormSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
  apiKey: yup.string().required(),
  appId: yup.string().required(),
  databaseId: yup.string().required(),
});

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginFormSchema),
  });

  const router = useRouter();

  const { saveUser } = useUser();

  async function handleLogin(data: LoginFormData) {
    try {
      const response = await login(data);
      const loginDate = new Date();
      const userObject = {
        ...response,
        loginDate,
      };

      saveUser(userObject);

      if (response?.SessionId) {
        router.push("/home");
      }
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    if (isSubmitting && !isValid && isDirty) {
      alert("Please fill out the form correctly");
    }
  }, [errors, isSubmitting, isValid, isDirty]);

  return (
    <Container>
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
