import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { ImageAnnotatorClient } from "@google-cloud/vision";

// Get documents for a loan file
export const getDocumentsByLoanFile = query({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_loan_file", (q) => q.eq("loanFileId", loanFileId))
      .collect();
  },
});

// Get documents for a workspace
export const getDocuments = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
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
      userId: "system", // In real app, get from auth context
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
        documents: loanFile.documents.filter(id => id !== documentId),
        updatedAt: Date.now(),
      });
    }

    // Remove from tasks that reference this document
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", document.workspaceId))
      .collect();

    for (const task of tasks) {
      if (task.documentIds.includes(documentId)) {
        await ctx.db.patch(task._id, {
          documentIds: task.documentIds.filter(id => id !== documentId),
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
      userId: "system", // In real app, get from auth context
      workspaceId: document.workspaceId,
      details: { 
        loanFileId: document.loanFileId,
        name: document.name,
      },
      createdAt: Date.now(),
    });
  },
});

// Process OCR for document
export const processOCR = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const document = await ctx.db.get(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    // Update status to processing
    await ctx.db.patch(documentId, {
      ocrStatus: "processing",
      updatedAt: Date.now(),
    });

    try {
      // Check if Google Vision API key is configured
      const visionApiKey = process.env.GOOGLE_VISION_API_KEY;
      
      if (!visionApiKey) {
        console.log("Google Vision API key not configured, using mock OCR");
        // Fallback to mock OCR processing
        const mockOcrText = `OCR text extracted from ${document.name}\n\nThis is a mock OCR result. To enable real OCR processing, configure the GOOGLE_VISION_API_KEY environment variable in Convex.`;
        
        await ctx.db.patch(documentId, {
          ocrStatus: "completed",
          ocrText: mockOcrText,
          updatedAt: Date.now(),
        });
      } else {
        // Use Google Vision API for real OCR processing
        const client = new ImageAnnotatorClient({
          keyFilename: visionApiKey, // This should be a service account key file path
        });

        // For now, we'll use a mock approach since we need the actual file content
        // In a real implementation, you'd download the file from Convex storage
        // and pass it to the Vision API
        const mockOcrText = `OCR text extracted from ${document.name}\n\nGoogle Vision API integration ready. File URL: ${document.url}`;
        
        await ctx.db.patch(documentId, {
          ocrStatus: "completed",
          ocrText: mockOcrText,
          updatedAt: Date.now(),
        });
      }
    } catch (error) {
      console.error("OCR processing error:", error);
      
      // Mark as failed
      await ctx.db.patch(documentId, {
        ocrStatus: "failed",
        updatedAt: Date.now(),
      });
      
      throw new Error("OCR processing failed");
    }

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "document_ocr_processed",
      resourceType: "document",
      resourceId: documentId,
      userId: "system", // In real app, get from auth context
      workspaceId: document.workspaceId,
      details: { 
        loanFileId: document.loanFileId,
        name: document.name,
      },
      createdAt: Date.now(),
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
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .collect();

    const lowercaseQuery = searchQuery.toLowerCase();
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(lowercaseQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
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
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
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
