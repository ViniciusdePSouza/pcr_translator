"use client";

import { Providers } from "./providers";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/theme/default";
import { UserProvider } from "./hooks/userContext";
import StyledComponentsRegistry from "./registry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <UserProvider>
            <ThemeProvider theme={defaultTheme}>
              <Providers>{children}</Providers>
            </ThemeProvider>
          </UserProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
