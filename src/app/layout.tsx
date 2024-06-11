"use client";

import { Providers } from "./providers";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/theme/default";
import { UserProvider } from "./hooks/userContext";
import StyledComponentsRegistry from "./registry";
import { CandidatesProvider } from "./hooks/candidatesContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <CandidatesProvider>
            <UserProvider>
              <ThemeProvider theme={defaultTheme}>
                <Providers>{children}</Providers>
              </ThemeProvider>
            </UserProvider>
          </CandidatesProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
