"use client"

import { SignOut } from "phosphor-react";
import { Container } from "./styles";
import { defaultTheme } from "@/app/styles/theme/default";
import { useUser } from "@/app/hooks/userContext";
import { useRouter } from "next/navigation";
interface HeaderProps {
  title: string;
}
export function Header({ title }: HeaderProps) {
  const { signOut } = useUser();

  const navigator = useRouter();

  function handleLogOut() {
    signOut();
    navigator.replace('/')
  }
  return (
    <Container>
      <h1>{title}</h1>
      <button onClick={handleLogOut}>
        <SignOut size={32} color={defaultTheme.COLORS.WHITE_100} />
      </button>
    </Container>
  );
}
