import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get loan files for a client
export const getLoanFilesByClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, { clientId }) => {
    return await ctx.db
      .query("loanFiles")
      .withIndex("by_client", (q) => q.eq("clientId", clientId))
      .collect();
  },
});

// Get loan file by ID
export const getLoanFile = query({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    return await ctx.db.get(loanFileId);
  },
});

// Get all loan files for a workspace
export const getLoanFiles = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("loanFiles")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .collect();
  },
});

// Create new loan file
export const createLoanFile = mutation({
  args: {
    clientId: v.id("clients"),
    workspaceId: v.id("workspaces"),
    type: v.string(),
    amount: v.optional(v.number()),
    purpose: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    )),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const loanFileId = await ctx.db.insert("loanFiles", {
      clientId: args.clientId,
      workspaceId: args.workspaceId,
      type: args.type,
      status: "draft",
      progress: 0,
      amount: args.amount,
      purpose: args.purpose,
      priority: args.priority || "medium",
      dueDate: args.dueDate,
      tasks: [],
      documents: [],
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update client's loan files array
    const client = await ctx.db.get(args.clientId);
    if (client) {
      await ctx.db.patch(args.clientId, {
        loanFiles: [...client.loanFiles, loanFileId],
        updatedAt: Date.now(),
      });
    }

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "loan_file_created",
      resourceType: "loanFile",
      resourceId: loanFileId,
      userId: "system", // In real app, get from auth context
      workspaceId: args.workspaceId,
      details: { 
        clientId: args.clientId,
        type: args.type,
        amount: args.amount,
      },
      createdAt: Date.now(),
    });

    return loanFileId;
  },
});

// Update loan file
export const updateLoanFile = mutation({
  args: {
    loanFileId: v.id("loanFiles"),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("in_progress"),
      v.literal("under_review"),
      v.literal("approved"),
      v.literal("funded"),
      v.literal("declined"),
      v.literal("cancelled")
    )),
    progress: v.optional(v.number()),
    amount: v.optional(v.number()),
    purpose: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    )),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, { loanFileId, ...updates }) => {
    const loanFile = await ctx.db.get(loanFileId);
    if (!loanFile) {
      throw new Error("Loan file not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.status) updateData.status = updates.status;
    if (updates.progress !== undefined) updateData.progress = updates.progress;
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.purpose !== undefined) updateData.purpose = updates.purpose;
    if (updates.priority) updateData.priority = updates.priority;
    if (updates.dueDate !== undefined) updateData.dueDate = updates.dueDate;

    await ctx.db.patch(loanFileId, updateData);

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "loan_file_updated",
      resourceType: "loanFile",
      resourceId: loanFileId,
      userId: "system", // In real app, get from auth context
      workspaceId: loanFile.workspaceId,
      details: updates,
      createdAt: Date.now(),
    });
  },
});

// Delete loan file
export const deleteLoanFile = mutation({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    const loanFile = await ctx.db.get(loanFileId);
    if (!loanFile) {
      throw new Error("Loan file not found");
    }

    // Remove from client's loan files array
    const client = await ctx.db.get(loanFile.clientId);
    if (client) {
      await ctx.db.patch(loanFile.clientId, {
        loanFiles: client.loanFiles.filter(id => id !== loanFileId),
        updatedAt: Date.now(),
      });
    }

    // Delete associated tasks
    for (const taskId of loanFile.tasks) {
      await ctx.db.delete(taskId);
    }

    // Delete associated documents
    for (const docId of loanFile.documents) {
      await ctx.db.delete(docId);
    }

    // Delete associated messages
    for (const messageId of loanFile.messages) {
      await ctx.db.delete(messageId);
    }

    await ctx.db.delete(loanFileId);

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "loan_file_deleted",
      resourceType: "loanFile",
      resourceId: loanFileId,
      userId: "system", // In real app, get from auth context
      workspaceId: loanFile.workspaceId,
      details: { clientId: loanFile.clientId },
      createdAt: Date.now(),
    });
  },
});

// Get loan file with full details
export const getLoanFileDetails = query({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    const loanFile = await ctx.db.get(loanFileId);
    if (!loanFile) return null;

    // Get client details
    const client = await ctx.db.get(loanFile.clientId);

    // Get tasks
    const tasks = await Promise.all(
      loanFile.tasks.map(taskId => ctx.db.get(taskId))
    );

    // Get documents
    const documents = await Promise.all(
      loanFile.documents.map(docId => ctx.db.get(docId))
    );

    // Get messages
    const messages = await Promise.all(
      loanFile.messages.map(messageId => ctx.db.get(messageId))
    );

    return {
      ...loanFile,
      client,
      tasks: tasks.filter(Boolean),
      documents: documents.filter(Boolean),
      messages: messages.filter(Boolean),
    };
  },
});
