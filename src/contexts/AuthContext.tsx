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
    
    // Check for authentication cookies and set state
    const userCookie = document.cookie.split(';').find(c => c.trim().startsWith('user='));
    const workspaceCookie = document.cookie.split(';').find(c => c.trim().startsWith('workspace='));
    
    if (userCookie && workspaceCookie) {
      try {
        const userData = JSON.parse(userCookie.split('=')[1]);
        const workspaceData = JSON.parse(workspaceCookie.split('=')[1]);
        
        console.log("Found authentication cookies, setting user and workspace state:", {
          user: userData,
          workspace: workspaceData
        });
        
        setUser(userData);
        setWorkspace(workspaceData);
        
        // Update permissions based on user role
        const userPermissions = RBACEngine.getPermissionsForUser(userData, workspaceData?.settings);
        setPermissions(userPermissions);
      } catch (error) {
        console.error("Error parsing authentication cookies:", error);
      }
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
    
    // Clear authentication cookies
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "workspace=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  const verifyMagicLink = async (token: string) => {
    try {
      console.log("Verifying magic link with token:", token);
      const result = await verifyMagicLinkMutation({ token });
      console.log("Magic link verification result:", result);
      
      if (result.success) {
        // Update local state with user and workspace data
        setUser(result.user as User);
        setWorkspace(result.workspace as Workspace);
        setSessionToken(token); // Use the magic link token as session token for now
        localStorage.setItem("sessionToken", token);
        
        // Set cookies for middleware authentication
        const userCookie = `user=${JSON.stringify(result.user)}; path=/; max-age=86400`; // 24 hours
        const workspaceCookie = `workspace=${JSON.stringify(result.workspace)}; path=/; max-age=86400`; // 24 hours
        
        document.cookie = userCookie;
        document.cookie = workspaceCookie;
        
        console.log("Set authentication cookies:", {
          userCookie: userCookie.substring(0, 50) + "...",
          workspaceCookie: workspaceCookie.substring(0, 50) + "...",
          userRole: result.user.role,
          redirectRoute: result.redirectRoute
        });
        
        // Update permissions based on user role
        const userPermissions = RBACEngine.getPermissionsForUser(result.user as User, result.workspace?.settings);
        setPermissions(userPermissions);
        
        console.log("User authenticated successfully:", {
          email: result.user.email,
          role: result.user.role,
          redirectRoute: result.redirectRoute
        });
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