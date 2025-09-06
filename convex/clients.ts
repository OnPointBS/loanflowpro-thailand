import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Get all clients for a workspace
export const getClients = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("clients")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();
  },
});

// Get client by ID
export const getClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, { clientId }) => {
    return await ctx.db.get(clientId);
  },
});

// Create new client
export const createClient = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const clientId = await ctx.db.insert("clients", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      status: "prospect",
      workspaceId: args.workspaceId,
      profile: {
        company: args.company,
        address: args.address,
        notes: args.notes,
      },
      loanFiles: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "client_created",
      resourceType: "client",
      resourceId: clientId,
      userId: undefined, // In real app, get from auth context
      workspaceId: args.workspaceId,
      details: { clientName: args.name },
      createdAt: Date.now(),
    });

    // Create notification for all workspace users
    const workspaceUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .collect();

    if (workspaceUsers.length > 0) {
      await ctx.runMutation(api.notifications.createNotificationForUsers, {
        userIds: workspaceUsers.map(u => u._id),
        workspaceId: args.workspaceId,
        type: "clientAdded",
        title: "New Client Added",
        message: `A new client "${args.name}" has been added to the workspace.`,
        priority: "medium",
        actionUrl: `/app/clients/${clientId}`,
        relatedResourceType: "client",
        relatedResourceId: clientId,
      });
    }

    return clientId;
  },
});

// Update client
export const updateClient = mutation({
  args: {
    clientId: v.id("clients"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("prospect")
    )),
    company: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { clientId, ...updates }) => {
    const client = await ctx.db.get(clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.name) updateData.name = updates.name;
    if (updates.email) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.status) updateData.status = updates.status;

    if (updates.company !== undefined || updates.address !== undefined || updates.notes !== undefined) {
      updateData.profile = {
        ...client.profile,
        ...(updates.company !== undefined && { company: updates.company }),
        ...(updates.address !== undefined && { address: updates.address }),
        ...(updates.notes !== undefined && { notes: updates.notes }),
      };
    }

    await ctx.db.patch(clientId, updateData);

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "client_updated",
      resourceType: "client",
      resourceId: clientId,
      userId: undefined, // In real app, get from auth context
      workspaceId: client.workspaceId,
      details: updates,
      createdAt: Date.now(),
    });

    // Create notification for all workspace users
    const workspaceUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("workspaceId"), client.workspaceId))
      .collect();

    if (workspaceUsers.length > 0) {
      await ctx.runMutation(api.notifications.createNotificationForUsers, {
        userIds: workspaceUsers.map(u => u._id),
        workspaceId: client.workspaceId,
        type: "clientUpdated",
        title: "Client Updated",
        message: `Client "${client.name}" information has been updated.`,
        priority: "low",
        actionUrl: `/app/clients/${clientId}`,
        relatedResourceType: "client",
        relatedResourceId: clientId,
      });
    }
  },
});

// Delete client
export const deleteClient = mutation({
  args: { clientId: v.id("clients") },
  handler: async (ctx, { clientId }) => {
    const client = await ctx.db.get(clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    // Check if client has active loan files
    if (client.loanFiles.length > 0) {
      throw new Error("Cannot delete client with active loan files");
    }

    await ctx.db.delete(clientId);

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "client_deleted",
      resourceType: "client",
      resourceId: clientId,
      userId: undefined, // In real app, get from auth context
      workspaceId: client.workspaceId,
      details: { clientName: client.name },
      createdAt: Date.now(),
    });
  },
});

// Search clients
export const searchClients = query({
  args: {
    workspaceId: v.id("workspaces"),
    query: v.string(),
  },
  handler: async (ctx, { workspaceId, query: searchQuery }) => {
    const clients = await ctx.db
      .query("clients")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    const lowercaseQuery = searchQuery.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(lowercaseQuery) ||
      client.email.toLowerCase().includes(lowercaseQuery) ||
      (client.profile.company && client.profile.company.toLowerCase().includes(lowercaseQuery))
    );
  },
});
