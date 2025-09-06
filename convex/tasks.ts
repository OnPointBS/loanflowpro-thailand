import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Create a new task
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    assignedTo: v.union(v.id("users"), v.literal("staff"), v.id("clients")),
    assignedBy: v.union(v.id("users"), v.literal("system")),
    dueDate: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    workspaceId: v.id("workspaces"),
    loanFileId: v.optional(v.id("loanFiles")),
    clientId: v.optional(v.id("clients")),
    isClientTask: v.boolean(),
    isStaffTask: v.boolean(),
    required: v.boolean(),
    order: v.number(),
    fileRequirements: v.optional(v.array(v.string())),
    instructions: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  },
});

// Get all tasks for a workspace
export const getTasks = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .order("desc")
      .collect();
  },
});

// Get tasks for a specific client
export const getClientTasks = query({
  args: { 
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients")
  },
  handler: async (ctx, { workspaceId, clientId }) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => 
        q.and(
          q.eq(q.field("workspaceId"), workspaceId),
          q.eq(q.field("clientId"), clientId)
        )
      )
      .order("asc")
      .collect();
  },
});

// Get tasks for a specific loan file
export const getLoanFileTasks = query({
  args: { 
    workspaceId: v.id("workspaces"),
    loanFileId: v.id("loanFiles")
  },
  handler: async (ctx, { workspaceId, loanFileId }) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => 
        q.and(
          q.eq(q.field("workspaceId"), workspaceId),
          q.eq(q.field("loanFileId"), loanFileId)
        )
      )
      .order("asc")
      .collect();
  },
});

// Get a specific task
export const getTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    return await ctx.db.get(taskId);
  },
});

// Update a task
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent"))),
    assignedTo: v.optional(v.union(v.id("users"), v.literal("staff"), v.id("clients"))),
    dueDate: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    isClientTask: v.optional(v.boolean()),
    isStaffTask: v.optional(v.boolean()),
    required: v.optional(v.boolean()),
    order: v.optional(v.number()),
    fileRequirements: v.optional(v.array(v.string())),
    instructions: v.optional(v.string()),
    completedAt: v.optional(v.number()),
    completedBy: v.optional(v.union(v.id("users"), v.id("clients")))
  },
  handler: async (ctx, { taskId, ...updates }) => {
    return await ctx.db.patch(taskId, {
      ...updates,
      updatedAt: Date.now()
    });
  },
});

// Delete a task
export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    return await ctx.db.delete(taskId);
  },
});

// Assign task to client
export const assignTaskToClient = mutation({
  args: {
    taskId: v.id("tasks"),
    clientId: v.id("clients"),
    workspaceId: v.id("workspaces")
  },
  handler: async (ctx, { taskId, clientId, workspaceId }) => {
    // Check if task already exists for this client
    const existingTask = await ctx.db
      .query("tasks")
      .filter((q) => 
        q.and(
          q.eq(q.field("workspaceId"), workspaceId),
          q.eq(q.field("clientId"), clientId),
          q.eq(q.field("_id"), taskId)
        )
      )
      .first();

    if (existingTask) {
      return existingTask._id;
    }

    // Create a new task instance for this client
    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    return await ctx.db.insert("tasks", {
      ...task,
      clientId,
      assignedTo: clientId,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  },
});

// Reorder tasks
export const reorderTasks = mutation({
  args: {
    taskOrders: v.array(v.object({
      taskId: v.id("tasks"),
      newOrder: v.number()
    }))
  },
  handler: async (ctx, { taskOrders }) => {
    const updatePromises = taskOrders.map(({ taskId, newOrder }) =>
      ctx.db.patch(taskId, { 
        order: newOrder,
        updatedAt: Date.now()
      })
    );

    await Promise.all(updatePromises);
    return true;
  },
});

// Complete a task
export const completeTask = mutation({
  args: {
    taskId: v.id("tasks"),
    completedBy: v.union(v.id("users"), v.id("clients")),
    notes: v.optional(v.string())
  },
  handler: async (ctx, { taskId, completedBy, notes }) => {
    return await ctx.db.patch(taskId, {
      status: "completed",
      completedAt: Date.now(),
      completedBy,
      notes,
      updatedAt: Date.now()
    });
  },
});

// Get task statistics
export const getTaskStats = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const tasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === "pending").length,
      inProgress: tasks.filter(t => t.status === "in_progress").length,
      completed: tasks.filter(t => t.status === "completed").length,
      cancelled: tasks.filter(t => t.status === "cancelled").length,
      overdue: tasks.filter(t => 
        t.dueDate && t.dueDate < Date.now() && t.status !== "completed"
      ).length,
      clientTasks: tasks.filter(t => t.isClientTask).length,
      staffTasks: tasks.filter(t => t.isStaffTask).length
    };

    return stats;
  },
});

// Get overdue tasks
export const getOverdueTasks = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const now = Date.now();
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .filter((q) => q.neq(q.field("status"), "completed"))
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .filter((q) => q.lt(q.field("dueDate"), now))
      .collect();
  },
});