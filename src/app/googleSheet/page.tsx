"use client";
import { Header } from "@/components/Header";
import { Container, Content, TabContent, TabList, TabRoot, TabTrigger } from "./styles";
import { WarningModal } from "@/components/WarningModal";
import { useState } from "react";
import { defaultTheme } from "../styles/theme/default";
import { Warning } from "phosphor-react";
import { Modal } from "@/components/Modal";

export default function GoogleSheetTool() {
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [triggerFunction, setTriggerFunction] = useState(() => () => {});
    const [activeTab, setActiveTab] = useState("generate");

   const TabComponent = () => {
    return (
      <TabRoot
        defaultValue="generate"
        value={activeTab}
        onValueChange={(value: string) => setActiveTab(value)}
      >
        <TabList>
          <TabTrigger value="generate" children="Generate Spreadsheet" />
          <TabTrigger value="update" children="Update PCR records" />
        </TabList>

        <TabContent value="generate">
          <h1>Generating</h1>
        </TabContent>
        <TabContent value="update">
         <h1>Reading</h1>
        </TabContent>
      </TabRoot>
    );
   }
  return (
    <Container>
      <Header title={"Menu !"} />
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
        <Modal content={<TabComponent/>} />
      </Content>
    </Container>
  );
}
