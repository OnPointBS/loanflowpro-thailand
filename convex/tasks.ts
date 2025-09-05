import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get tasks for a loan file
export const getTasksByLoanFile = query({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("loanFileId"), loanFileId))
      .collect();
  },
});

// Get tasks for a workspace
export const getTasks = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();
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
      .filter((q) => 
        q.and(
          q.lt(q.field("dueDate"), now),
          q.neq(q.field("status"), "completed")
        )
      )
      .collect();
  },
});

// Create new task
export const createTask = mutation({
  args: {
    loanFileId: v.id("loanFiles"),
    workspaceId: v.id("workspaces"),
    title: v.string(),
    description: v.optional(v.string()),
    urgency: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    dueDate: v.optional(v.number()),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: "pending",
      urgency: args.urgency,
      dueDate: args.dueDate,
      assignedTo: args.assignedTo,
      loanFileId: args.loanFileId,
      workspaceId: args.workspaceId,
      documentIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Add task to loan file
    const loanFile = await ctx.db.get(args.loanFileId);
    if (loanFile) {
      await ctx.db.patch(args.loanFileId, {
        tasks: [...loanFile.tasks, taskId],
        updatedAt: Date.now(),
      });
    }

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "task_created",
      resourceType: "task",
      resourceId: taskId,
      userId: "system", // In real app, get from auth context
      workspaceId: args.workspaceId,
      details: { 
        loanFileId: args.loanFileId,
        title: args.title,
        urgency: args.urgency,
      },
      createdAt: Date.now(),
    });

    return taskId;
  },
});

// Update task
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    )),
    urgency: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    )),
    dueDate: v.optional(v.number()),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, { taskId, ...updates }) => {
    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.title) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status) {
      updateData.status = updates.status;
      if (updates.status === "completed") {
        updateData.completedAt = Date.now();
      }
    }
    if (updates.urgency) updateData.urgency = updates.urgency;
    if (updates.dueDate !== undefined) updateData.dueDate = updates.dueDate;
    if (updates.assignedTo !== undefined) updateData.assignedTo = updates.assignedTo;

    await ctx.db.patch(taskId, updateData);

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "task_updated",
      resourceType: "task",
      resourceId: taskId,
      userId: "system", // In real app, get from auth context
      workspaceId: task.workspaceId,
      details: updates,
      createdAt: Date.now(),
    });
  },
});

// Delete task
export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Remove from loan file
    const loanFile = await ctx.db.get(task.loanFileId);
    if (loanFile) {
      await ctx.db.patch(task.loanFileId, {
        tasks: loanFile.tasks.filter((id: Id<"tasks">) => id !== taskId),
        updatedAt: Date.now(),
      });
    }

    await ctx.db.delete(taskId);

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "task_deleted",
      resourceType: "task",
      resourceId: taskId,
      userId: "system", // In real app, get from auth context
      workspaceId: task.workspaceId,
      details: { loanFileId: task.loanFileId },
      createdAt: Date.now(),
    });
  },
});

// Complete task
export const completeTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    await ctx.db.patch(taskId, {
      status: "completed",
      completedAt: Date.now(),
      updatedAt: Date.now(),
    });

    const task = await ctx.db.get(taskId);
    if (task) {
      // Log the action
      await ctx.db.insert("auditLogs", {
        action: "task_completed",
        resourceType: "task",
        resourceId: taskId,
        userId: "system", // In real app, get from auth context
        workspaceId: task.workspaceId,
        details: { title: task.title },
        createdAt: Date.now(),
      });
    }
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
      overdue: tasks.filter(t => 
        t.dueDate && t.dueDate < Date.now() && t.status !== "completed"
      ).length,
    };

    return stats;
  },
});
