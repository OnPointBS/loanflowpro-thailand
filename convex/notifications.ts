import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Get notifications for a user
export const getUserNotifications = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, limit = 50 }) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return notifications;
  },
});

// Get unread notification count
export const getUnreadCount = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const count = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", userId).eq("read", false))
      .count();

    return count;
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, { notificationId }) => {
    await ctx.db.patch(notificationId, {
      read: true,
      readAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", userId).eq("read", false))
      .collect();

    const now = Date.now();
    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, {
        read: true,
        readAt: now,
        updatedAt: now,
      });
    }
  },
});

// Delete notification
export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, { notificationId }) => {
    await ctx.db.delete(notificationId);
  },
});

// Create notification
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
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const notificationId = await ctx.db.insert("notifications", {
      ...args,
      read: false,
      createdAt: now,
      updatedAt: now,
    });

    return notificationId;
  },
});

// Get user notification settings
export const getUserNotificationSettings = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return user.notificationSettings;
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
    await ctx.db.patch(userId, {
      notificationSettings: settings,
      updatedAt: Date.now(),
    });
  },
});

// Create notification for multiple users (for workspace-wide notifications)
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
  handler: async (ctx, { userIds, ...notificationData }) => {
    const now = Date.now();
    const notificationIds = [];

    for (const userId of userIds) {
      // Check user's notification settings before creating
      const user = await ctx.db.get(userId);
      if (!user) continue;

      const settings = user.notificationSettings;
      if (!settings.inApp) continue;

      // Check if this type of notification is enabled
      const typeKey = notificationData.type as keyof typeof settings.types;
      if (!settings.types[typeKey]) continue;

      const notificationId = await ctx.db.insert("notifications", {
        userId,
        workspaceId: notificationData.workspaceId,
        ...notificationData,
        read: false,
        createdAt: now,
        updatedAt: now,
      });

      notificationIds.push(notificationId);
    }

    return notificationIds;
  },
});

// Get notifications by type
export const getNotificationsByType = query({
  args: {
    userId: v.id("users"),
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
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, type, limit = 20 }) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("type"), type))
      .order("desc")
      .take(limit);

    return notifications;
  },
});

// Get recent notifications (last 24 hours)
export const getRecentNotifications = query({
  args: {
    userId: v.id("users"),
    hours: v.optional(v.number()),
  },
  handler: async (ctx, { userId, hours = 24 }) => {
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("createdAt"), cutoffTime))
      .order("desc")
      .take(50);

    return notifications;
  },
});
