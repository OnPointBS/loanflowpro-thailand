"use client";

import ClientProviders from "@/components/providers/ClientProviders";

// Prevent static generation
export const dynamic = 'force-dynamic';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProviders>
      {children}
    </ClientProviders>
  );
}
