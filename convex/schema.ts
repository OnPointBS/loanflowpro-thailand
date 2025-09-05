import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Convex Auth tables
  ...authTables,
  
  // Workspaces table
  workspaces: defineTable({
    name: v.string(),
    slug: v.string(), // unique identifier for URLs
    status: v.union(v.literal("active"), v.literal("trial"), v.literal("suspended")),
    subscriptionTier: v.union(v.literal("solo"), v.literal("team"), v.literal("enterprise")),
    subscription: v.object({
      plan: v.union(v.literal("solo"), v.literal("team"), v.literal("enterprise")),
      status: v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due")),
      seats: v.number(),
      stripeCustomerId: v.optional(v.string()),
      stripeSubscriptionId: v.optional(v.string()),
      currentPeriodEnd: v.optional(v.number()),
    }),
    settings: v.object({
      timezone: v.string(),
      dateFormat: v.string(),
      timeFormat: v.union(v.literal("12h"), v.literal("24h")),
      allowClientRegistration: v.boolean(),
      requireApproval: v.boolean(),
      customBranding: v.optional(v.object({
        logoUrl: v.optional(v.string()),
        primaryColor: v.optional(v.string()),
        companyName: v.optional(v.string()),
      })),
      branding: v.object({
        primaryColor: v.string(),
        logo: v.optional(v.string()),
        companyName: v.string(),
      }),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  // Users table
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("advisor"), v.literal("staff"), v.literal("client")),
    workspaceId: v.id("workspaces"),
    status: v.union(v.literal("active"), v.literal("pending"), v.literal("suspended")),
    permissions: v.optional(v.array(v.string())), // custom permissions override
    lastActiveAt: v.optional(v.number()),
    profile: v.object({
      firstName: v.string(),
      lastName: v.string(),
      avatar: v.optional(v.string()),
      phone: v.optional(v.string()),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"])
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_role", ["workspaceId", "role"]),

  // Clients table
  clients: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("prospect")),
    workspaceId: v.id("workspaces"),
    profile: v.object({
      company: v.optional(v.string()),
      address: v.optional(v.string()),
      notes: v.optional(v.string()),
    }),
    loanFiles: v.array(v.id("loanFiles")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"])
    .index("by_email", ["email"]),

  // Loan Files table
  loanFiles: defineTable({
    clientId: v.id("clients"),
    workspaceId: v.id("workspaces"),
    type: v.string(), // SBA 7(a), Business LOC, etc.
    status: v.union(
      v.literal("draft"),
      v.literal("in_progress"),
      v.literal("under_review"),
      v.literal("approved"),
      v.literal("funded"),
      v.literal("declined"),
      v.literal("cancelled")
    ),
    progress: v.number(), // 0-100
    amount: v.optional(v.number()),
    purpose: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    dueDate: v.optional(v.number()),
    tasks: v.array(v.id("tasks")),
    documents: v.array(v.id("documents")),
    messages: v.array(v.id("messages")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_client", ["clientId"])
    .index("by_workspace", ["workspaceId"])
    .index("by_status", ["status"]),

  // Loan Types table (templates)
  loanTypes: defineTable({
    name: v.string(),
    description: v.string(),
    template: v.object({
      defaultTasks: v.array(v.object({
        title: v.string(),
        description: v.string(),
        dueDays: v.number(), // days from creation
        urgency: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
        requiredDocuments: v.array(v.string()),
      })),
      requiredFields: v.array(v.string()),
      estimatedDuration: v.number(), // days
    }),
    workspaceId: v.id("workspaces"),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  // Tasks table
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled")),
    urgency: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    assignedTo: v.optional(v.id("users")),
    loanFileId: v.id("loanFiles"),
    workspaceId: v.id("workspaces"),
    documentIds: v.array(v.id("documents")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_loan_file", ["loanFileId"])
    .index("by_workspace", ["workspaceId"])
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"]),

  // Documents table
  documents: defineTable({
    name: v.string(),
    type: v.string(), // PDF, JPG, PNG, etc.
    url: v.string(),
    size: v.number(),
    tags: v.array(v.string()),
    ocrStatus: v.union(v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("failed")),
    ocrText: v.optional(v.string()),
    loanFileId: v.id("loanFiles"),
    workspaceId: v.id("workspaces"),
    uploadedBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_loan_file", ["loanFileId"])
    .index("by_workspace", ["workspaceId"])
    .index("by_ocr_status", ["ocrStatus"]),

  // Messages table
  messages: defineTable({
    content: v.string(),
    authorId: v.id("users"),
    loanFileId: v.id("loanFiles"),
    workspaceId: v.id("workspaces"),
    threadId: v.string(),
    isSystemMessage: v.boolean(),
    attachments: v.array(v.id("documents")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_loan_file", ["loanFileId"])
    .index("by_workspace", ["workspaceId"])
    .index("by_thread", ["threadId"]),

  // Subscriptions table
  subscriptions: defineTable({
    workspaceId: v.id("workspaces"),
    plan: v.union(v.literal("solo"), v.literal("team"), v.literal("enterprise")),
    status: v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due")),
    seats: v.number(),
    usage: v.object({
      activeClients: v.number(),
      storageUsed: v.number(), // in bytes
      documentsProcessed: v.number(),
    }),
    stripeData: v.object({
      customerId: v.string(),
      subscriptionId: v.string(),
      priceId: v.string(),
      currentPeriodEnd: v.number(),
    }),
    trialEndsAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  // Magic links for authentication
  magicLinks: defineTable({
    email: v.string(),
    token: v.string(),
    workspaceId: v.optional(v.id("workspaces")),
    expiresAt: v.number(),
    usedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_token", ["token"])
    .index("by_email", ["email"]),

  // OTP tokens for authentication (fallback)
  otpTokens: defineTable({
    email: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    used: v.boolean(),
    createdAt: v.number(),
  }).index("by_email", ["email"])
    .index("by_token", ["token"]),

  // Client invitations
  clientInvitations: defineTable({
    email: v.string(),
    workspaceId: v.id("workspaces"),
    invitedBy: v.id("users"),
    token: v.string(),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("expired")),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
    clientId: v.optional(v.id("clients")),
    message: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["token"])
    .index("by_email", ["email"])
    .index("by_workspace", ["workspaceId"])
    .index("by_status", ["status"]),

  // Audit logs
  auditLogs: defineTable({
    action: v.string(),
    resourceType: v.string(),
    resourceId: v.string(),
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    details: v.any(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"])
    .index("by_resource", ["resourceType", "resourceId"]),
});
