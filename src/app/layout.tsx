"use client";

import { TRPCProvider } from "@/utils/trpcProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { CharacterProvider } from "./providers/CharacterProvider";
import ClientThemeProvider from "./providers/ClientThemeProvider";
import { MapProvider } from "./providers/MapProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <TRPCProvider>
            <CharacterProvider>
              <MapProvider>
                <ClientThemeProvider>{children}</ClientThemeProvider>
              </MapProvider>
            </CharacterProvider>
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
