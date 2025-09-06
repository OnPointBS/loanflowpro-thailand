import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Create a new loan type
export const createLoanType = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    presetTasks: v.array(v.object({
      title: v.string(),
      description: v.string(),
      category: v.string(),
      isClientTask: v.boolean(),
      isStaffTask: v.boolean(),
      required: v.boolean(),
      estimatedDays: v.number(),
      order: v.number()
    })),
    requirements: v.array(v.string()),
    interestRateRange: v.object({
      min: v.number(),
      max: v.number()
    }),
    maxLoanAmount: v.number(),
    minCreditScore: v.number(),
    maxLtv: v.number(), // Loan-to-Value ratio
    active: v.boolean()
  },
  handler: async (ctx, args) => {
    const { workspaceId, ...data } = args;
    
    return await ctx.db.insert("loanTypes", {
      ...data,
      workspaceId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  },
});

// Get all loan types for a workspace
export const getLoanTypes = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("loanTypes")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .order("desc")
      .collect();
  },
});

// Get a specific loan type
export const getLoanType = query({
  args: { loanTypeId: v.id("loanTypes") },
  handler: async (ctx, { loanTypeId }) => {
    return await ctx.db.get(loanTypeId);
  },
});

// Update a loan type
export const updateLoanType = mutation({
  args: {
    loanTypeId: v.id("loanTypes"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    presetTasks: v.optional(v.array(v.object({
      title: v.string(),
      description: v.string(),
      category: v.string(),
      isClientTask: v.boolean(),
      isStaffTask: v.boolean(),
      required: v.boolean(),
      estimatedDays: v.number(),
      order: v.number()
    }))),
    requirements: v.optional(v.array(v.string())),
    interestRateRange: v.optional(v.object({
      min: v.number(),
      max: v.number()
    })),
    maxLoanAmount: v.optional(v.number()),
    minCreditScore: v.optional(v.number()),
    maxLtv: v.optional(v.number()),
    active: v.optional(v.boolean())
  },
  handler: async (ctx, { loanTypeId, ...updates }) => {
    return await ctx.db.patch(loanTypeId, {
      ...updates,
      updatedAt: Date.now()
    });
  },
});

// Delete a loan type
export const deleteLoanType = mutation({
  args: { loanTypeId: v.id("loanTypes") },
  handler: async (ctx, { loanTypeId }) => {
    return await ctx.db.delete(loanTypeId);
  },
});

// Create tasks from loan type preset
export const createTasksFromLoanType = mutation({
  args: {
    loanTypeId: v.id("loanTypes"),
    loanFileId: v.id("loanFiles"),
    clientId: v.id("clients"),
    workspaceId: v.id("workspaces")
  },
  handler: async (ctx, { loanTypeId, loanFileId, clientId, workspaceId }) => {
    const loanType = await ctx.db.get(loanTypeId);
    if (!loanType) {
      throw new Error("Loan type not found");
    }

    const createdTasks = [];
    
    for (const presetTask of loanType.presetTasks) {
      const taskId = await ctx.db.insert("tasks", {
        title: presetTask.title,
        description: presetTask.description,
        category: presetTask.category,
        status: "pending",
        priority: presetTask.required ? "high" : "medium",
        assignedTo: presetTask.isStaffTask ? "staff" : clientId,
        assignedBy: "system",
        dueDate: Date.now() + (presetTask.estimatedDays * 24 * 60 * 60 * 1000),
        estimatedHours: presetTask.estimatedDays * 8,
        workspaceId,
        loanFileId,
        clientId,
        isClientTask: presetTask.isClientTask,
        isStaffTask: presetTask.isStaffTask,
        required: presetTask.required,
        order: presetTask.order,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      
      createdTasks.push(taskId);
    }

    return createdTasks;
  },
});

// Get preset tasks for a loan type
export const getPresetTasks = query({
  args: { loanTypeId: v.id("loanTypes") },
  handler: async (ctx, { loanTypeId }) => {
    const loanType = await ctx.db.get(loanTypeId);
    return loanType?.presetTasks || [];
  },
});

// Reorder preset tasks
export const reorderPresetTasks = mutation({
  args: {
    loanTypeId: v.id("loanTypes"),
    taskOrders: v.array(v.object({
      taskIndex: v.number(),
      newOrder: v.number()
    }))
  },
  handler: async (ctx, { loanTypeId, taskOrders }) => {
    const loanType = await ctx.db.get(loanTypeId);
    if (!loanType) {
      throw new Error("Loan type not found");
    }

    const updatedTasks = [...loanType.presetTasks];
    
    for (const { taskIndex, newOrder } of taskOrders) {
      if (updatedTasks[taskIndex]) {
        updatedTasks[taskIndex].order = newOrder;
      }
    }

    // Sort by order
    updatedTasks.sort((a, b) => a.order - b.order);

    return await ctx.db.patch(loanTypeId, {
      presetTasks: updatedTasks,
      updatedAt: Date.now()
    });
  },
});