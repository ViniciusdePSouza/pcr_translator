"use client";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";

import { useRouter } from "next/navigation";

import {
  Container,
  Content,
  ErrorMessage,
  TabContent,
  TabList,
  TabRoot,
  TabTrigger,
} from "./styles";
import { Button } from "@/components/Button";
import { CustomInput } from "@/components/CustomInput";
import { TextArea } from "@/components/TextArea";
import { FileHtml, Key } from "phosphor-react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { zeroBounceApi } from "@/services/api";
import { ConfigProps } from "@/@types";

type ActiveTabType = "apiKeys" | "html";

interface ConfigFormData {
  ZBApiKey?: string;
  openAIApiKey?: string;
  htmlPattern?: string;
}

export default function UserConfig() {
  const navigator = useRouter();

  const [activeTab, setActiveTab] = useState<ActiveTabType | string>("apiKeys");
  const [isLoading, setIsLoading] = useState(false);

  const configFormSchema = yup.object({
    ZBApiKey: yup
      .string()
      .test("ZBApiKey-required", "ZB API Key is required", function (value) {
        if (activeTab === "apiKeys") {
          return !!value;
        }
        return true;
      }),
    openAIApiKey: yup
      .string()
      .test(
        "openAIApiKey-required",
        "OpenAI API Key is required",
        function (value) {
          if (activeTab === "apiKeys") {
            return !!value;
          }
          return true;
        }
      ),
    htmlPattern: yup
      .string()
      .test(
        "htmlPattern-required",
        "HTML Pattern is required",
        function (value) {
          if (activeTab === "html") {
            return !!value;
          }
          return true;
        }
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ConfigFormData>({
    resolver: yupResolver(configFormSchema),
  });

  function handleSave({ htmlPattern, openAIApiKey, ZBApiKey }: ConfigFormData) {
    setIsLoading(true);
    let configString = localStorage.getItem("@pcr-translator:config");
    let config: ConfigProps = configString
      ? JSON.parse(configString)
      : { apikeys: { zeroboUNCE: "", openAI: "" }, htmlPattern: "" };

    if (activeTab === "apiKeys") {
      config.apikeys.zeroboUNCE = ZBApiKey!;
      config.apikeys.openAI = openAIApiKey!;
    } else if (activeTab === "html") {
      config.htmlPattern = htmlPattern!;
    }

    localStorage.setItem("@pcr-translator:config", JSON.stringify(config));
    setIsLoading(false);
    alert("Config saved successfully");
  }

  const TabComponent = () => {
    return (
      <form onSubmit={handleSubmit(handleSave)}>
        <TabRoot
          defaultValue="apiKeys"
          value={activeTab}
          onValueChange={(value: string) => setActiveTab(value)}
        >
          <TabList>
            <TabTrigger value="apiKeys" children={<Key size={32} />} />
            <TabTrigger value="html" children={<FileHtml size={32} />} />
          </TabList>
          <TabContent value="apiKeys">
            <CustomInput
              placeholder={"Please inform your zero bounce api key"}
              label={"Zero Bounce Api Key"}
              {...register("ZBApiKey")}
            />
            {errors.ZBApiKey && (
              <ErrorMessage>{errors.ZBApiKey.message}</ErrorMessage>
            )}
            <CustomInput
              placeholder={"Please inform your Open AI api key"}
              label={"Open AI API Key"}
              {...register("openAIApiKey")}
            />
            {errors.openAIApiKey && (
              <ErrorMessage>{errors.openAIApiKey.message}</ErrorMessage>
            )}
            <Button title={"Save"} isLoading={false} type="submit" />
          </TabContent>

          <TabContent value="html">
            <TextArea
              label={"Html Pattern"}
              placeholder={"<span>This is a html example</span>"}
              {...register("htmlPattern")}
            />
            {errors.htmlPattern && (
              <ErrorMessage>{errors.htmlPattern.message}</ErrorMessage>
            )}
            <Button title={"Save"} isLoading={false} type="submit" />
          </TabContent>
        </TabRoot>
      </form>
    );
  };

  return (
    <Container>
      <Header title={"Account Preferences"} />
      <Content>
        <Modal content={<TabComponent />} />
      </Content>
    </Container>
  );
}
