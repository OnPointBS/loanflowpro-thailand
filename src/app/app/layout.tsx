"use client";

import ClientProviders from "@/components/providers/ClientProviders";
import AppLayoutContent from "@/components/layout/AppLayoutContent";

// Prevent static generation
export const dynamic = 'force-dynamic';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProviders>
      <AppLayoutContent>{children}</AppLayoutContent>
    </ClientProviders>
  );
}
