import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { CasesProvider } from "@/contexts/cases-context";
import { TenantThemeProvider } from "@/components/brand/tenant-theme";
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
    <html lang="en" data-tenant="default">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <TenantThemeProvider>
            <CasesProvider>{children}</CasesProvider>
          </TenantThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
