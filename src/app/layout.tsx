import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { CasesProvider } from "@/contexts/cases-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "InvestiHub - Insurance Claim Management",
  description: "Case Management System for insurance claims investigation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <CasesProvider>{children}</CasesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
