import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DireCursor } from "@/components/ui/cursor-variants";
import AuthInitializer from "@/app/components/auth/auth-initializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DotaGPT - AI Assistant for Dota Players",
  description:
    "AI-powered chat assistant designed for Dota players. Get gameplay advice, hero recommendations, and strategic insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <DireCursor />
        <AuthInitializer>{children}</AuthInitializer>
      </body>
    </html>
  );
}
