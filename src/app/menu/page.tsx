"use client";

import { Header } from "@/components/Header";
import { Container, Content, MenuTitle, MenuWrapper } from "./styles";
import { Modal } from "@/components/Modal";
import { MenuOptions } from "./components/MenuOption";

export default function Menu() {
  const MenuComponent = () => {
    return (
      <>
      <MenuTitle>Choose you action</MenuTitle>
      <MenuWrapper>
        <MenuOptions isReady={true} title={"Email Check"}/>;
        <MenuOptions isReady={false} title={"Linkedin Check"}/>;
      </MenuWrapper>
      </>
    );
  };

  return (
    <Container>
      <Header title={"Menu !"} />
      <Content>
        <Modal content={<MenuComponent />} />
      </Content>
    </Container>
  );
}
