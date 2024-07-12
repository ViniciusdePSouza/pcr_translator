"use client";

import { Header } from "@/components/Header";
import { Container, Content, MenuTitle, MenuWrapper } from "./styles";
import { Modal } from "@/components/Modal";
import { MenuOptions } from "./components/MenuOption";
import { useRouter } from "next/navigation";

export default function Menu() {
  const navigator = useRouter();

  function navigateToDestinyRoute(route: string) {
    navigator.push(route);
  }

  const MenuComponent = () => {
    return (
      <>
        <MenuTitle>Choose you action</MenuTitle>
        <MenuWrapper>
          <MenuOptions
            isReady={true}
            title={"Email Check"}
            onClick={() => navigateToDestinyRoute("/emailcheck")}
          />

          <MenuOptions
            isReady={false}
            title={"Linkedin Check"}
            onClick={() => navigateToDestinyRoute("/linkedin")}
          />
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
