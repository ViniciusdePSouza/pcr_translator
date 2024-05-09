"use client";

import { PropsWithChildren } from "react";
import { GlobalStyle } from "./styles/global";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <GlobalStyle />
      {children}
    </>
  );
}
