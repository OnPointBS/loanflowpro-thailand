"use client";

import ClientProviders from "@/components/providers/ClientProviders";
import SignInContent from "@/components/auth/SignInContent";

// Prevent static generation
export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <ClientProviders>
      <SignInContent />
    </ClientProviders>
  );
}