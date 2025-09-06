import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get tasks for a specific loan file
export const getTasksByLoanFile = query({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_loan_file", (q) => q.eq("loanFileId", args.loanFileId))
      .collect();

    return tasks;
  },
});

// Get tasks for a specific client
export const getTasksByClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .collect();

    return tasks;
  },
});

// Mark task as complete
export const completeTask = mutation({
  args: { 
    taskId: v.id("tasks"),
    completedBy: v.union(v.id("users"), v.id("clients")),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Check if user has permission to complete this task
    if (task.assignedTo !== user._id && task.assignedTo !== "staff" && task.assignedTo !== "client") {
      throw new Error("Not authorized to complete this task");
    }

    await ctx.db.patch(args.taskId, {
      status: "completed",
      completedAt: Date.now(),
      completedBy: args.completedBy,
      notes: args.notes,
      updatedAt: Date.now(),
    });

    // Create notification for task completion
    await ctx.db.insert("notifications", {
      userId: user._id,
      workspaceId: task.workspaceId,
      type: "taskCompleted",
      title: "Task Completed",
      message: `Task "${task.title}" has been completed`,
      read: false,
      priority: "medium",
      actionUrl: `/app/tasks/${args.taskId}`,
      relatedResourceType: "task",
      relatedResourceId: args.taskId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Create a new task
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    assignedTo: v.union(v.id("users"), v.literal("staff"), v.id("clients")),
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
    instructions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const taskId = await ctx.db.insert("tasks", {
      ...args,
      status: "pending",
      assignedBy: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create notification for task assignment
    if (args.assignedTo !== user._id) {
      await ctx.db.insert("notifications", {
        userId: args.assignedTo as any,
        workspaceId: args.workspaceId,
        type: "taskAssigned",
        title: "New Task Assigned",
        message: `You have been assigned a new task: "${args.title}"`,
        read: false,
        priority: args.priority,
        actionUrl: `/app/tasks/${taskId}`,
        relatedResourceType: "task",
        relatedResourceId: taskId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { taskId, success: true };
  },
});

// Update task
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent"))),
    assignedTo: v.optional(v.union(v.id("users"), v.literal("staff"), v.id("clients"))),
    dueDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Check if user has permission to update this task
    if (task.assignedBy !== user._id && user.role !== "advisor") {
      throw new Error("Not authorized to update this task");
    }

    const { taskId, ...updateData } = args;
    await ctx.db.patch(args.taskId, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete task
export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Check if user has permission to delete this task
    if (task.assignedBy !== user._id && user.role !== "advisor") {
      throw new Error("Not authorized to delete this task");
    }

    await ctx.db.delete(args.taskId);
    return { success: true };
  },
});