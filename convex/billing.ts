import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import Stripe from "stripe";

// Get subscription for workspace
export const getSubscription = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .first();
  },
});

// Update subscription
export const updateSubscription = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    plan: v.union(v.literal("solo"), v.literal("team"), v.literal("enterprise")),
    status: v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due")),
    seats: v.number(),
    stripeData: v.object({
      customerId: v.string(),
      subscriptionId: v.string(),
      priceId: v.string(),
      currentPeriodEnd: v.number(),
    }),
  },
  handler: async (ctx, { workspaceId, plan, status, seats, stripeData }) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        plan,
        status,
        seats,
        stripeData,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("subscriptions", {
        workspaceId,
        plan,
        status,
        seats,
        usage: {
          activeClients: 0,
          storageUsed: 0,
          documentsProcessed: 0,
        },
        stripeData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Update workspace subscription info
    const workspace = await ctx.db.get(workspaceId);
    if (workspace) {
      await ctx.db.patch(workspaceId, {
        subscription: {
          plan,
          status,
          seats,
          stripeCustomerId: stripeData.customerId,
          stripeSubscriptionId: stripeData.subscriptionId,
          currentPeriodEnd: stripeData.currentPeriodEnd,
        },
        updatedAt: Date.now(),
      });
    }
  },
});

// Update usage statistics
export const updateUsage = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    activeClients: v.optional(v.number()),
    storageUsed: v.optional(v.number()),
    documentsProcessed: v.optional(v.number()),
  },
  handler: async (ctx, { workspaceId, ...usage }) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .first();

    if (subscription) {
      const newUsage = {
        ...subscription.usage,
        ...usage,
      };

      await ctx.db.patch(subscription._id, {
        usage: newUsage,
        updatedAt: Date.now(),
      });
    }
  },
});

// Get usage statistics
export const getUsage = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .first();

    if (!subscription) {
      return {
        activeClients: 0,
        storageUsed: 0,
        documentsProcessed: 0,
        seats: 1,
        plan: "solo",
        status: "active",
      };
    }

    return {
      ...subscription.usage,
      seats: subscription.seats,
      plan: subscription.plan,
      status: subscription.status,
    };
  },
});

// Check if workspace is within limits
export const checkLimits = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .first();

    if (!subscription) {
      return {
        withinLimits: true,
        limits: {
          maxClients: 10, // Solo plan default
          maxStorage: 1024 * 1024 * 1024, // 1GB
          maxSeats: 1,
        },
        usage: {
          activeClients: 0,
          storageUsed: 0,
          seats: 1,
        },
      };
    }

    const limits = {
      solo: { maxClients: 10, maxStorage: 1024 * 1024 * 1024, maxSeats: 1 },
      team: { maxClients: 50, maxStorage: 5 * 1024 * 1024 * 1024, maxSeats: 5 },
      enterprise: { maxClients: 500, maxStorage: 50 * 1024 * 1024 * 1024, maxSeats: 50 },
    };

    const planLimits = limits[subscription.plan];
    const usage = subscription.usage;

    const withinLimits = 
      usage.activeClients <= planLimits.maxClients &&
      usage.storageUsed <= planLimits.maxStorage &&
      usage.seats <= planLimits.maxSeats;

    return {
      withinLimits,
      limits: planLimits,
      usage,
    };
  },
});

// Get billing history
export const getBillingHistory = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    // In a real implementation, you'd fetch from Stripe
    // For now, return mock data
    return [
      {
        id: "inv_1",
        amount: 4900, // $49.00 in cents
        status: "paid",
        date: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
        description: "Solo Plan - Monthly",
      },
    ];
  },
});

