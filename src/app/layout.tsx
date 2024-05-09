"use client";

import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/theme/default";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={defaultTheme}>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
