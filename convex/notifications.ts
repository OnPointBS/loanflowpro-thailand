import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Test function
export const testNotification = query({
  args: {},
  handler: async (ctx) => {
    return { message: "Notification system is working" };
  },
});

// Get unread notification count
export const getUnreadCount = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", userId).eq("read", false))
      .collect();

    return unreadNotifications.length;
  },
});

// Get notifications for a user
export const getNotifications = query({
  args: {
    userId: v.id("users"),
    read: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, read, limit }) => {
    let query = ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc");

    if (read !== undefined) {
      query = ctx.db
        .query("notifications")
        .withIndex("by_user_unread", (q) => q.eq("userId", userId).eq("read", read))
        .order("desc");
    }

    if (limit) {
      return await query.take(limit);
    }

    return await query.collect();
  },
});

// Create a notification
export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    type: v.union(
      v.literal("taskAssigned"),
      v.literal("taskCompleted"),
      v.literal("taskOverdue"),
      v.literal("clientAdded"),
      v.literal("clientUpdated"),
      v.literal("loanFileStatusChange"),
      v.literal("documentUploaded"),
      v.literal("messageReceived"),
      v.literal("invitationReceived"),
      v.literal("systemAlert")
    ),
    title: v.string(),
    message: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    actionUrl: v.optional(v.string()),
    metadata: v.optional(v.any()),
    relatedResourceType: v.optional(v.string()),
    relatedResourceId: v.optional(v.string()),
  },
  handler: async (ctx, notificationData) => {
    const now = Date.now();
    const user = await ctx.db.get(notificationData.userId);
    if (!user || !user.notificationSettings) return null;

    const typeKey = notificationData.type as keyof typeof user.notificationSettings.types;
    if (!user.notificationSettings.inApp || !user.notificationSettings.types[typeKey]) {
      return null; // In-app notifications disabled or specific type disabled
    }

    return await ctx.db.insert("notifications", {
      ...notificationData,
      read: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: {
    notificationId: v.optional(v.id("notifications")),
    userId: v.id("users"),
    markAll: v.optional(v.boolean()),
  },
  handler: async (ctx, { notificationId, userId, markAll }) => {
    const now = Date.now();
    if (markAll) {
      const unreadNotifications = await ctx.db
        .query("notifications")
        .withIndex("by_user_unread", (q) => q.eq("userId", userId).eq("read", false))
        .collect();

      await Promise.all(
        unreadNotifications.map((notification) =>
          ctx.db.patch(notification._id, { read: true, readAt: now, updatedAt: now })
        )
      );
    } else if (notificationId) {
      await ctx.db.patch(notificationId, { read: true, readAt: now, updatedAt: now });
    }
    return { success: true };
  },
});

// Get user notification settings
export const getUserNotificationSettings = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    return user?.notificationSettings || null;
  },
});

// Create notifications for multiple users
export const createNotificationForUsers = mutation({
  args: {
    userIds: v.array(v.id("users")),
    workspaceId: v.id("workspaces"),
    type: v.union(
      v.literal("taskAssigned"),
      v.literal("taskCompleted"),
      v.literal("taskOverdue"),
      v.literal("clientAdded"),
      v.literal("clientUpdated"),
      v.literal("loanFileStatusChange"),
      v.literal("documentUploaded"),
      v.literal("messageReceived"),
      v.literal("invitationReceived"),
      v.literal("systemAlert")
    ),
    title: v.string(),
    message: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    actionUrl: v.optional(v.string()),
    metadata: v.optional(v.any()),
    relatedResourceType: v.optional(v.string()),
    relatedResourceId: v.optional(v.string()),
  },
  handler: async (ctx, notificationData) => {
    const now = Date.now();
    const notificationIds: Id<"notifications">[] = [];

    for (const userId of notificationData.userIds) {
      const user = await ctx.db.get(userId);
      if (!user || !user.notificationSettings) continue;

      const typeKey = notificationData.type as keyof typeof user.notificationSettings.types;
      if (!user.notificationSettings.inApp || !user.notificationSettings.types[typeKey]) continue;

      const notificationId = await ctx.db.insert("notifications", {
        userId,
        workspaceId: notificationData.workspaceId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        priority: notificationData.priority,
        actionUrl: notificationData.actionUrl,
        metadata: notificationData.metadata,
        relatedResourceType: notificationData.relatedResourceType,
        relatedResourceId: notificationData.relatedResourceId,
        read: false,
        createdAt: now,
        updatedAt: now,
      });
      notificationIds.push(notificationId);
    }
    return notificationIds;
  },
});

// Update user notification settings
export const updateNotificationSettings = mutation({
  args: {
    userId: v.id("users"),
    settings: v.object({
      email: v.boolean(),
      inApp: v.boolean(),
      types: v.object({
        taskAssigned: v.boolean(),
        taskCompleted: v.boolean(),
        taskOverdue: v.boolean(),
        clientAdded: v.boolean(),
        clientUpdated: v.boolean(),
        loanFileStatusChange: v.boolean(),
        documentUploaded: v.boolean(),
        messageReceived: v.boolean(),
        invitationReceived: v.boolean(),
        systemAlert: v.boolean(),
      }),
      frequency: v.union(v.literal("immediate"), v.literal("hourly"), v.literal("daily")),
    }),
  },
  handler: async (ctx, { userId, settings }) => {
    await ctx.db.patch(userId, { notificationSettings: settings, updatedAt: Date.now() });
    return { success: true };
  },
});
