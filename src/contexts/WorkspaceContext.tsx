"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "./AuthContext";

interface Workspace {
  _id: string;
  name: string;
  slug: string;
  status: "active" | "trial" | "suspended";
  subscriptionTier: "solo" | "team" | "enterprise";
  settings: {
    timezone: string;
    dateFormat: string;
    timeFormat: "12h" | "24h";
    branding: {
      primaryColor: string;
      logo?: string;
      companyName: string;
    };
  };
  createdAt: number;
  updatedAt: number;
}

interface WorkspaceContextType {
  workspace: Workspace | null;
  isLoading: boolean;
  isTrial: boolean;
  isActive: boolean;
  canAccess: (feature: string) => boolean;
  getPlanLimits: () => {
    maxClients: number;
    maxStorage: number;
    maxSeats: number;
  };
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user, workspace: authWorkspace, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authWorkspace) {
      setIsLoading(false);
    } else if (user === null) {
      setIsLoading(false);
    }
  }, [authWorkspace, user]);

  const workspace = authWorkspace;
  const isTrial = workspace?.status === "trial";
  const isActive = workspace?.status === "active";

  const getPlanLimits = () => {
    const limits = {
      solo: { maxClients: 10, maxStorage: 1024 * 1024 * 1024, maxSeats: 1 },
      team: { maxClients: 50, maxStorage: 5 * 1024 * 1024 * 1024, maxSeats: 5 },
      enterprise: { maxClients: 500, maxStorage: 50 * 1024 * 1024 * 1024, maxSeats: 50 },
    };
    
    return limits[workspace?.subscriptionTier || "solo"];
  };

  const canAccess = (feature: string) => {
    if (!workspace) return false;
    
    // Trial users have limited access
    if (isTrial) {
      const trialFeatures = [
        "clients",
        "loan_files",
        "tasks",
        "documents",
        "messaging",
        "basic_reports",
      ];
      return trialFeatures.includes(feature);
    }
    
    // Active users have full access
    if (isActive) {
      return true;
    }
    
    // Suspended users have no access
    return false;
  };

  const value = {
    workspace,
    isLoading: isLoading || authLoading,
    isTrial,
    isActive,
    canAccess,
    getPlanLimits,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
