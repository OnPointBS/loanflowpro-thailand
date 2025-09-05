import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get messages for a loan file
export const getMessagesByLoanFile = query({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("loanFileId"), loanFileId))
      .order("desc")
      .collect();
  },
});

// Get messages for a thread
export const getMessagesByThread = query({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("threadId"), threadId))
      .order("asc")
      .collect();
  },
});

// Create new message
export const createMessage = mutation({
  args: {
    loanFileId: v.id("loanFiles"),
    workspaceId: v.id("workspaces"),
    authorId: v.id("users"),
    content: v.string(),
    threadId: v.optional(v.string()),
    isSystemMessage: v.optional(v.boolean()),
    attachments: v.optional(v.array(v.id("documents"))),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      content: args.content,
      authorId: args.authorId,
      loanFileId: args.loanFileId,
      workspaceId: args.workspaceId,
      threadId: args.threadId || `thread_${args.loanFileId}_${Date.now()}`,
      isSystemMessage: args.isSystemMessage || false,
      attachments: args.attachments || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Add message to loan file
    const loanFile = await ctx.db.get(args.loanFileId);
    if (loanFile) {
      await ctx.db.patch(args.loanFileId, {
        messages: [...loanFile.messages, messageId],
        updatedAt: Date.now(),
      });
    }

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "message_created",
      resourceType: "message",
      resourceId: messageId,
      userId: args.authorId,
      workspaceId: args.workspaceId,
      details: { 
        loanFileId: args.loanFileId,
        threadId: args.threadId,
        isSystemMessage: args.isSystemMessage,
      },
      createdAt: Date.now(),
    });

    return messageId;
  },
});

// Update message
export const updateMessage = mutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, { messageId, content }) => {
    const message = await ctx.db.get(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    await ctx.db.patch(messageId, {
      content,
      updatedAt: Date.now(),
    });

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "message_updated",
      resourceType: "message",
      resourceId: messageId,
      userId: message.authorId,
      workspaceId: message.workspaceId,
      details: { 
        loanFileId: message.loanFileId,
        threadId: message.threadId,
      },
      createdAt: Date.now(),
    });
  },
});

// Delete message
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.db.get(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Remove from loan file
    const loanFile = await ctx.db.get(message.loanFileId);
    if (loanFile) {
      await ctx.db.patch(message.loanFileId, {
        messages: loanFile.messages.filter((id: Id<"messages">) => id !== messageId),
        updatedAt: Date.now(),
      });
    }

    await ctx.db.delete(messageId);

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "message_deleted",
      resourceType: "message",
      resourceId: messageId,
      userId: message.authorId,
      workspaceId: message.workspaceId,
      details: { 
        loanFileId: message.loanFileId,
        threadId: message.threadId,
      },
      createdAt: Date.now(),
    });
  },
});

// Get recent messages for workspace
export const getRecentMessages = query({
  args: { 
    workspaceId: v.id("workspaces"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { workspaceId, limit = 50 }) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .order("desc")
      .take(limit);
  },
});

// Get message threads for a loan file
export const getMessageThreads = query({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("loanFileId"), loanFileId))
      .collect();

    // Group messages by thread
    const threads = messages.reduce((acc, message) => {
      if (!acc[message.threadId]) {
        acc[message.threadId] = [];
      }
      acc[message.threadId].push(message);
      return acc;
    }, {} as Record<string, typeof messages>);

    // Sort messages within each thread by creation time
    Object.values(threads).forEach((thread: any) => {
      (thread as any[]).sort((a, b) => a.createdAt - b.createdAt);
    });

    return threads;
  },
});

// Create system message
export const createSystemMessage = mutation({
  args: {
    loanFileId: v.id("loanFiles"),
    workspaceId: v.id("workspaces"),
    content: v.string(),
    threadId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      content: args.content,
      authorId: "system" as Id<"users">, // System user ID
      loanFileId: args.loanFileId,
      workspaceId: args.workspaceId,
      threadId: args.threadId || `thread_${args.loanFileId}_${Date.now()}`,
      isSystemMessage: true,
      attachments: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Add message to loan file
    const loanFile = await ctx.db.get(args.loanFileId);
    if (loanFile) {
      await ctx.db.patch(args.loanFileId, {
        messages: [...loanFile.messages, messageId],
        updatedAt: Date.now(),
      });
    }

    return messageId;
  },
});
