"use client";

import { List, SignOut } from "phosphor-react";
import { ButtonWrapper, Container } from "./styles";
import { defaultTheme } from "@/app/styles/theme/default";
import { useUser } from "@/app/hooks/userContext";
import { useRouter } from "next/navigation";
import { HeaderButton } from "../HeaderButton";
interface HeaderProps {
  title: string;
}
export function Header({ title }: HeaderProps) {
  const { signOut } = useUser();

  const navigator = useRouter();

  function handleLogOut() {
    signOut();
    navigator.replace("/");
  }

  function goToMenu() {
    navigator.replace("/menu");
  }
  return (
    <Container>
      <h1>{title}</h1>
      <ButtonWrapper>
        <HeaderButton
          label={"Menu"}
          onClick={goToMenu}
          icon={<List size={24} color={defaultTheme.COLORS.WHITE_100} />}
        />
        <HeaderButton
          label={"Sign Out"}
          onClick={handleLogOut}
          icon={<SignOut size={24} color={defaultTheme.COLORS.WHITE_100} />}
        />
      </ButtonWrapper>
    </Container>
  );
}