// Create checkout session
export const createCheckoutSession = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    plan: v.union(v.literal("solo"), v.literal("team"), v.literal("enterprise")),
    seats: v.number(),
  },
  handler: async (ctx, { workspaceId, plan, seats }) => {
    try {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      
      if (!stripeSecretKey) {
        console.log("Stripe secret key not configured, using mock checkout");
        // Fallback to mock checkout session
        const sessionId = `cs_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await ctx.db.insert("auditLogs", {
          action: "checkout_session_created",
          resourceType: "subscription",
          resourceId: workspaceId,
          userId: "system",
          workspaceId,
          details: { plan, seats, sessionId, mock: true },
          createdAt: Date.now(),
        });

        return { 
          sessionId, 
          url: `https://checkout.stripe.com/pay/${sessionId}`,
          mock: true 
        };
      }

      // Use real Stripe integration
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2024-12-18.acacia",
      });

      // Define pricing based on plan
      const pricing = {
        solo: { priceId: "price_solo_monthly", amount: 4900 }, // $49.00
        team: { priceId: "price_team_monthly", amount: 9900 }, // $99.00
        enterprise: { priceId: "price_enterprise_monthly", amount: 29900 }, // $299.00
      };

      const price = pricing[plan];
      
      // Get workspace to find or create Stripe customer
      const workspace = await ctx.db.get(workspaceId);
      if (!workspace) {
        throw new Error("Workspace not found");
      }

      let customerId = workspace.subscription.stripeCustomerId;

      if (!customerId) {
        // Create Stripe customer
        const customer = await stripe.customers.create({
          email: workspace.name, // In real app, get from user email
          name: workspace.name,
          metadata: {
            workspaceId,
          },
        });
        customerId = customer.id;
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: price.priceId,
            quantity: seats,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXTAUTH_URL}/app/billing?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/app/billing?canceled=true`,
        metadata: {
          workspaceId,
          plan,
          seats: seats.toString(),
        },
      });

      // Log the action
      await ctx.db.insert("auditLogs", {
        action: "checkout_session_created",
        resourceType: "subscription",
        resourceId: workspaceId,
        userId: "system",
        workspaceId,
        details: { plan, seats, sessionId: session.id },
        createdAt: Date.now(),
      });

      return { 
        sessionId: session.id, 
        url: session.url!,
        mock: false 
      };
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      throw new Error("Failed to create checkout session");
    }
  },
});

// Handle webhook from Stripe
export const handleWebhook = mutation({
  args: {
    eventType: v.string(),
    data: v.any(),
  },
  handler: async (ctx, { eventType, data }) => {
    try {
      const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!stripeWebhookSecret) {
        console.log("Stripe webhook secret not configured, processing without verification");
      }

      // Handle different Stripe webhook events
      switch (eventType) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(ctx, data);
          break;
        case "customer.subscription.updated":
          await handleSubscriptionUpdated(ctx, data);
          break;
        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(ctx, data);
          break;
        case "invoice.payment_succeeded":
          await handlePaymentSucceeded(ctx, data);
          break;
        case "invoice.payment_failed":
          await handlePaymentFailed(ctx, data);
          break;
        default:
          console.log(`Unhandled webhook event: ${eventType}`);
      }

      // Log the webhook
      await ctx.db.insert("auditLogs", {
        action: "stripe_webhook_received",
        resourceType: "webhook",
        resourceId: data.id || "unknown",
        userId: "system",
        workspaceId: data.metadata?.workspaceId || "unknown",
        details: { eventType, data },
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error("Error processing Stripe webhook:", error);
      throw new Error("Webhook processing failed");
    }
  },
});

// Helper functions for webhook event handling
async function handleCheckoutSessionCompleted(ctx: any, data: any) {
  const { customer, subscription, metadata } = data;
  const workspaceId = metadata?.workspaceId;
  
  if (!workspaceId) {
    console.error("No workspace ID in checkout session metadata");
    return;
  }

  // Update workspace subscription
  await ctx.db.patch(workspaceId, {
    subscription: {
      plan: metadata.plan,
      status: "active",
      seats: parseInt(metadata.seats),
      stripeCustomerId: customer,
      stripeSubscriptionId: subscription,
      currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    updatedAt: Date.now(),
  });
}

async function handleSubscriptionUpdated(ctx: any, data: any) {
  const { id, status, metadata } = data;
  const workspaceId = metadata?.workspaceId;
  
  if (!workspaceId) {
    console.error("No workspace ID in subscription metadata");
    return;
  }

  // Update subscription status
  await ctx.db.patch(workspaceId, {
    subscription: {
      status: status === "active" ? "active" : "canceled",
      stripeSubscriptionId: id,
    },
    updatedAt: Date.now(),
  });
}

async function handleSubscriptionDeleted(ctx: any, data: any) {
  const { metadata } = data;
  const workspaceId = metadata?.workspaceId;
  
  if (!workspaceId) {
    console.error("No workspace ID in subscription metadata");
    return;
  }

  // Mark subscription as canceled
  await ctx.db.patch(workspaceId, {
    subscription: {
      status: "canceled",
    },
    updatedAt: Date.now(),
  });
}

async function handlePaymentSucceeded(ctx: any, data: any) {
  const { subscription, metadata } = data;
  const workspaceId = metadata?.workspaceId;
  
  if (!workspaceId) {
    console.error("No workspace ID in payment metadata");
    return;
  }

  // Update subscription status to active
  await ctx.db.patch(workspaceId, {
    subscription: {
      status: "active",
      stripeSubscriptionId: subscription,
    },
    updatedAt: Date.now(),
  });
}

async function handlePaymentFailed(ctx: any, data: any) {
  const { subscription, metadata } = data;
  const workspaceId = metadata?.workspaceId;
  
  if (!workspaceId) {
    console.error("No workspace ID in payment metadata");
    return;
  }

  // Update subscription status to past_due
  await ctx.db.patch(workspaceId, {
    subscription: {
      status: "past_due",
      stripeSubscriptionId: subscription,
    },
    updatedAt: Date.now(),
  });
}
