"use client";

import { Providers } from "./providers";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/theme/default";
import { UserProvider } from "./hooks/userContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <ThemeProvider theme={defaultTheme}>
            <Providers>{children}</Providers>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
