import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { Resend } from "resend";
import { RBACEngine } from "../src/lib/rbac";

// Send client invitation
export const sendClientInvitation = mutation({
  args: {
    email: v.string(),
    workspaceId: v.id("workspaces"),
    invitedBy: v.id("users"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, { email, workspaceId, invitedBy, message }) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      // Check if user has permission to invite clients
      const inviter = await ctx.db.get(invitedBy);
      if (!inviter || !RBACEngine.canInviteUsers(inviter)) {
        throw new Error("You don't have permission to invite clients");
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
        .query("clientInvitations")
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
      const invitationId = await ctx.db.insert("clientInvitations", {
        email,
        workspaceId,
        invitedBy,
        token,
        status: "pending",
        expiresAt,
        message,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Get workspace and inviter details
      const workspace = await ctx.db.get(workspaceId);
      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // Send invitation email
      const invitationUrl = `${process.env.FRONTEND_URL || "https://loanflowpro.com"}/invite/accept?token=${token}`;
      
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          console.log(`Client invitation for ${email}: ${invitationUrl}`);
          return { success: true, message: "Invitation sent to client" };
        }

        const resend = new Resend(resendApiKey);
        
        await resend.emails.send({
          from: "LoanFlow Pro <noreply@flow.loanflowpro.com>",
          to: [email],
          subject: `You're invited to ${workspace.name} - LoanFlow Pro`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">LoanFlow Pro</h1>
              </div>
              <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-bottom: 20px;">You're invited to join ${workspace.name}</h2>
                <p style="color: #666; margin-bottom: 20px;">
                  You've been invited to access the client portal for <strong>${workspace.name}</strong> on LoanFlow Pro.
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
                  <a href="${invitationUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
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
        });
      } catch (error) {
        console.error("Error sending invitation email:", error);
        // Fallback to console log for development
        console.log(`Client invitation for ${email}: ${invitationUrl}`);
      }

      // Log the action
      await ctx.db.insert("auditLogs", {
        action: "client_invitation_sent",
        resourceType: "clientInvitation",
        resourceId: invitationId,
        userId: invitedBy,
        workspaceId,
        details: { 
          email,
          message,
        },
        createdAt: Date.now(),
      });

      return { success: true, message: "Invitation sent to client" };
    } catch (error) {
      console.error("Error sending client invitation:", error);
      throw error;
    }
  },
});

// Accept client invitation
export const acceptClientInvitation = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    try {
      // Find invitation
      const invitation = await ctx.db
        .query("clientInvitations")
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
          role: "client",
          status: "active",
          updatedAt: Date.now(),
        });
      } else {
        // Create new user
        const userId = await ctx.db.insert("users", {
          email: invitation.email,
          role: "client",
          workspaceId: invitation.workspaceId,
          status: "active",
          profile: {
            firstName: "",
            lastName: "",
          },
          notificationSettings: {
            email: true,
            inApp: true,
            types: {
              taskAssigned: true,
              taskCompleted: true,
              taskOverdue: true,
              clientAdded: true,
              clientUpdated: true,
              loanFileStatusChange: true,
              documentUploaded: true,
              messageReceived: true,
              invitationReceived: true,
              systemAlert: true,
            },
            frequency: "immediate",
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        user = await ctx.db.get(userId);
      }

      if (!user) {
        throw new Error("Failed to create user");
      }

      // Create client record
      const clientId = await ctx.db.insert("clients", {
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

      // Update invitation status
      await ctx.db.patch(invitation._id, {
        status: "accepted",
        acceptedAt: Date.now(),
        clientId: clientId,
        updatedAt: Date.now(),
      });

      // Log the action
      await ctx.db.insert("auditLogs", {
        action: "client_invitation_accepted",
        resourceType: "clientInvitation",
        resourceId: invitation._id,
        userId: user._id,
        workspaceId: invitation.workspaceId,
        details: { 
          email: invitation.email,
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
        redirectRoute: "/portal",
      };
    } catch (error) {
      console.error("Error accepting client invitation:", error);
      throw error;
    }
  },
});

// Get pending invitations for workspace
export const getPendingInvitations = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("clientInvitations")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});

// Cancel invitation
export const cancelInvitation = mutation({
  args: { invitationId: v.id("clientInvitations") },
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
      action: "client_invitation_cancelled",
      resourceType: "clientInvitation",
      resourceId: invitationId,
      userId: invitation.invitedBy,
      workspaceId: invitation.workspaceId,
      details: { 
        email: invitation.email,
      },
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Resend invitation
export const resendInvitation = mutation({
  args: { invitationId: v.id("clientInvitations") },
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

    // Get workspace details
    const workspace = await ctx.db.get(invitation.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Send invitation email again
    const invitationUrl = `${process.env.NEXTAUTH_URL}/invite/accept?token=${invitation.token}`;
    
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        console.log(`Resending client invitation for ${invitation.email}: ${invitationUrl}`);
        return { success: true, message: "Invitation resent" };
      }

      const resend = new Resend(resendApiKey);
      
      await resend.emails.send({
        from: "LoanFlow Pro <noreply@flow.loanflowpro.com>",
        to: [invitation.email],
        subject: `Reminder: You're invited to ${workspace.name} - LoanFlow Pro`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">LoanFlow Pro</h1>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Reminder: You're invited to join ${workspace.name}</h2>
              <p style="color: #666; margin-bottom: 20px;">
                This is a reminder that you've been invited to access the client portal for <strong>${workspace.name}</strong> on LoanFlow Pro.
              </p>
              ${invitation.message ? `
                <div style="background: #f8f9fa; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #333; font-style: italic;">"${invitation.message}"</p>
                </div>
              ` : ''}
              <p style="color: #666; margin-bottom: 30px;">
                Click the button below to accept your invitation and access your loan files, documents, and messages.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
              </div>
              <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error("Error resending invitation email:", error);
      throw new Error("Failed to resend invitation");
    }

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "client_invitation_resent",
      resourceType: "clientInvitation",
      resourceId: invitationId,
      userId: invitation.invitedBy,
      workspaceId: invitation.workspaceId,
      details: { 
        email: invitation.email,
      },
      createdAt: Date.now(),
    });

    return { success: true, message: "Invitation resent" };
  },
});
