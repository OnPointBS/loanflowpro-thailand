"use client";

import ClientProviders from "@/components/providers/ClientProviders";
import VerifyPageContent from "@/components/auth/VerifyPageContent";

// Prevent static generation
export const dynamic = 'force-dynamic';

export default function VerifyPage() {
  return (
    <ClientProviders>
      <VerifyPageContent />
    </ClientProviders>
  );
}
