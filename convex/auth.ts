import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { Resend } from "resend";
import { auth } from "./auth.config";
import { RBACEngine, type User, type WorkspaceSettings } from "../src/lib/rbac";

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
        status: "trial",
        subscription: {
          plan: "solo",
          status: "active",
          seats: 1,
        },
        settings: {
          timezone: "America/New_York",
          dateFormat: "MM/DD/YYYY",
          timeFormat: "12h",
          branding: {
            primaryColor: "#D4AF37",
            companyName: workspaceName,
          },
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Create user
      user = await ctx.db.insert("users", {
        email,
        role: "advisor",
        workspaceId,
        lastActive: Date.now(),
        isActive: true,
        profile: {
          firstName,
          lastName,
        },
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
    } else {
      workspaceId = user.workspaceId;
      // Update last active
      await ctx.db.patch(user._id, {
        lastActive: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Create session token (in a real app, you'd use JWT or similar)
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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

// Get user by ID
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
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

// Send magic link
export const sendMagicLink = mutation({
  args: { 
    email: v.string(), 
    workspaceSlug: v.optional(v.string()) 
  },
  handler: async (ctx, { email, workspaceSlug }) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      // Check if user exists
      let user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), email))
        .first();

      let workspaceId: Id<"workspaces"> | undefined;

      if (user) {
        workspaceId = user.workspaceId;
      } else if (workspaceSlug) {
        // Find workspace by slug
        const workspace = await ctx.db
          .query("workspaces")
          .filter((q) => q.eq(q.field("slug"), workspaceSlug))
          .first();
        
        if (workspace) {
          workspaceId = workspace._id;
        }
      }

      // Generate magic link token
      const token = `ml_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

      // Store magic link
      await ctx.db.insert("magicLinks", {
        email,
        token,
        workspaceId,
        expiresAt,
        createdAt: Date.now(),
      });

      // Send magic link email
      const magicLinkUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
      
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          console.log(`Magic link for ${email}: ${magicLinkUrl}`);
          return { success: true, message: "Magic link sent to your email" };
        }

        const resend = new Resend(resendApiKey);
        
        await resend.emails.send({
          from: "LoanFlow Pro <noreply@flow.loanflowpro.com>",
          to: [email],
          subject: "Your secure login link - LoanFlow Pro",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">LoanFlow Pro</h1>
              </div>
              <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-bottom: 20px;">Sign in to your account</h2>
                <p style="color: #666; margin-bottom: 30px;">Click the button below to securely sign in to your LoanFlow Pro account:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${magicLinkUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Sign In Securely</a>
                </div>
                <p style="color: #666; font-size: 14px;">This link expires in 15 minutes.</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this link, you can safely ignore this email.</p>
              </div>
            </div>
          `,
        });
      } catch (error) {
        console.error("Error sending magic link email:", error);
        // Fallback to console log for development
        console.log(`Magic link for ${email}: ${magicLinkUrl}`);
      }

      return { success: true, message: "Magic link sent to your email" };
    } catch (error) {
      console.error("Error sending magic link:", error);
      throw new Error("Failed to send magic link");
    }
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
        if (!workspaceId) {
          throw new Error("Workspace required for new users");
        }

        // Create user with pending status
        const userId = await ctx.db.insert("users", {
          email: magicLink.email,
          role: "client", // Default role, can be changed by admin
          workspaceId,
          status: "pending",
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
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          workspaceId: user.workspaceId,
          status: user.status,
          profile: user.profile,
        },
        workspace: {
          id: workspace._id,
          name: workspace.name,
          slug: workspace.slug,
          status: workspace.status,
        },
        redirectRoute,
        isNewUser: !magicLink.workspaceId, // If no workspace was specified, it's a new user
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
