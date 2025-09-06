export type UserRole = "advisor" | "staff" | "client" | "partner";

export type Permission = 
  | "workspace:manage"
  | "clients:create" | "clients:read" | "clients:update" | "clients:delete"
  | "loanfiles:create" | "loanfiles:read" | "loanfiles:update" | "loanfiles:delete"
  | "documents:upload" | "documents:read" | "documents:delete"
  | "billing:manage" | "billing:read"
  | "users:invite" | "users:manage"
  | "settings:manage"
  | "tasks:create" | "tasks:read" | "tasks:update" | "tasks:delete"
  | "messages:create" | "messages:read"
  | "reports:read"
  | "widgets:manage";

export interface User {
  _id: string;
  email: string;
  name?: string;
  role: UserRole;
  workspaceId: string;
  status: "active" | "pending" | "suspended";
  permissions?: string[];
  lastActiveAt?: number;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
  };
}

export interface WorkspaceSettings {
  allowClientRegistration: boolean;
  requireApproval: boolean;
  customBranding?: {
    logoUrl?: string;
    primaryColor?: string;
    companyName?: string;
  };
}

export class RBACEngine {
  // Role-based permission matrix
  private static readonly ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    advisor: [
      "workspace:manage",
      "clients:create", "clients:read", "clients:update", "clients:delete",
      "loanfiles:create", "loanfiles:read", "loanfiles:update", "loanfiles:delete",
      "documents:upload", "documents:read", "documents:delete",
      "billing:manage", "billing:read",
      "users:invite", "users:manage",
      "settings:manage",
      "tasks:create", "tasks:read", "tasks:update", "tasks:delete",
      "messages:create", "messages:read",
      "reports:read",
      "widgets:manage",
    ],
    staff: [
      "clients:create", "clients:read", "clients:update", "clients:delete",
      "loanfiles:create", "loanfiles:read", "loanfiles:update", "loanfiles:delete",
      "documents:upload", "documents:read", "documents:delete",
      "billing:read",
      "tasks:create", "tasks:read", "tasks:update", "tasks:delete",
      "messages:create", "messages:read",
      "reports:read",
    ],
    partner: [
      "clients:read", "clients:update",
      "loanfiles:read", "loanfiles:update",
      "documents:read",
      "messages:create", "messages:read",
      "reports:read",
    ],
    client: [
      "loanfiles:read",
      "documents:read",
      "messages:create", "messages:read",
    ],
  };

  /**
   * Get permissions for a user based on their role and custom permissions
   */
  static getPermissionsForUser(user: User, workspaceSettings?: WorkspaceSettings): Permission[] {
    const rolePermissions = this.ROLE_PERMISSIONS[user.role] || [];
    const customPermissions = (user.permissions || []) as Permission[];
    
    // Combine role permissions with custom permissions
    const allPermissions: Permission[] = [...new Set([...rolePermissions, ...customPermissions])];
    
    // Apply workspace-specific restrictions
    if (user.role === "client" && workspaceSettings?.requireApproval) {
      // Clients might have limited access if approval is required
      return allPermissions.filter(permission => 
        !permission.includes(":create") && !permission.includes(":update") && !permission.includes(":delete")
      ) as Permission[];
    }
    
    return allPermissions;
  }

  /**
   * Check if a user has a specific permission
   */
  static hasPermission(user: User, permission: Permission, workspaceSettings?: WorkspaceSettings): boolean {
    const userPermissions = this.getPermissionsForUser(user, workspaceSettings);
    return userPermissions.includes(permission);
  }

  /**
   * Check if a user can perform an action on a resource
   */
  static canUserAccess(user: User, resource: string, action: string, workspaceSettings?: WorkspaceSettings): boolean {
    const permission = `${resource}:${action}` as Permission;
    return this.hasPermission(user, permission, workspaceSettings);
  }

  /**
   * Get the default route for a user based on their role
   */
  static getDefaultRouteForUser(user: User, workspace: { slug: string }): string {
    switch (user.role) {
      case "advisor":
        // Advisors (admins) go to the main dashboard
        return `/app`;
      case "staff":
        // Staff members go to the main dashboard
        return `/app`;
      case "partner":
        // Partners go to the main dashboard (they have limited access)
        return `/app`;
      case "client":
        // Clients go to the client portal
        return `/portal`;
      default:
        // Unknown role, redirect to login
        console.warn(`Unknown user role: ${user.role}, redirecting to login`);
        return `/auth/signin`;
    }
  }

  /**
   * Check if a user can access a specific workspace
   */
  static canAccessWorkspace(user: User, workspaceId: string): boolean {
    return user.workspaceId === workspaceId && user.status === "active";
  }

  /**
   * Check if a user can access a specific route
   */
  static canAccessRoute(user: User, route: string, workspaceSettings?: WorkspaceSettings): boolean {
    // Define route-to-permission mapping
    const routePermissions: Record<string, Permission[]> = {
      "/app": ["clients:read", "loanfiles:read"],
      "/app/clients": ["clients:read"],
      "/app/clients/new": ["clients:create"],
      "/app/loan-files": ["loanfiles:read"],
      "/app/loan-files/new": ["loanfiles:create"],
      "/app/documents": ["documents:read"],
      "/app/documents/upload": ["documents:upload"],
      "/app/billing": ["billing:read"],
      "/app/settings": ["settings:manage"],
      "/app/users": ["users:manage"],
      "/portal": ["loanfiles:read"],
    };

    const requiredPermissions = routePermissions[route] || [];
    
    // If no specific permissions required, allow access
    if (requiredPermissions.length === 0) {
      return true;
    }

    // Check if user has any of the required permissions
    return requiredPermissions.some(permission => 
      this.hasPermission(user, permission, workspaceSettings)
    );
  }

  /**
   * Get available routes for a user based on their permissions
   */
  static getAvailableRoutes(user: User, workspaceSettings?: WorkspaceSettings): string[] {
    const allRoutes = [
      "/app",
      "/app/clients",
      "/app/clients/new",
      "/app/loan-files",
      "/app/loan-files/new",
      "/app/documents",
      "/app/documents/upload",
      "/app/billing",
      "/app/settings",
      "/app/users",
      "/portal",
    ];

    return allRoutes.filter(route => this.canAccessRoute(user, route, workspaceSettings));
  }

  /**
   * Check if a user is a workspace admin
   */
  static isWorkspaceAdmin(user: User): boolean {
    return user.role === "advisor" && this.hasPermission(user, "workspace:manage");
  }

  /**
   * Check if a user can invite other users
   */
  static canInviteUsers(user: User): boolean {
    return this.hasPermission(user, "users:invite");
  }

  /**
   * Check if a user can manage billing
   */
  static canManageBilling(user: User): boolean {
    return this.hasPermission(user, "billing:manage");
  }

  /**
   * Get user's display name
   */
  static getUserDisplayName(user: User): string {
    if (user.name) {
      return user.name;
    }
    return `${user.profile.firstName} ${user.profile.lastName}`;
  }

  /**
   * Check if a user can access client portal
   */
  static canAccessClientPortal(user: User): boolean {
    return user.role === "client" && user.status === "active";
  }

  /**
   * Check if a user can access admin dashboard
   */
  static canAccessAdminDashboard(user: User): boolean {
    return (user.role === "advisor" || user.role === "staff" || user.role === "partner") && user.status === "active";
  }
}
