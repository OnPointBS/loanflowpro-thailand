import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get loan types for a workspace
export const getLoanTypes = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("loanTypes")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get loan type by ID
export const getLoanType = query({
  args: { loanTypeId: v.id("loanTypes") },
  handler: async (ctx, { loanTypeId }) => {
    return await ctx.db.get(loanTypeId);
  },
});

// Create new loan type
export const createLoanType = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    description: v.string(),
    template: v.object({
      defaultTasks: v.array(v.object({
        title: v.string(),
        description: v.string(),
        dueDays: v.number(),
        urgency: v.union(
          v.literal("low"),
          v.literal("medium"),
          v.literal("high"),
          v.literal("urgent")
        ),
        requiredDocuments: v.array(v.string()),
      })),
      requiredFields: v.array(v.string()),
      estimatedDuration: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const loanTypeId = await ctx.db.insert("loanTypes", {
      name: args.name,
      description: args.description,
      template: args.template,
      workspaceId: args.workspaceId,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "loan_type_created",
      resourceType: "loanType",
      resourceId: loanTypeId,
      userId: undefined, // In real app, get from auth context
      workspaceId: args.workspaceId,
      details: { name: args.name },
      createdAt: Date.now(),
    });

    return loanTypeId;
  },
});

// Update loan type
export const updateLoanType = mutation({
  args: {
    loanTypeId: v.id("loanTypes"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    template: v.optional(v.object({
      defaultTasks: v.array(v.object({
        title: v.string(),
        description: v.string(),
        dueDays: v.number(),
        urgency: v.union(
          v.literal("low"),
          v.literal("medium"),
          v.literal("high"),
          v.literal("urgent")
        ),
        requiredDocuments: v.array(v.string()),
      })),
      requiredFields: v.array(v.string()),
      estimatedDuration: v.number(),
    })),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { loanTypeId, ...updates }) => {
    const loanType = await ctx.db.get(loanTypeId);
    if (!loanType) {
      throw new Error("Loan type not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.name) updateData.name = updates.name;
    if (updates.description) updateData.description = updates.description;
    if (updates.template) updateData.template = updates.template;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

    await ctx.db.patch(loanTypeId, updateData);

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "loan_type_updated",
      resourceType: "loanType",
      resourceId: loanTypeId,
      userId: undefined, // In real app, get from auth context
      workspaceId: loanType.workspaceId,
      details: updates,
      createdAt: Date.now(),
    });
  },
});

// Delete loan type
export const deleteLoanType = mutation({
  args: { loanTypeId: v.id("loanTypes") },
  handler: async (ctx, { loanTypeId }) => {
    const loanType = await ctx.db.get(loanTypeId);
    if (!loanType) {
      throw new Error("Loan type not found");
    }

    // Soft delete by setting isActive to false
    await ctx.db.patch(loanTypeId, {
      isActive: false,
      updatedAt: Date.now(),
    });

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "loan_type_deleted",
      resourceType: "loanType",
      resourceId: loanTypeId,
      userId: undefined, // In real app, get from auth context
      workspaceId: loanType.workspaceId,
      details: { name: loanType.name },
      createdAt: Date.now(),
    });
  },
});

