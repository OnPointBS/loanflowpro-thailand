"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { useAuthActions, useAuthToken } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { RBACEngine, type User, type Permission, type WorkspaceSettings } from "@/lib/rbac";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  status: "active" | "trial" | "suspended";
  settings: WorkspaceSettings;
}

interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  permissions: Permission[];
  isLoading: boolean;
  isAuthenticated: boolean;
  sendMagicLink: (email: string, workspaceSlug?: string) => Promise<void>;
  verifyMagicLink: (token: string) => Promise<{ redirectRoute: string; isNewUser: boolean }>;
  createWorkspace: (email: string, workspaceName: string, name?: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  canAccess: (resource: string, action: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  getAvailableRoutes: () => string[];
  isWorkspaceAdmin: boolean;
  canInviteUsers: boolean;
  canManageBilling: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { signIn, signOut } = useAuthActions();
  const token = useAuthToken();
  const isAuthenticated = !!token;
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sendMagicLinkMutation = useMutation(api.auth.sendMagicLink);
  const verifyMagicLinkMutation = useMutation(api.auth.verifyMagicLink);
  const createWorkspaceMutation = useMutation(api.auth.createWorkspaceAndUser);
  const getUserPermissions = useQuery(api.auth.getUserPermissions, 
    user ? { userId: user._id as Id<"users"> } : "skip"
  );

  // Get current user and workspace when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // In a real implementation, you'd get user data from Convex Auth
      // For now, we'll use the existing logic
      const storedUser = localStorage.getItem("user");
      const storedWorkspace = localStorage.getItem("workspace");
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          if (storedWorkspace) {
            const workspaceData = JSON.parse(storedWorkspace);
            setWorkspace(workspaceData);
          }
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("workspace");
        }
      }
      
      setIsLoading(false);
    } else {
      setUser(null);
      setWorkspace(null);
      setPermissions([]);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Update permissions when user or workspace changes
  useEffect(() => {
    if (user && workspace) {
      const userPermissions = RBACEngine.getPermissionsForUser(user, workspace.settings);
      setPermissions(userPermissions);
    } else {
      setPermissions([]);
    }
  }, [user, workspace]);

  const sendMagicLink = async (email: string, workspaceSlug?: string) => {
    try {
      await sendMagicLinkMutation({ email, workspaceSlug });
    } catch (error) {
      console.error("Error sending magic link:", error);
      throw error;
    }
  };

  const verifyMagicLink = async (token: string) => {
    try {
      const result = await verifyMagicLinkMutation({ token });

      if (result.success) {
        setUser(result.user);
        setWorkspace(result.workspace);
        
        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("workspace", JSON.stringify(result.workspace));
        
        return {
          redirectRoute: result.redirectRoute,
          isNewUser: result.isNewUser,
        };
      }
    } catch (error) {
      console.error("Error verifying magic link:", error);
      throw error;
    }
  };

  const createWorkspace = async (
    email: string, 
    workspaceName: string, 
    name?: string, 
    firstName?: string, 
    lastName?: string
  ) => {
    try {
      const result = await createWorkspaceMutation({
        email,
        workspaceName,
        name,
        firstName,
        lastName,
      });

      if (result.success) {
        // Send magic link to the new workspace
        await sendMagicLink(email, result.slug);
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setWorkspace(null);
    setPermissions([]);
    localStorage.removeItem("user");
    localStorage.removeItem("workspace");
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user || !workspace) return false;
    return RBACEngine.hasPermission(user, permission, workspace.settings);
  };

  const canAccess = (resource: string, action: string): boolean => {
    if (!user || !workspace) return false;
    return RBACEngine.canUserAccess(user, resource, action, workspace.settings);
  };

  const canAccessRoute = (route: string): boolean => {
    if (!user || !workspace) return false;
    return RBACEngine.canAccessRoute(user, route, workspace.settings);
  };

  const getAvailableRoutes = (): string[] => {
    if (!user || !workspace) return [];
    return RBACEngine.getAvailableRoutes(user, workspace.settings);
  };

  const isWorkspaceAdmin = user ? RBACEngine.isWorkspaceAdmin(user) : false;
  const canInviteUsers = user ? RBACEngine.canInviteUsers(user) : false;
  const canManageBilling = user ? RBACEngine.canManageBilling(user) : false;

  const value = {
    user,
    workspace,
    permissions,
    isLoading,
    isAuthenticated,
    sendMagicLink,
    verifyMagicLink,
    createWorkspace,
    logout,
    hasPermission,
    canAccess,
    canAccessRoute,
    getAvailableRoutes,
    isWorkspaceAdmin,
    canInviteUsers,
    canManageBilling,
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
