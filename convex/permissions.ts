import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { RBACEngine, type User, type WorkspaceSettings } from "../src/lib/rbac";

// Get user permissions
export const getUserPermissions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      return [];
    }

    const workspace = await ctx.db.get(user.workspaceId);
    const workspaceSettings: WorkspaceSettings | undefined = workspace?.settings;

    return RBACEngine.getPermissionsForUser(user, workspaceSettings);
  },
});

// Check if user can access a specific resource
export const canUserAccessResource = query({
  args: { 
    userId: v.id("users"),
    resource: v.string(),
    action: v.string()
  },
  handler: async (ctx, { userId, resource, action }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      return false;
    }

    const workspace = await ctx.db.get(user.workspaceId);
    const workspaceSettings: WorkspaceSettings | undefined = workspace?.settings;

    return RBACEngine.canUserAccess(user, resource, action, workspaceSettings);
  },
});

// Check if user can access a specific route
export const canUserAccessRoute = query({
  args: { 
    userId: v.id("users"),
    route: v.string()
  },
  handler: async (ctx, { userId, route }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      return false;
    }

    const workspace = await ctx.db.get(user.workspaceId);
    const workspaceSettings: WorkspaceSettings | undefined = workspace?.settings;

    return RBACEngine.canAccessRoute(user, route, workspaceSettings);
  },
});

// Get available routes for user
export const getAvailableRoutes = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      return [];
    }

    const workspace = await ctx.db.get(user.workspaceId);
    const workspaceSettings: WorkspaceSettings | undefined = workspace?.settings;

    return RBACEngine.getAvailableRoutes(user, workspaceSettings);
  },
});

// Check if user is workspace admin
export const isWorkspaceAdmin = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      return false;
    }

    return RBACEngine.isWorkspaceAdmin(user);
  },
});

// Check if user can invite other users
export const canInviteUsers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      return false;
    }

    return RBACEngine.canInviteUsers(user);
  },
});

// Check if user can manage billing
export const canManageBilling = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      return false;
    }

    return RBACEngine.canManageBilling(user);
  },
});

// Get user's role and permissions summary
export const getUserRoleSummary = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    const workspace = await ctx.db.get(user.workspaceId);
    const workspaceSettings: WorkspaceSettings | undefined = workspace?.settings;

    const permissions = RBACEngine.getPermissionsForUser(user, workspaceSettings);
    const availableRoutes = RBACEngine.getAvailableRoutes(user, workspaceSettings);
    const isAdmin = RBACEngine.isWorkspaceAdmin(user);
    const canInvite = RBACEngine.canInviteUsers(user);
    const canManageBilling = RBACEngine.canManageBilling(user);

    return {
      role: user.role,
      status: user.status,
      permissions,
      availableRoutes,
      isAdmin,
      canInvite,
      canManageBilling,
      displayName: RBACEngine.getUserDisplayName(user),
    };
  },
});

// Update user permissions (admin only)
export const updateUserPermissions = mutation({
  args: { 
    userId: v.id("users"),
    permissions: v.array(v.string()),
    updatedBy: v.id("users")
  },
  handler: async (ctx, { userId, permissions, updatedBy }) => {
    // Check if the updater is an admin
    const updater = await ctx.db.get(updatedBy);
    if (!updater || !RBACEngine.isWorkspaceAdmin(updater)) {
      throw new Error("Only workspace admins can update user permissions");
    }

    // Check if the user being updated is in the same workspace
    const user = await ctx.db.get(userId);
    if (!user || user.workspaceId !== updater.workspaceId) {
      throw new Error("Cannot update permissions for users in different workspaces");
    }

    // Update permissions
    await ctx.db.patch(userId, {
      permissions,
      updatedAt: Date.now(),
    });

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "user_permissions_updated",
      resourceType: "user",
      resourceId: userId,
      userId: updatedBy,
      workspaceId: user.workspaceId,
      details: { 
        updatedPermissions: permissions,
        targetUser: user.email,
      },
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Get workspace users with their permissions
export const getWorkspaceUsersWithPermissions = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    const workspace = await ctx.db.get(workspaceId);
    const workspaceSettings: WorkspaceSettings | undefined = workspace?.settings;

    return users.map(user => {
      const permissions = RBACEngine.getPermissionsForUser(user, workspaceSettings);
      const isAdmin = RBACEngine.isWorkspaceAdmin(user);
      const canInvite = RBACEngine.canInviteUsers(user);
      const canManageBilling = RBACEngine.canManageBilling(user);

      return {
        ...user,
        permissions,
        isAdmin,
        canInvite,
        canManageBilling,
        displayName: RBACEngine.getUserDisplayName(user),
      };
    });
  },
});
