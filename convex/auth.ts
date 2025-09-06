import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { Resend } from "resend";
import { api } from "./_generated/api";
import { RBACEngine, type User, type WorkspaceSettings } from "../src/lib/rbac";

// Store magic link token
export const storeMagicLink = mutation({
  args: {
    email: v.string(),
    token: v.string(),
    workspaceSlug: v.optional(v.string()),
    workspaceId: v.optional(v.id("workspaces")),
    expiresAt: v.number(),
  },
  handler: async (ctx, { email, token, workspaceSlug, workspaceId, expiresAt }) => {
    await ctx.db.insert("magicLinks", {
      email,
      token,
      workspaceSlug,
      workspaceId,
      expiresAt,
      used: false,
      createdAt: Date.now(),
    });
  },
});

// Get workspace by slug
export const getWorkspaceBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("slug"), slug))
      .first();
  },
});

// Send magic link via Resend
export const sendMagicLink = action({
  args: { 
    email: v.string(),
    workspaceSlug: v.optional(v.string())
  },
  handler: async (ctx, { email, workspaceSlug }) => {
    console.log(`sendMagicLink called with email: ${email}, workspaceSlug: ${workspaceSlug}`);
    const resendApiKey = process.env.RESEND_API_KEY;
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    
    if (!resendApiKey) {
      console.log(`Magic link for ${email}: ${baseUrl}/auth/verify?token=mock-token (Resend API key not configured)`);
      return { success: true, message: "Magic link sent to your email" };
    }

    const resend = new Resend(resendApiKey);
    
    // Generate secure token
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    
    // Determine workspace name and create if needed
    let workspaceName = "LoanFlow Pro";
    let workspaceId: Id<"workspaces"> | undefined = undefined;
    if (workspaceSlug) {
      console.log(`Looking up workspace with slug: ${workspaceSlug}`);
      const workspace = await ctx.runQuery(api.auth.getWorkspaceBySlug, { slug: workspaceSlug });
      console.log(`Workspace lookup result:`, workspace);
      
      if (workspace) {
        workspaceName = workspace.name;
        workspaceId = workspace._id;
        console.log(`Found existing workspace: ${workspaceName} (${workspaceId})`);
      } else {
        console.log(`Workspace not found, creating new workspace: ${workspaceSlug}`);
        // Create workspace if it doesn't exist
        const result = await ctx.runMutation(api.auth.createWorkspaceAndUser, {
          email,
          workspaceName: workspaceSlug,
          name: email.split('@')[0], // Use email prefix as name
        });
        workspaceId = result.workspaceId;
        workspaceName = workspaceSlug;
        console.log(`Created new workspace: ${workspaceName} (${workspaceId})`);
      }
    }

    // Store magic link in database
    await ctx.runMutation(api.auth.storeMagicLink, {
      email,
      token,
      workspaceSlug,
      workspaceId,
      expiresAt,
    });

    // Create magic link URL
    const magicLink = `${baseUrl}/auth/verify?token=${token}`;
    console.log(`Generated magic link for ${email}: ${magicLink}`);

    // Send email via Resend
    try {
      const { data, error } = await resend.emails.send({
        from: 'noreply@flow.loanflowpro.com',
        to: [email],
        subject: `Sign in to ${workspaceName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sign in to ${workspaceName}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%); padding: 32px 24px; text-align: center;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; margin-bottom: 16px;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">${workspaceName}</h1>
                <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Secure loan workflow management</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 24px;">
                <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px; font-weight: 600; text-align: center;">Sign in to your account</h2>
                <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.5; text-align: center;">
                  Click the button below to securely sign in to your account. This link will expire in 15 minutes.
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${magicLink}" 
                     style="display: inline-flex; align-items: center; justify-content: center; padding: 12px 24px; background-color: #D4AF37; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    </svg>
                    Sign In Securely
                  </a>
                </div>

                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
                  <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 600;">Security Notice:</p>
                  <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 1.5;">
                    <li>This link expires in 15 minutes</li>
                    <li>Only use this link once</li>
                    <li>If you didn't request this, you can safely ignore this email</li>
                  </ul>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                  This email was sent to <strong>${email}</strong>
                </p>
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  © 2024 ${workspaceName}. All rights reserved.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      if (error) {
        console.error('Error sending magic link email:', error);
        throw new Error('Failed to send magic link email');
      }

      console.log(`Magic link email sent successfully to ${email}:`, data);
      return { success: true, message: "Magic link sent to your email" };
    } catch (error) {
      console.error('Error in sendMagicLink:', error);
      throw new Error('Failed to send magic link');
    }
  },
});

// Generate and send OTP
export const generateOTP = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP in database
    await ctx.db.insert("otpTokens", {
      email,
      token: otp,
      expiresAt,
      used: false,
      createdAt: Date.now(),
    });

    // Send email via Resend
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        console.log(`OTP for ${email}: ${otp} (Resend API key not configured)`);
        return { success: true, message: "OTP sent to your email" };
      }

      const resend = new Resend(resendApiKey);
      
      await resend.emails.send({
        from: "LoanFlow Pro <noreply@flow.loanflowpro.com>",
        to: [email],
        subject: "Your Login Code - LoanFlow Pro",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">LoanFlow Pro</h1>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Your Login Code</h2>
              <p style="color: #666; margin-bottom: 30px;">Use this code to sign in to your LoanFlow Pro account:</p>
              <div style="background: #f8f9fa; border: 2px dashed #D4AF37; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #D4AF37; letter-spacing: 4px;">${otp}</span>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error("Error sending OTP email:", error);
      // Fallback to console log for development
      console.log(`OTP for ${email}: ${otp}`);
    }
    
    return { success: true, message: "OTP sent to your email" };
  },
});

// Verify OTP and create/update user session
export const verifyOTP = mutation({
  args: { 
    email: v.string(), 
    otp: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    workspaceName: v.optional(v.string()),
  },
  handler: async (ctx, { email, otp, firstName, lastName, workspaceName }) => {
    // Find valid OTP
    const otpRecord = await ctx.db
      .query("otpTokens")
      .filter((q) => q.eq(q.field("email"), email))
      .filter((q) => q.eq(q.field("token"), otp))
      .filter((q) => q.eq(q.field("used"), false))
      .filter((q) => q.gt(q.field("expiresAt"), Date.now()))
      .first();

    if (!otpRecord) {
      throw new Error("Invalid or expired OTP");
    }

    // Mark OTP as used
    await ctx.db.patch(otpRecord._id, { used: true });

    // Check if user exists
    let user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .first();

    let workspaceId: Id<"workspaces">;

    if (!user) {
      // Create new user and workspace
      if (!firstName || !lastName || !workspaceName) {
        throw new Error("First name, last name, and workspace name are required for new users");
      }

      // Create workspace
      workspaceId = await ctx.db.insert("workspaces", {
        name: workspaceName,
        slug: workspaceName.toLowerCase().replace(/\s+/g, '-'),
        status: "trial",
        subscriptionTier: "solo",
        subscription: {
          plan: "solo",
          status: "active",
          seats: 1,
        },
        settings: {
          allowClientRegistration: true,
          requireApproval: false,
          timezone: "America/New_York",
          dateFormat: "MM/DD/YYYY",
          timeFormat: "12h",
          customBranding: {
            primaryColor: "#D4AF37",
            companyName: workspaceName,
          },
          branding: {
            primaryColor: "#D4AF37",
            companyName: workspaceName,
          },
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Create user
      const userId = await ctx.db.insert("users", {
        email,
        role: "advisor",
        workspaceId,
        lastActiveAt: Date.now(),
        status: "active",
        profile: {
          firstName,
          lastName,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Get the created user
      user = await ctx.db.get(userId);

      // Create subscription record
      await ctx.db.insert("subscriptions", {
        workspaceId,
        plan: "solo",
        status: "active",
        seats: 1,
        usage: {
          activeClients: 0,
          storageUsed: 0,
          documentsProcessed: 0,
        },
        stripeData: {
          customerId: "",
          subscriptionId: "",
          priceId: "",
          currentPeriodEnd: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days trial
        },
        trialEndsAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      workspaceId = user.workspaceId;
      // Update last active
      await ctx.db.patch(user._id, {
        lastActiveAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Create session token (in a real app, you'd use JWT or similar)
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (!user) {
      throw new Error("Failed to create or retrieve user");
    }

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        workspaceId,
        profile: user.profile,
      },
      sessionToken,
    };
  },
});

// Get current user
export const getCurrentUser = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    // In a real implementation, you'd verify the session token
    // For now, we'll return null and handle auth in middleware
    return null;
  },
});

// Get workspace by ID
export const getWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db.get(workspaceId);
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    profile: v.object({
      firstName: v.string(),
      lastName: v.string(),
      phone: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { userId, profile }) => {
    await ctx.db.patch(userId, {
      profile,
      updatedAt: Date.now(),
    });
  },
});

// Verify magic link
export const verifyMagicLink = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    try {
      // Find magic link
      const magicLink = await ctx.db
        .query("magicLinks")
        .filter((q) => q.eq(q.field("token"), token))
        .first();

      if (!magicLink) {
        throw new Error("Invalid magic link");
      }

      // Check if expired
      if (magicLink.expiresAt < Date.now()) {
        throw new Error("Magic link has expired");
      }

      // Check if already used
      if (magicLink.usedAt) {
        throw new Error("Magic link has already been used");
      }

      // Mark as used
      await ctx.db.patch(magicLink._id, {
        usedAt: Date.now(),
      });

      // Find or create user
      let user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), magicLink.email))
        .first();

      let workspaceId = magicLink.workspaceId;

      if (!user) {
        // This is a new user - they need to complete registration
        if (!workspaceId && magicLink.workspaceSlug) {
          // Look up workspace by slug
          const workspace = await ctx.db
            .query("workspaces")
            .filter((q) => q.eq(q.field("slug"), magicLink.workspaceSlug))
            .first();
          
          if (workspace) {
            workspaceId = workspace._id;
          }
        }
        
        if (!workspaceId) {
          throw new Error("Workspace required for new users");
        }

        // Create user with pending status
        const userId = await ctx.db.insert("users", {
          email: magicLink.email,
          role: "advisor", // Default role for loan workflow management
          workspaceId,
          status: "active",
          profile: {
            firstName: "",
            lastName: "",
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        user = await ctx.db.get(userId);
      } else {
        // Update last active
        await ctx.db.patch(user._id, {
          lastActiveAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      if (!user) {
        throw new Error("Failed to create or retrieve user");
      }

      // Get workspace
      const workspace = await ctx.db.get(user.workspaceId);
      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // Determine redirect route based on user role and status
      const redirectRoute = RBACEngine.getDefaultRouteForUser(user, workspace);

      return {
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          workspaceId: user.workspaceId,
          status: user.status,
          profile: user.profile,
        },
        workspace: {
          _id: workspace._id,
          name: workspace.name,
          slug: workspace.slug,
          status: workspace.status,
        },
        redirectRoute,
        isNewUser: !user || user.status === "pending", // Check if user was just created or is pending
      };
    } catch (error) {
      console.error("Error verifying magic link:", error);
      throw error;
    }
  },
});

// Create workspace and user
export const createWorkspaceAndUser = mutation({
  args: { 
    email: v.string(), 
    workspaceName: v.string(), 
    name: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, { email, workspaceName, name, firstName, lastName }) => {
    try {
      // Generate workspace slug
      const slug = workspaceName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check if slug is unique
      const existingWorkspace = await ctx.db
        .query("workspaces")
        .filter((q) => q.eq(q.field("slug"), slug))
        .first();

      if (existingWorkspace) {
        throw new Error("Workspace name is already taken");
      }

      // Create workspace
      const workspaceId = await ctx.db.insert("workspaces", {
        name: workspaceName,
        slug,
        status: "trial",
        subscriptionTier: "solo",
        subscription: {
          plan: "solo",
          status: "active",
          seats: 1,
        },
        settings: {
          timezone: "America/New_York",
          dateFormat: "MM/DD/YYYY",
          timeFormat: "12h",
          allowClientRegistration: true,
          requireApproval: false,
          branding: {
            primaryColor: "#D4AF37",
            companyName: workspaceName,
          },
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Create user as advisor
      const userId = await ctx.db.insert("users", {
        email,
        name: name || `${firstName || ''} ${lastName || ''}`.trim(),
        role: "advisor",
        workspaceId,
        status: "active",
        profile: {
          firstName: firstName || "",
          lastName: lastName || "",
        },
        lastActiveAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Create subscription record
      await ctx.db.insert("subscriptions", {
        workspaceId,
        plan: "solo",
        status: "active",
        seats: 1,
        usage: {
          activeClients: 0,
          storageUsed: 0,
          documentsProcessed: 0,
        },
        stripeData: {
          customerId: "",
          subscriptionId: "",
          priceId: "",
          currentPeriodEnd: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days trial
        },
        trialEndsAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Create default loan types
      // Note: This would need to be implemented in loanTypes.ts
      // await ctx.runMutation(api.loanTypes.createDefaultLoanTypes, {
      //   workspaceId,
      // });

      return {
        success: true,
        workspaceId,
        userId,
        slug,
      };
    } catch (error) {
      console.error("Error creating workspace and user:", error);
      throw error;
    }
  },
});

// Get user permissions
export const getUserPermissions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      return [];
    }

    const workspace = await ctx.db.get(user.workspaceId);
    const workspaceSettings: WorkspaceSettings | undefined = workspace?.settings;

    return RBACEngine.getPermissionsForUser(user, workspaceSettings);
  },
});

// Check if user can access workspace
export const canUserAccessWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) {
      return false;
    }

    return RBACEngine.canAccessWorkspace(user, workspaceId);
  },
});

// Update workspace settings
export const updateWorkspace = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    updates: v.object({
      name: v.optional(v.string()),
      slug: v.optional(v.string()),
      settings: v.optional(v.object({
        timezone: v.optional(v.string()),
        dateFormat: v.optional(v.string()),
        timeFormat: v.optional(v.union(v.literal("12h"), v.literal("24h"))),
        allowClientRegistration: v.optional(v.boolean()),
        requireApproval: v.optional(v.boolean()),
        branding: v.optional(v.object({
          companyName: v.optional(v.string()),
          primaryColor: v.optional(v.string()),
          logoUrl: v.optional(v.string()),
        })),
      })),
    }),
  },
  handler: async (ctx, { workspaceId, updates }) => {
    const workspace = await ctx.db.get(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.name) updateData.name = updates.name;
    if (updates.slug) updateData.slug = updates.slug;
    if (updates.settings) {
      updateData.settings = {
        ...workspace.settings,
        ...updates.settings,
        branding: {
          ...workspace.settings.branding,
          ...updates.settings.branding,
        },
      };
    }

    await ctx.db.patch(workspaceId, updateData);

    return { success: true };
  },
});

// Get workspace users
export const getWorkspaceUsers = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();
  },
});

// Get user by ID
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// Get workspace seat usage
export const getWorkspaceSeatUsage = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const workspace = await ctx.db.get(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    const activeUsers = users.filter(user => user.status === "active");
    
    return {
      total: workspace.subscription.seats,
      used: activeUsers.length,
      available: workspace.subscription.seats - activeUsers.length,
      users: activeUsers,
    };
  },
});
