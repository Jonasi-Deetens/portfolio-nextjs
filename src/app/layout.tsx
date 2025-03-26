import { TRPCProvider } from "@/utils/trpcProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "./providers/ClientThemeProvider";
import { UserProvider } from "./context/UserContext";

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
          <UserProvider>
            <ClientThemeProvider>{children}</ClientThemeProvider>
          </UserProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
