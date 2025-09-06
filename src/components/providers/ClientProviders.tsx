"use client";

import { ConvexProvider } from "convex/react";
import { convex } from "@/lib/convex";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <WorkspaceProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </ConvexProvider>
  );
}
