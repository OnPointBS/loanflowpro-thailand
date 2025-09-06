import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { Resend } from "resend";
import { RBACEngine } from "../src/lib/rbac";
import { api } from "./_generated/api";

// Send user invitation (clients, staff, partners)
export const sendUserInvitation = mutation({
  args: {
    email: v.string(),
    workspaceId: v.id("workspaces"),
    invitedBy: v.id("users"),
    invitationType: v.union(v.literal("client"), v.literal("staff"), v.literal("partner")),
    role: v.union(v.literal("client"), v.literal("staff"), v.literal("partner")),
    message: v.optional(v.string()),
    permissions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { email, workspaceId, invitedBy, invitationType, role, message, permissions }) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      // Check if user has permission to invite users
      const inviter = await ctx.db.get(invitedBy);
      if (!inviter || !RBACEngine.canInviteUsers(inviter)) {
        throw new Error("You don't have permission to invite users");
      }

      // Check if user is already in the workspace
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), email))
        .first();

      if (existingUser && existingUser.workspaceId === workspaceId) {
        throw new Error("User is already a member of this workspace");
      }

      // Check if there's already a pending invitation
      const existingInvitation = await ctx.db
        .query("userInvitations")
        .filter((q) => q.eq(q.field("email"), email))
        .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
        .filter((q) => q.eq(q.field("status"), "pending"))
        .first();

      if (existingInvitation) {
        throw new Error("An invitation has already been sent to this email");
      }

      // Generate invitation token
      const token = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

      // Create invitation record
      const invitationId = await ctx.db.insert("userInvitations", {
        email,
        workspaceId,
        invitedBy,
        token,
        invitationType,
        role,
        status: "pending",
        expiresAt,
        message,
        permissions,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Get workspace and inviter details
      const workspace = await ctx.db.get(workspaceId);
      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // Log the action
      await ctx.db.insert("auditLogs", {
        action: "user_invitation_sent",
        resourceType: "userInvitation",
        resourceId: invitationId,
        userId: invitedBy,
        workspaceId,
        details: { 
          email,
          invitationType,
          role,
          message,
        },
        createdAt: Date.now(),
      });

      return { success: true, message: `Invitation sent to ${invitationType}` };
    } catch (error) {
      console.error("Error sending user invitation:", error);
      throw error;
    }
  },
});

// Get invitation by ID
export const getInvitation = query({
  args: { invitationId: v.id("userInvitations") },
  handler: async (ctx, { invitationId }) => {
    return await ctx.db.get(invitationId);
  },
});

// Send invitation email
export const sendInvitationEmail = action({
  args: {
    invitationId: v.id("userInvitations"),
  },
  handler: async (ctx, { invitationId }) => {
    try {
      const invitation = await ctx.runQuery(api.userInvitations.getInvitation, { invitationId });
      if (!invitation) {
        throw new Error("Invitation not found");
      }

      const workspace = await ctx.runQuery(api.auth.getWorkspace, { workspaceId: invitation.workspaceId });
      if (!workspace) {
        throw new Error("Workspace not found");
      }

      const inviter = await ctx.runQuery(api.auth.getUser, { userId: invitation.invitedBy });
      if (!inviter) {
        throw new Error("Inviter not found");
      }

      // Send invitation email
      const invitationUrl = `${process.env.FRONTEND_URL}/invite/accept?token=${invitation.token}`;
      
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          console.log(`${invitation.invitationType} invitation for ${invitation.email}: ${invitationUrl}`);
          return { success: true, message: "Invitation sent" };
        }

        const resend = new Resend(resendApiKey);
        
        // Get role-specific email content
        const emailContent = getEmailContentForRole(invitation.invitationType, workspace.name, invitation.message, invitationUrl);
        
        await resend.emails.send({
          from: "LoanFlow Pro <noreply@flow.loanflowpro.com>",
          to: [invitation.email],
          subject: emailContent.subject,
          html: emailContent.html,
        });
      } catch (error) {
        console.error("Error sending invitation email:", error);
        // Fallback to console log for development
        console.log(`${invitation.invitationType} invitation for ${invitation.email}: ${invitationUrl}`);
      }

      return { success: true, message: "Invitation sent" };
    } catch (error) {
      console.error("Error sending invitation email:", error);
      throw error;
    }
  },
});

