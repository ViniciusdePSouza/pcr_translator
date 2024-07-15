"use client";

import { Header } from "@/components/Header";
import { Container, Content } from "./styles";
import { Modal } from "@/components/Modal";

export default function LinkedinCheck() {

  const FormComponent = () => {
    return (<h1>Linkedin page works!</h1>);
  };

  return (
    <Container>
      <Header title={"Linkedin Check !"} />
      <Content>
        <Modal content={<FormComponent/>} />
      </Content>
    </Container>
  );
}
