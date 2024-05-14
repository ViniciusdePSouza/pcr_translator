"use client";

import { Providers } from "./providers";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/theme/default";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <ThemeProvider theme={defaultTheme}>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