// Accept user invitation
export const acceptUserInvitation = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    try {
      // Find invitation
      const invitation = await ctx.db
        .query("userInvitations")
        .filter((q) => q.eq(q.field("token"), token))
        .first();

      if (!invitation) {
        throw new Error("Invalid invitation token");
      }

      // Check if expired
      if (invitation.expiresAt < Date.now()) {
        await ctx.db.patch(invitation._id, {
          status: "expired",
          updatedAt: Date.now(),
        });
        throw new Error("Invitation has expired");
      }

      // Check if already accepted
      if (invitation.status === "accepted") {
        throw new Error("Invitation has already been accepted");
      }

      // Get workspace
      const workspace = await ctx.db.get(invitation.workspaceId);
      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // Check if user already exists
      let user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), invitation.email))
        .first();

      if (user) {
        // User exists, check if they're already in this workspace
        if (user.workspaceId === invitation.workspaceId) {
          throw new Error("You are already a member of this workspace");
        }
        // Update user's workspace
        await ctx.db.patch(user._id, {
          workspaceId: invitation.workspaceId,
          role: invitation.role,
          status: "active",
          permissions: invitation.permissions,
          updatedAt: Date.now(),
        });
      } else {
        // Create new user
        const userId = await ctx.db.insert("users", {
          email: invitation.email,
          role: invitation.role,
          workspaceId: invitation.workspaceId,
          status: "active",
          permissions: invitation.permissions,
          profile: {
            firstName: "",
            lastName: "",
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        user = await ctx.db.get(userId);
      }

      if (!user) {
        throw new Error("Failed to create user");
      }

      // Create client record if it's a client invitation
      let clientId: Id<"clients"> | undefined;
      if (invitation.role === "client") {
        clientId = await ctx.db.insert("clients", {
          name: user.profile.firstName + " " + user.profile.lastName,
          email: user.email,
          status: "active",
          workspaceId: invitation.workspaceId,
          profile: {
            company: undefined,
            address: undefined,
            notes: undefined,
          },
          loanFiles: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      // Update invitation status
      await ctx.db.patch(invitation._id, {
        status: "accepted",
        acceptedAt: Date.now(),
        clientId: clientId,
        updatedAt: Date.now(),
      });

      // Log the action
      await ctx.db.insert("auditLogs", {
        action: "user_invitation_accepted",
        resourceType: "userInvitation",
        resourceId: invitation._id,
        userId: user._id,
        workspaceId: invitation.workspaceId,
        details: { 
          email: invitation.email,
          role: invitation.role,
        },
        createdAt: Date.now(),
      });

      return {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          workspaceId: user.workspaceId,
          status: user.status,
        },
        workspace: {
          id: workspace._id,
          name: workspace.name,
          slug: workspace.slug,
          status: workspace.status,
        },
        redirectRoute: RBACEngine.getDefaultRouteForUser(user, workspace),
      };
    } catch (error) {
      console.error("Error accepting user invitation:", error);
      throw error;
    }
  },
});

// Get pending invitations for workspace
export const getPendingInvitations = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("userInvitations")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});

// Get invitations by type
export const getInvitationsByType = query({
  args: { 
    workspaceId: v.id("workspaces"),
    invitationType: v.union(v.literal("client"), v.literal("staff"), v.literal("partner")),
  },
  handler: async (ctx, { workspaceId, invitationType }) => {
    return await ctx.db
      .query("userInvitations")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .filter((q) => q.eq(q.field("invitationType"), invitationType))
      .collect();
  },
});

// Cancel invitation
export const cancelInvitation = mutation({
  args: { invitationId: v.id("userInvitations") },
  handler: async (ctx, { invitationId }) => {
    const invitation = await ctx.db.get(invitationId);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.status !== "pending") {
      throw new Error("Can only cancel pending invitations");
    }

    await ctx.db.patch(invitationId, {
      status: "expired",
      updatedAt: Date.now(),
    });

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "user_invitation_cancelled",
      resourceType: "userInvitation",
      resourceId: invitationId,
      userId: invitation.invitedBy,
      workspaceId: invitation.workspaceId,
      details: { 
        email: invitation.email,
        invitationType: invitation.invitationType,
      },
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Resend invitation
export const resendInvitation = mutation({
  args: { invitationId: v.id("userInvitations") },
  handler: async (ctx, { invitationId }) => {
    const invitation = await ctx.db.get(invitationId);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.status !== "pending") {
      throw new Error("Can only resend pending invitations");
    }

    // Check if expired
    if (invitation.expiresAt < Date.now()) {
      await ctx.db.patch(invitationId, {
        status: "expired",
        updatedAt: Date.now(),
      });
      throw new Error("Invitation has expired");
    }

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "user_invitation_resent",
      resourceType: "userInvitation",
      resourceId: invitationId,
      userId: invitation.invitedBy,
      workspaceId: invitation.workspaceId,
      details: { 
        email: invitation.email,
        invitationType: invitation.invitationType,
      },
      createdAt: Date.now(),
    });

    return { success: true, message: "Invitation resent" };
  },
});

