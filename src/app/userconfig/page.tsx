"use client";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";

import { useRouter } from "next/navigation";

import {
  Container,
  Content,
  TabContent,
  TabList,
  TabRoot,
  TabTrigger,
} from "./styles";
import { Button } from "@/components/Button";
import { CustomInput } from "@/components/CustomInput";
import { TextArea } from "@/components/TextArea";
import { FileHtml, Key } from "phosphor-react";

type ActiveTabType = "apiKeys" | "html";

export default function UserConfig() {
  const navigator = useRouter();

  function handleSave(activeTab: ActiveTabType) {
    console.log(activeTab);
  }

  const TabComponent = () => {
    return (
      <>
        <TabRoot defaultValue="apiKeys">
          <TabList>
            <TabTrigger value="apiKeys" children={<Key size={32} />} />
            <TabTrigger value="html" children={<FileHtml size={32} />} />
          </TabList>
          <TabContent value="apiKeys">
            <CustomInput
              placeholder={"Please inform your zero bounce api key"}
              label={"Zero Bounce Api Key"}
            />
            <CustomInput
              placeholder={"Please inform your Open AI api key"}
              label={"Open AI API Key"}
            />
            <Button
              title={"Save"}
              isLoading={false}
              onClick={() => {
                handleSave("apiKeys");
              }}
            />
          </TabContent>

          <TabContent value="html">
            <TextArea
              label={"Html Pattern"}
              placeholder={"<span>This is a html example</span>"}
            />
            <Button
              title={"Save"}
              isLoading={false}
              onClick={() => {
                handleSave("html");
              }}
            />
          </TabContent>
        </TabRoot>
      </>
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
