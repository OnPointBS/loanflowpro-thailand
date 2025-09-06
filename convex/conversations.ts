import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get conversations for a user
export const getUserConversations = query({
  args: { workspaceId: v.id("workspaces") },
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

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    // Filter conversations where user is a participant
    const userConversations = conversations.filter(conv => 
      conv.participants.includes(user._id)
    );

    // Get participant details for each conversation
    const conversationsWithParticipants = await Promise.all(
      userConversations.map(async (conv) => {
        const participants = await Promise.all(
          conv.participants.map(async (participantId) => {
            const participant = await ctx.db.get(participantId);
            return participant ? {
              id: participant._id,
              name: participant.profile.firstName + " " + participant.profile.lastName,
              role: participant.role,
              avatar: participant.profile.firstName[0] + participant.profile.lastName[0],
              status: participant.lastActiveAt && (Date.now() - participant.lastActiveAt) < 300000 ? "online" : "offline"
            } : null;
          })
        );

        const lastMessage = conv.lastMessageId ? await ctx.db.get(conv.lastMessageId) : null;

        return {
          ...conv,
          participants: participants.filter(Boolean),
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            senderId: lastMessage.senderId,
            timestamp: lastMessage.createdAt,
          } : null,
        };
      })
    );

    return conversationsWithParticipants;
  },
});

// Get messages for a conversation
export const getConversationMessages = query({
  args: { conversationId: v.id("conversations") },
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

    // Check if user is a participant in this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.participants.includes(user._id)) {
      throw new Error("Not authorized to view this conversation");
    }

    const messages = await ctx.db
      .query("conversationMessages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("desc")
      .take(50); // Get last 50 messages

    // Get sender details for each message
    const messagesWithSenders = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        return {
          ...message,
          sender: sender ? {
            id: sender._id,
            name: sender.profile.firstName + " " + sender.profile.lastName,
            role: sender.role,
            avatar: sender.profile.firstName[0] + sender.profile.lastName[0],
          } : null,
        };
      })
    );

    return messagesWithSenders.reverse(); // Return in chronological order
  },
});

// Create or get conversation between users
export const getOrCreateConversation = mutation({
  args: { 
    workspaceId: v.id("workspaces"),
    participantIds: v.array(v.id("users"))
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

    // Ensure current user is in the participants list
    const allParticipants = [...new Set([user._id, ...args.participantIds])];

    // Check if conversation already exists
    const existingConversations = await ctx.db
      .query("conversations")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const existingConversation = existingConversations.find(conv => 
      conv.participants.length === allParticipants.length &&
      conv.participants.every(id => allParticipants.includes(id)) &&
      conv.isActive
    );

    if (existingConversation) {
      return existingConversation._id;
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      workspaceId: args.workspaceId,
      participants: allParticipants,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return conversationId;
  },
});

// Send a message
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    messageType: v.union(v.literal("text"), v.literal("file"), v.literal("system")),
    attachments: v.optional(v.array(v.id("documents"))),
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

    // Check if user is a participant in this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.participants.includes(user._id)) {
      throw new Error("Not authorized to send messages to this conversation");
    }

    // Create the message
    const messageId = await ctx.db.insert("conversationMessages", {
      conversationId: args.conversationId,
      senderId: user._id,
      content: args.content,
      messageType: args.messageType,
      attachments: args.attachments,
      readBy: [{
        userId: user._id,
        readAt: Date.now(),
      }],
      isEdited: false,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update conversation with last message info
    await ctx.db.patch(args.conversationId, {
      lastMessageId: messageId,
      lastMessageAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create notifications for other participants
    const otherParticipants = conversation.participants.filter(id => id !== user._id);
    for (const participantId of otherParticipants) {
      await ctx.db.insert("notifications", {
        userId: participantId,
        workspaceId: conversation.workspaceId,
        type: "messageReceived",
        title: "New Message",
        message: `You have a new message from ${user.profile.firstName} ${user.profile.lastName}`,
        read: false,
        priority: "medium",
        actionUrl: `/portal/messages?conversation=${args.conversationId}`,
        relatedResourceType: "conversation",
        relatedResourceId: args.conversationId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { messageId, success: true };
  },
});

// Mark messages as read
export const markMessagesAsRead = mutation({
  args: { conversationId: v.id("conversations") },
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

    // Check if user is a participant in this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.participants.includes(user._id)) {
      throw new Error("Not authorized to mark messages as read in this conversation");
    }

    // Get unread messages for this conversation
    const messages = await ctx.db
      .query("conversationMessages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    // Mark messages as read
    for (const message of messages) {
      const alreadyRead = message.readBy.some(read => read.userId === user._id);
      if (!alreadyRead) {
        await ctx.db.patch(message._id, {
          readBy: [
            ...message.readBy,
            {
              userId: user._id,
              readAt: Date.now(),
            }
          ],
          updatedAt: Date.now(),
        });
      }
    }

    return { success: true };
  },
});

// Get unread message count for a user
export const getUnreadMessageCount = query({
  args: { workspaceId: v.id("workspaces") },
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

    // Get all conversations for this user
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const userConversations = conversations.filter(conv => 
      conv.participants.includes(user._id)
    );

    let unreadCount = 0;

    for (const conversation of userConversations) {
      const messages = await ctx.db
        .query("conversationMessages")
        .withIndex("by_conversation", (q) => q.eq("conversationId", conversation._id))
        .collect();

      for (const message of messages) {
        const alreadyRead = message.readBy.some(read => read.userId === user._id);
        if (!alreadyRead && message.senderId !== user._id) {
          unreadCount++;
        }
      }
    }

    return unreadCount;
  },
});