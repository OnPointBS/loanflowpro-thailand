import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get documents for a loan file
export const getDocumentsByLoanFile = query({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    return await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("loanFileId"), loanFileId))
      .collect();
  },
});

// Get documents for a workspace
export const getDocuments = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();
  },
});

// Get document by ID
export const getDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    return await ctx.db.get(documentId);
  },
});

// Create new document
export const createDocument = mutation({
  args: {
    loanFileId: v.id("loanFiles"),
    workspaceId: v.id("workspaces"),
    uploadedBy: v.id("users"),
    name: v.string(),
    type: v.string(),
    url: v.string(),
    size: v.number(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const documentId = await ctx.db.insert("documents", {
      name: args.name,
      type: args.type,
      url: args.url,
      size: args.size,
      tags: args.tags || [],
      ocrStatus: "pending",
      loanFileId: args.loanFileId,
      workspaceId: args.workspaceId,
      uploadedBy: args.uploadedBy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Add document to loan file
    const loanFile = await ctx.db.get(args.loanFileId);
    if (loanFile) {
      await ctx.db.patch(args.loanFileId, {
        documents: [...loanFile.documents, documentId],
        updatedAt: Date.now(),
      });
    }

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "document_uploaded",
      resourceType: "document",
      resourceId: documentId,
      userId: args.uploadedBy,
      workspaceId: args.workspaceId,
      details: { 
        loanFileId: args.loanFileId,
        name: args.name,
        type: args.type,
        size: args.size,
      },
      createdAt: Date.now(),
    });

    return documentId;
  },
});

// Update document
export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    name: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    ocrStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    )),
    ocrText: v.optional(v.string()),
  },
  handler: async (ctx, { documentId, ...updates }) => {
    const document = await ctx.db.get(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.name) updateData.name = updates.name;
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.ocrStatus) updateData.ocrStatus = updates.ocrStatus;
    if (updates.ocrText !== undefined) updateData.ocrText = updates.ocrText;

    await ctx.db.patch(documentId, updateData);

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "document_updated",
      resourceType: "document",
      resourceId: documentId,
      userId: undefined, // In real app, get from auth context
      workspaceId: document.workspaceId,
      details: updates,
      createdAt: Date.now(),
    });
  },
});

// Delete document
export const deleteDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const document = await ctx.db.get(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    // Remove from loan file
    const loanFile = await ctx.db.get(document.loanFileId);
    if (loanFile) {
      await ctx.db.patch(document.loanFileId, {
        documents: loanFile.documents.filter((id: Id<"documents">) => id !== documentId),
        updatedAt: Date.now(),
      });
    }

    // Remove from tasks that reference this document
    const tasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("workspaceId"), document.workspaceId))
      .collect();

    for (const task of tasks) {
      if (task.documentIds.includes(documentId)) {
        await ctx.db.patch(task._id, {
          documentIds: task.documentIds.filter((id: Id<"documents">) => id !== documentId),
          updatedAt: Date.now(),
        });
      }
    }

    await ctx.db.delete(documentId);

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "document_deleted",
      resourceType: "document",
      resourceId: documentId,
      userId: undefined, // In real app, get from auth context
      workspaceId: document.workspaceId,
      details: { 
        loanFileId: document.loanFileId,
        name: document.name,
      },
      createdAt: Date.now(),
    });
  },
});

// Update OCR results for document
export const updateOCRResults = mutation({
  args: {
    documentId: v.id("documents"),
    ocrResults: v.object({
      text: v.string(),
      confidence: v.number(),
      boundingBoxes: v.array(v.any()),
    }),
  },
  handler: async (ctx, { documentId, ocrResults }) => {
    await ctx.db.patch(documentId, {
      ocrStatus: "completed",
      ocrText: ocrResults.text,
      updatedAt: Date.now(),
    });
  },
});

// Search documents
export const searchDocuments = query({
  args: {
    workspaceId: v.id("workspaces"),
    query: v.string(),
  },
  handler: async (ctx, { workspaceId, query: searchQuery }) => {
    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    const lowercaseQuery = searchQuery.toLowerCase();
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(lowercaseQuery) ||
      doc.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery)) ||
      (doc.ocrText && doc.ocrText.toLowerCase().includes(lowercaseQuery))
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
      byType: documents.reduce((acc, doc) => {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      ocrPending: documents.filter(d => d.ocrStatus === "pending").length,
      ocrProcessing: documents.filter(d => d.ocrStatus === "processing").length,
      ocrCompleted: documents.filter(d => d.ocrStatus === "completed").length,
      ocrFailed: documents.filter(d => d.ocrStatus === "failed").length,
    };

    return stats;
  },
});
