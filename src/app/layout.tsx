import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LoanFlow Pro - Streamline Your Loan Workflow",
  description: "The most comprehensive loan workflow management platform for financial advisors. Automate processes, delight clients, and grow your business with confidence.",
  keywords: "loan management, financial advisors, mortgage brokers, loan workflow, document management, client portal",
  authors: [{ name: "LoanFlow Pro" }],
  creator: "LoanFlow Pro",
  publisher: "LoanFlow Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://loanflowpro.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LoanFlow Pro - Streamline Your Loan Workflow",
    description: "The most comprehensive loan workflow management platform for financial advisors. Automate processes, delight clients, and grow your business with confidence.",
    url: "https://loanflowpro.com",
    siteName: "LoanFlow Pro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LoanFlow Pro - Loan Workflow Management Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoanFlow Pro - Streamline Your Loan Workflow",
    description: "The most comprehensive loan workflow management platform for financial advisors. Automate processes, delight clients, and grow your business with confidence.",
    images: ["/og-image.jpg"],
    creator: "@loanflowpro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <PublicHeader />
          <main className="flex-1">
            {children}
          </main>
          <PublicFooter />
        </div>
      </body>
    </html>
  );
}