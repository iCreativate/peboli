import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "MESH — AI Automation Agency",
    template: "%s | MESH",
  },
  description:
    "MESH builds custom AI agents, workflow automation, and integrations that remove busywork from growing companies.",
  icons: {
    icon: "/icon",
  },
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ErrorHandler } from "@/components/providers/ErrorHandler";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${syne.variable} ${manrope.variable} font-sans antialiased`}>
        <ErrorHandler />
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
