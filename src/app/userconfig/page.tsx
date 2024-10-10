"use client";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";

import { useRouter } from "next/navigation";

import { Container, Content } from "./styles";

export default function UserConfig() {
  const navigator = useRouter();

  return (
    <Container>
      <Header title={"Filter Email Domain!"} />
      <Content>
        <Modal content={<h1>OI</h1>} />
      </Content>
    </Container>
  );
}
