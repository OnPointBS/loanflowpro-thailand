"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { RBACEngine, type User, type Permission, type WorkspaceSettings } from "@/lib/rbac";

interface Workspace {
  _id: string;
  name: string;
  slug: string;
  status: "active" | "trial" | "suspended";
  subscriptionTier: "solo" | "team" | "enterprise";
  settings: WorkspaceSettings;
}

interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  permissions: Permission[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, workspaceSlug?: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyMagicLink: (token: string) => Promise<{
    success: boolean;
    user: {
      _id: string;
      email: string;
      name?: string;
      role: string;
      workspaceId: string;
      status: string;
      profile: any;
    };
    workspace: {
      _id: string;
      name: string;
      slug: string;
      status: string;
    };
    redirectRoute: string;
    isNewUser: boolean;
  }>;
  hasPermission: (permission: Permission) => boolean;
  canAccess: (resource: string, action: string) => boolean;
  canManageBilling: boolean;
  canInviteUsers: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  
  const isAuthenticated = !!sessionToken;

  // Convex actions and mutations
  const sendMagicLinkAction = useAction(api.auth.sendMagicLink);
  const verifyMagicLinkMutation = useMutation(api.auth.verifyMagicLink);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (token) {
      setSessionToken(token);
      // TODO: Verify token with backend
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, workspaceSlug?: string) => {
    try {
      // Send magic link via Convex action
      const result = await sendMagicLinkAction({ email, workspaceSlug });
      
      if (result.success) {
        // Show success message (you could add a toast notification here)
        console.log("Magic link sent successfully");
        return;
      } else {
        throw new Error(result.message || "Failed to send magic link");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    setSessionToken(null);
    setUser(null);
    setWorkspace(null);
    setPermissions([]);
    localStorage.removeItem("sessionToken");
  };

  const verifyMagicLink = async (token: string) => {
    try {
      const result = await verifyMagicLinkMutation({ token });
      
      if (result.success) {
        // Update local state with user and workspace data
        setUser(result.user as User);
        setWorkspace(result.workspace as Workspace);
        setSessionToken(token); // Use the magic link token as session token for now
        localStorage.setItem("sessionToken", token);
        
        // Update permissions based on user role
        const userPermissions = RBACEngine.getPermissionsForUser(result.user as User, result.workspace?.settings);
        setPermissions(userPermissions);
      }
      
      return result;
    } catch (error) {
      console.error("Magic link verification error:", error);
      throw error;
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user || !workspace) return false;
    return RBACEngine.canUserAccess(user, permission.split(":")[0], permission.split(":")[1]);
  };

  const canAccess = (resource: string, action: string): boolean => {
    if (!user || !workspace) return false;
    return RBACEngine.canUserAccess(user, resource, action);
  };

  const canManageBilling = hasPermission("billing:manage");
  const canInviteUsers = hasPermission("users:invite");

  const value: AuthContextType = {
    user,
    workspace,
    permissions,
    isLoading,
    isAuthenticated,
    login,
    logout,
    verifyMagicLink,
    hasPermission,
    canAccess,
    canManageBilling,
    canInviteUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}