// Get role-specific email content
function getEmailContentForRole(role: string, workspaceName: string, message?: string, invitationUrl?: string) {
  const baseUrl = invitationUrl || "#";
  
  switch (role) {
    case "client":
      return {
        subject: `You're invited to ${workspaceName} - LoanFlow Pro`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">LoanFlow Pro</h1>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">You're invited to join ${workspaceName}</h2>
              <p style="color: #666; margin-bottom: 20px;">
                You've been invited to access the client portal for <strong>${workspaceName}</strong> on LoanFlow Pro.
              </p>
              ${message ? `
                <div style="background: #f8f9fa; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #333; font-style: italic;">"${message}"</p>
                </div>
              ` : ''}
              <p style="color: #666; margin-bottom: 30px;">
                Click the button below to accept your invitation and access your loan files, documents, and messages.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
              </div>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">What you can do in the client portal:</h3>
                <ul style="color: #666; margin: 0; padding-left: 20px;">
                  <li>View your loan files and progress</li>
                  <li>Access important documents</li>
                  <li>Communicate with your advisor</li>
                  <li>Track application status</li>
                </ul>
              </div>
              <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        `,
      };
    
    case "staff":
      return {
        subject: `You're invited to join ${workspaceName} as Staff - LoanFlow Pro`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">LoanFlow Pro</h1>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">You're invited to join ${workspaceName} as Staff</h2>
              <p style="color: #666; margin-bottom: 20px;">
                You've been invited to join <strong>${workspaceName}</strong> as a staff member on LoanFlow Pro.
              </p>
              ${message ? `
                <div style="background: #f8f9fa; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #333; font-style: italic;">"${message}"</p>
                </div>
              ` : ''}
              <p style="color: #666; margin-bottom: 30px;">
                Click the button below to accept your invitation and start managing loan workflows.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
              </div>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Staff permissions include:</h3>
                <ul style="color: #666; margin: 0; padding-left: 20px;">
                  <li>Manage clients and loan files</li>
                  <li>Upload and process documents</li>
                  <li>Create and assign tasks</li>
                  <li>Communicate with clients</li>
                  <li>Generate reports</li>
                </ul>
              </div>
              <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        `,
      };
    
    case "partner":
      return {
        subject: `You're invited to join ${workspaceName} as Partner - LoanFlow Pro`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">LoanFlow Pro</h1>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">You're invited to join ${workspaceName} as Partner</h2>
              <p style="color: #666; margin-bottom: 20px;">
                You've been invited to join <strong>${workspaceName}</strong> as a partner on LoanFlow Pro.
              </p>
              ${message ? `
                <div style="background: #f8f9fa; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #333; font-style: italic;">"${message}"</p>
                </div>
              ` : ''}
              <p style="color: #666; margin-bottom: 30px;">
                Click the button below to accept your invitation and start collaborating on loan workflows.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
              </div>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Partner permissions include:</h3>
                <ul style="color: #666; margin: 0; padding-left: 20px;">
                  <li>View and update client information</li>
                  <li>Access loan files and documents</li>
                  <li>Communicate with clients and staff</li>
                  <li>Generate reports and analytics</li>
                  <li>Collaborate on loan processing</li>
                </ul>
              </div>
              <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        `,
      };
    
    default:
      return {
        subject: `You're invited to join ${workspaceName} - LoanFlow Pro`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">LoanFlow Pro</h1>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">You're invited to join ${workspaceName}</h2>
              <p style="color: #666; margin-bottom: 20px;">
                You've been invited to join <strong>${workspaceName}</strong> on LoanFlow Pro.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
              </div>
              <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
            </div>
          </div>
        `,
      };
  }
}
