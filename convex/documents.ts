import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Upload a file
export const uploadFile = mutation({
  args: {
    file: v.any(), // File object from browser
    workspaceId: v.id("workspaces"),
    category: v.string(),
    taskId: v.optional(v.id("tasks")),
    clientId: v.optional(v.id("clients")),
    loanFileId: v.optional(v.id("loanFiles")),
    description: v.optional(v.string())
  },
  handler: async (ctx, { file, workspaceId, category, taskId, clientId, loanFileId, description }) => {
    // In a real implementation, you would upload the file to Convex storage
    // For now, we'll create a mock file record
    const fileId = await ctx.db.insert("documents", {
      name: file.name,
      type: file.type,
      size: file.size,
      url: `https://storage.convex.dev/files/${Date.now()}-${file.name}`, // Mock URL
      category,
      workspaceId,
      taskId,
      clientId,
      loanFileId,
      description,
      uploadedBy: "system", // In real implementation, get from auth context
      uploadedAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    return {
      id: fileId,
      url: `https://storage.convex.dev/files/${Date.now()}-${file.name}`
    };
  },
});

// Get all documents for a workspace
export const getDocuments = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .order("desc")
      .collect();
  },
});

// Get documents for a specific task
export const getTaskDocuments = query({
  args: { 
    workspaceId: v.id("workspaces"),
    taskId: v.id("tasks")
  },
  handler: async (ctx, { workspaceId, taskId }) => {
    return await ctx.db
      .query("documents")
      .filter((q) => 
        q.and(
          q.eq(q.field("workspaceId"), workspaceId),
          q.eq(q.field("taskId"), taskId)
        )
      )
      .order("desc")
      .collect();
  },
});

// Get documents for a specific client
export const getClientDocuments = query({
  args: { 
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients")
  },
  handler: async (ctx, { workspaceId, clientId }) => {
    return await ctx.db
      .query("documents")
      .filter((q) => 
        q.and(
          q.eq(q.field("workspaceId"), workspaceId),
          q.eq(q.field("clientId"), clientId)
        )
      )
      .order("desc")
      .collect();
  },
});

// Get documents for a specific loan file
export const getLoanFileDocuments = query({
  args: { 
    workspaceId: v.id("workspaces"),
    loanFileId: v.id("loanFiles")
  },
  handler: async (ctx, { workspaceId, loanFileId }) => {
    return await ctx.db
      .query("documents")
      .filter((q) => 
        q.and(
          q.eq(q.field("workspaceId"), workspaceId),
          q.eq(q.field("loanFileId"), loanFileId)
        )
      )
      .order("desc")
      .collect();
  },
});

// Get a specific document
export const getDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    return await ctx.db.get(documentId);
  },
});

// Update a document
export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    taskId: v.optional(v.id("tasks")),
    clientId: v.optional(v.id("clients")),
    loanFileId: v.optional(v.id("loanFiles"))
  },
  handler: async (ctx, { documentId, ...updates }) => {
    return await ctx.db.patch(documentId, {
      ...updates,
      updatedAt: Date.now()
    });
  },
});

// Delete a document
export const deleteDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    return await ctx.db.delete(documentId);
  },
});

// Get documents by category
export const getDocumentsByCategory = query({
  args: { 
    workspaceId: v.id("workspaces"),
    category: v.string()
  },
  handler: async (ctx, { workspaceId, category }) => {
    return await ctx.db
      .query("documents")
      .filter((q) => 
        q.and(
          q.eq(q.field("workspaceId"), workspaceId),
          q.eq(q.field("category"), category)
        )
      )
      .order("desc")
      .collect();
  },
});

// Search documents
export const searchDocuments = query({
  args: { 
    workspaceId: v.id("workspaces"),
    query: v.string()
  },
  handler: async (ctx, { workspaceId, query }) => {
    const allDocs = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    const searchTerm = query.toLowerCase();
    return allDocs.filter(doc => 
      doc.name.toLowerCase().includes(searchTerm) ||
      doc.description?.toLowerCase().includes(searchTerm) ||
      doc.category.toLowerCase().includes(searchTerm)
    );
  },
});

// Get document statistics
export const getDocumentStats = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    const stats = {
      total: documents.length,
      totalSize: documents.reduce((sum, doc) => sum + doc.size, 0),
      byCategory: documents.reduce((acc, doc) => {
        acc[doc.category] = (acc[doc.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byType: documents.reduce((acc, doc) => {
        const type = doc.type.split('/')[0];
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recent: documents
        .sort((a, b) => b.uploadedAt - a.uploadedAt)
        .slice(0, 5)
    };

    return stats;
  },
});