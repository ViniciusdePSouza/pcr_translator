"use client";
import { ConfigProps } from "@/@types";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { CustomInput } from "@/components/CustomInput";
import { TextArea } from "@/components/TextArea";
import { WarningModal } from "@/components/WarningModal";

import { FileHtml, Key, Warning } from "phosphor-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Container,
  Content,
  ErrorMessage,
  TabContent,
  TabList,
  TabRoot,
  TabTrigger,
} from "./styles";
import { defaultTheme } from "../styles/theme/default";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [triggerFunction, setTriggerFunction] = useState(() => () => {});
  const [buttonText, setButtonText] = useState("Ok");

  const configFormSchema = yup.object({
    ZBApiKey: yup.string(),
    openAIApiKey: yup.string(),
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
      : { apikeys: { zeroBounce: "", openAI: "" }, htmlPattern: "" };

    if (!config.apiKeys) {
      config.apiKeys = { zeroBounce: "", openAI: "" };
    }

    if (activeTab === "apiKeys") {
      config.apiKeys.zeroBounce = ZBApiKey!;
      config.apiKeys.openAI = openAIApiKey!;
    } else if (activeTab === "html") {
      config.htmlPattern = htmlPattern!;
    }

    localStorage.setItem("@pcr-translator:config", JSON.stringify(config));
    defineWarmingModalProps("Config saved successfully", "Ok", () => {
      setShowModal(false);
      navigator.push("/menu");
    });
  }

  function defineWarmingModalProps(
    message: string,
    buttonText: string,
    functionToTrigger: () => void
  ) {
    setModalMessage(message);
    setButtonText(buttonText);
    setIsLoading(false);
    setShowModal(true);
    setTriggerFunction(() => () => functionToTrigger());
  }

  useEffect(() => {
    const config = localStorage.getItem("@pcr-translator:config");

    if (config) {
      const configObj: ConfigProps = JSON.parse(config);

      setValue("ZBApiKey", configObj.apiKeys.zeroBounce);
      setValue("openAIApiKey", configObj.apiKeys.openAI);
      setValue("htmlPattern", configObj.htmlPattern);
    }
  }, []);

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
      <WarningModal
        showModal={showModal}
        icon={<Warning size={36} color={defaultTheme.COLORS.PRIMARY} />}
        text={modalMessage}
        primaryButtonText={buttonText}
        secondaryButtonText="Close"
        onConfirm={triggerFunction}
        onCancel={() => setShowModal(false)}
      />
      <Content>
        <Modal content={<TabComponent />} />
      </Content>
    </Container>
  );
}
