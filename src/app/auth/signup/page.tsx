"use client";

import ClientProviders from "@/components/providers/ClientProviders";
import SignUpContent from "@/components/auth/SignUpContent";

// Prevent static generation
export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  return (
    <ClientProviders>
      <SignUpContent />
    </ClientProviders>
  );
}