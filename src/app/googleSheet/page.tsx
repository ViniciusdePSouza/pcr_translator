"use client";
import { Header } from "@/components/Header";
import { Container, Content } from "./styles";
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
        <Modal content={<h1>google sheet works! </h1>} />
      </Content>
    </Container>
  );
}
