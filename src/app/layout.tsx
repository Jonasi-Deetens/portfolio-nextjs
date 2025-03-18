import { TRPCProvider } from "@/utils/trpcProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "./providers/ClientThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCProvider>
          <ClientThemeProvider>{children}</ClientThemeProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