// Create default loan types for new workspace
export const createDefaultLoanTypes = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const defaultTypes = [
      {
        name: "SBA 7(a) Loan",
        description: "Small Business Administration 7(a) loan program",
        template: {
          defaultTasks: [
            {
              title: "Initial Application Review",
              description: "Review initial loan application and supporting documents",
              dueDays: 1,
              urgency: "high" as const,
              requiredDocuments: ["Business Plan", "Financial Statements", "Tax Returns"],
            },
            {
              title: "Credit Check",
              description: "Run credit check on business and personal guarantors",
              dueDays: 2,
              urgency: "high" as const,
              requiredDocuments: ["Credit Authorization", "Personal Financial Statement"],
            },
            {
              title: "Collateral Assessment",
              description: "Assess and document collateral for the loan",
              dueDays: 5,
              urgency: "medium" as const,
              requiredDocuments: ["Appraisal Report", "Property Deed", "Insurance Policy"],
            },
            {
              title: "SBA Form Completion",
              description: "Complete all required SBA forms and documentation",
              dueDays: 7,
              urgency: "high" as const,
              requiredDocuments: ["SBA Form 1919", "SBA Form 912", "SBA Form 413"],
            },
            {
              title: "Final Review and Submission",
              description: "Final review of all documentation before SBA submission",
              dueDays: 10,
              urgency: "urgent" as const,
              requiredDocuments: ["Complete Loan Package"],
            },
          ],
          requiredFields: ["businessName", "loanAmount", "businessType", "yearsInBusiness"],
          estimatedDuration: 14,
        },
      },
      {
        name: "Business Line of Credit",
        description: "Revolving credit facility for business operations",
        template: {
          defaultTasks: [
            {
              title: "Application Review",
              description: "Review line of credit application",
              dueDays: 1,
              urgency: "medium" as const,
              requiredDocuments: ["Application", "Financial Statements"],
            },
            {
              title: "Credit Analysis",
              description: "Analyze creditworthiness and repayment capacity",
              dueDays: 3,
              urgency: "high" as const,
              requiredDocuments: ["Credit Report", "Bank Statements", "P&L Statement"],
            },
            {
              title: "Collateral Documentation",
              description: "Document and verify collateral",
              dueDays: 5,
              urgency: "medium" as const,
              requiredDocuments: ["Collateral List", "Valuation Report"],
            },
            {
              title: "Approval and Documentation",
              description: "Prepare approval documents and loan agreement",
              dueDays: 7,
              urgency: "high" as const,
              requiredDocuments: ["Loan Agreement", "Security Agreement"],
            },
          ],
          requiredFields: ["businessName", "creditLimit", "businessType"],
          estimatedDuration: 10,
        },
      },
      {
        name: "Commercial Real Estate Loan",
        description: "Loan for commercial real estate purchase or refinance",
        template: {
          defaultTasks: [
            {
              title: "Property Analysis",
              description: "Analyze commercial property and market conditions",
              dueDays: 2,
              urgency: "high" as const,
              requiredDocuments: ["Property Appraisal", "Market Analysis", "Property Photos"],
            },
            {
              title: "Borrower Financial Review",
              description: "Review borrower's financial capacity and credit history",
              dueDays: 3,
              urgency: "high" as const,
              requiredDocuments: ["Financial Statements", "Tax Returns", "Credit Report"],
            },
            {
              title: "Environmental Assessment",
              description: "Conduct environmental due diligence",
              dueDays: 7,
              urgency: "medium" as const,
              requiredDocuments: ["Phase I ESA", "Environmental Report"],
            },
            {
              title: "Title and Legal Review",
              description: "Review title and legal documentation",
              dueDays: 10,
              urgency: "high" as const,
              requiredDocuments: ["Title Report", "Survey", "Legal Opinion"],
            },
            {
              title: "Loan Documentation",
              description: "Prepare and review loan documentation",
              dueDays: 12,
              urgency: "urgent" as const,
              requiredDocuments: ["Loan Agreement", "Mortgage", "Insurance Policy"],
            },
          ],
          requiredFields: ["propertyAddress", "loanAmount", "propertyType", "purchasePrice"],
          estimatedDuration: 21,
        },
      },
    ];

    const createdTypes = [];
    for (const type of defaultTypes) {
      const loanTypeId = await ctx.db.insert("loanTypes", {
        name: type.name,
        description: type.description,
        template: type.template,
        workspaceId,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      createdTypes.push(loanTypeId);
    }

    return createdTypes;
  },
});

// Apply loan type template to create tasks
export const applyLoanTypeTemplate = mutation({
  args: {
    loanFileId: v.id("loanFiles"),
    loanTypeId: v.id("loanTypes"),
  },
  handler: async (ctx, { loanFileId, loanTypeId }) => {
    const loanType = await ctx.db.get(loanTypeId);
    const loanFile = await ctx.db.get(loanFileId);
    
    if (!loanType || !loanFile) {
      throw new Error("Loan type or loan file not found");
    }

    const createdTasks = [];
    const now = Date.now();

    for (const taskTemplate of loanType.template.defaultTasks) {
      const dueDate = now + (taskTemplate.dueDays * 24 * 60 * 60 * 1000);
      
      const taskId = await ctx.db.insert("tasks", {
        title: taskTemplate.title,
        description: taskTemplate.description,
        status: "pending",
        urgency: taskTemplate.urgency as "low" | "medium" | "high" | "urgent",
        dueDate,
        loanFileId,
        workspaceId: loanFile.workspaceId,
        documentIds: [],
        createdAt: now,
        updatedAt: now,
      });

      createdTasks.push(taskId);
    }

    // Update loan file with new tasks
    await ctx.db.patch(loanFileId, {
      tasks: [...loanFile.tasks, ...createdTasks],
      updatedAt: now,
    });

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "loan_type_template_applied",
      resourceType: "loanFile",
      resourceId: loanFileId,
      userId: undefined, // In real app, get from auth context
      workspaceId: loanFile.workspaceId,
      details: { 
        loanTypeId,
        loanTypeName: loanType.name,
        tasksCreated: createdTasks.length,
      },
      createdAt: now,
    });

    return createdTasks;
  },
});
