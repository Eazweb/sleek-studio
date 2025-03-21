import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/SessionProvider";
import Navbar from "@/components/Header/Navbar";
import { ScrollProgress } from "@/components/magicui/scroll-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>   
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
      <ScrollProgress className="top-0" />
        <Navbar/>
        {children}
      </body>
        </AuthProvider>
    </html>
  );
}
