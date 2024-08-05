"use client";

import { Header } from "@/components/Header";
import { Container, Content, MenuTitle, MenuWrapper } from "./styles";
import { Modal } from "@/components/Modal";
import { MenuOptions } from "./components/MenuOption";
import { useRouter } from "next/navigation";
import { useUser } from "../hooks/userContext";
import { LoginApiResponseType } from "@/@types";
import { useEffect } from "react";

export default function Menu() {
  const navigator = useRouter();
  const { user, saveUser, checkExpiredToken, signOut } = useUser();

  function navigateToDestinyRoute(route: string) {
    navigator.push(route);
  }

  useEffect(() => {
    const user = localStorage.getItem("@pcr-translator:user");

    if (user) {
      const userObj: LoginApiResponseType = JSON.parse(user);
      saveUser(userObj);
      const loginDate = new Date(userObj.loginDate);

      if (checkExpiredToken(loginDate)) {
        signOut();
        navigator.replace("/");
      }
    } else {
      signOut();
      navigator.replace("/");
    }
  }, []);

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
            isReady={true}
            title={"Linkedin Check"}
            onClick={() => navigateToDestinyRoute("/linkedincheck")}
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
