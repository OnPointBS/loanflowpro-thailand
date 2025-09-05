import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LoanFlow Pro - Loan Workflow Management",
  description: "Streamline your loan workflow management with our comprehensive SaaS platform",
  keywords: ["loan", "workflow", "management", "SBA", "business", "finance"],
  authors: [{ name: "LoanFlow Pro" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}