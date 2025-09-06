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

      // Create invitation URL
      const invitationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/invite/accept?token=${token}`;

      // Send email via Resend
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        
        if (!resendApiKey) {
          console.log(`User invitation for ${email}: ${invitationUrl}`);
          return { success: true, message: "Invitation created (email not sent - no API key)" };
        }

        const resend = new Resend(resendApiKey);
        const workspaceName = workspace.name || "LoanFlow Pro";

        const { data, error } = await resend.emails.send({
          from: 'noreply@flow.loanflowpro.com',
          to: [email],
          subject: `You're invited to join ${workspaceName}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>You're invited to join ${workspaceName}</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%); padding: 32px 24px; text-align: center;">
                  <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; margin-bottom: 16px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="m22 21-3-3m0 0a5.5 5.5 0 1 0-7.8-7.8 5.5 5.5 0 0 0 7.8 7.8Z"></path>
                    </svg>
                  </div>
                  <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">You're Invited!</h1>
                  <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Join ${workspaceName} on LoanFlow Pro</p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 24px;">
                  <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px; font-weight: 600; text-align: center;">Welcome to ${workspaceName}</h2>
                  <p style="color: #6b7280; margin-bottom: 20px; text-align: center;">
                    You've been invited to join ${workspaceName} as a ${role}. 
                    ${invitationType === 'client' ? 'Access your loan files, documents, and communicate with your advisor.' : 
                      invitationType === 'staff' ? 'Help manage clients and loan workflows.' : 
                      'Collaborate on loan processing and client management.'}
                  </p>
                  
                  ${message ? `
                    <div style="background: #f8f9fa; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #333; font-style: italic;">"${message}"</p>
                    </div>
                  ` : ''}
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${invitationUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
                  </div>
                  
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">What you can do:</h3>
                    <ul style="color: #666; margin: 0; padding-left: 20px;">
                      ${invitationType === 'client' ? `
                        <li>View your loan files and progress</li>
                        <li>Access important documents</li>
                        <li>Communicate with your advisor</li>
                        <li>Track application status</li>
                      ` : invitationType === 'staff' ? `
                        <li>Manage client information</li>
                        <li>Process loan applications</li>
                        <li>Upload and organize documents</li>
                        <li>Track workflow progress</li>
                      ` : `
                        <li>Collaborate on loan processing</li>
                        <li>Access shared resources</li>
                        <li>Communicate with the team</li>
                        <li>Review loan applications</li>
                      `}
                    </ul>
                  </div>
                  
                  <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
                  <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't expect this invitation, you can safely ignore this email.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        if (error) {
          console.error("Error sending invitation email:", error);
          // Fallback to console log for development
          console.log(`User invitation for ${email}: ${invitationUrl}`);
        } else {
          console.log(`Invitation email sent successfully to ${email}:`, data);
        }
      } catch (error) {
        console.error("Error sending invitation email:", error);
        // Fallback to console log for development
        console.log(`User invitation for ${email}: ${invitationUrl}`);
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
        return { success: false, error: "Invalid invitation token" };
      }

      // Check if expired
      if (invitation.expiresAt < Date.now()) {
        await ctx.db.patch(invitation._id, {
          status: "expired",
          updatedAt: Date.now(),
        });
        return { success: false, error: "Invitation has expired" };
      }

      // Check if already accepted
      if (invitation.status === "accepted") {
        return { success: false, error: "Invitation has already been accepted" };
      }

      // Get workspace
      const workspace = await ctx.db.get(invitation.workspaceId);
      if (!workspace) {
        return { success: false, error: "Workspace not found" };
      }

      // Check if user already exists
      let user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), invitation.email))
        .first();

      if (user) {
        // User exists, check if they're already in this workspace
        if (user.workspaceId === invitation.workspaceId) {
          return { success: false, error: "You are already a member of this workspace" };
        }
        
        // Update user to new workspace
        await ctx.db.patch(user._id, {
          workspaceId: invitation.workspaceId,
          role: invitation.role,
          status: "active",
          updatedAt: Date.now(),
        });
      } else {
        // Create new user
        user = await ctx.db.insert("users", {
          email: invitation.email,
          role: invitation.role,
          workspaceId: invitation.workspaceId,
          status: "active",
          permissions: invitation.permissions || [],
          profile: {
            firstName: invitation.email.split('@')[0],
            lastName: "",
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      // Update invitation status
      await ctx.db.patch(invitation._id, {
        status: "accepted",
        acceptedAt: Date.now(),
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
          invitationType: invitation.invitationType,
          role: invitation.role,
        },
        createdAt: Date.now(),
      });

      return { 
        success: true, 
        message: "Invitation accepted successfully",
        invitation: {
          email: invitation.email,
          role: invitation.role,
          workspaceName: workspace.name,
          message: invitation.message,
        }
      };
    } catch (error) {
      console.error("Error accepting user invitation:", error);
      return { success: false, error: "An error occurred while accepting the invitation" };
    }
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

    // Check if invitation is still pending
    if (invitation.status !== "pending") {
      throw new Error("Can only resend pending invitations");
    }

    // Get workspace details
    const workspace = await ctx.db.get(invitation.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Create invitation URL
    const invitationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/invite/accept?token=${invitation.token}`;

    // Send email via Resend
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      
      if (!resendApiKey) {
        console.log(`Resending invitation for ${invitation.email}: ${invitationUrl}`);
        return { success: true, message: "Invitation resent (email not sent - no API key)" };
      }

      const resend = new Resend(resendApiKey);
      const workspaceName = workspace.name || "LoanFlow Pro";

      const { data, error } = await resend.emails.send({
        from: 'noreply@flow.loanflowpro.com',
        to: [invitation.email],
        subject: `Reminder: You're invited to join ${workspaceName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reminder: You're invited to join ${workspaceName}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%); padding: 32px 24px; text-align: center;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; margin-bottom: 16px;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="m22 21-3-3m0 0a5.5 5.5 0 1 0-7.8-7.8 5.5 5.5 0 0 0 7.8 7.8Z"></path>
                  </svg>
                </div>
                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">Reminder: You're Invited!</h1>
                <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Join ${workspaceName} on LoanFlow Pro</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 24px;">
                <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px; font-weight: 600; text-align: center;">Don't miss out!</h2>
                <p style="color: #6b7280; margin-bottom: 20px; text-align: center;">
                  This is a friendly reminder that you've been invited to join ${workspaceName} as a ${invitation.role}. 
                  ${invitation.invitationType === 'client' ? 'Access your loan files, documents, and communicate with your advisor.' : 
                    invitation.invitationType === 'staff' ? 'Help manage clients and loan workflows.' : 
                    'Collaborate on loan processing and client management.'}
                </p>
                
                ${invitation.message ? `
                  <div style="background: #f8f9fa; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #333; font-style: italic;">"${invitation.message}"</p>
                  </div>
                ` : ''}
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${invitationUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
                </div>
                
                <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't expect this invitation, you can safely ignore this email.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      if (error) {
        console.error("Error resending invitation email:", error);
        // Fallback to console log for development
        console.log(`Resending invitation for ${invitation.email}: ${invitationUrl}`);
      } else {
        console.log(`Invitation email resent successfully to ${invitation.email}:`, data);
      }
    } catch (error) {
      console.error("Error resending invitation email:", error);
      // Fallback to console log for development
      console.log(`Resending invitation for ${invitation.email}: ${invitationUrl}`);
    }

    return { success: true, message: "Invitation resent" };
  },
});

// Get role-specific email content
function getEmailContentForRole(role: string, workspaceName: string, message?: string, invitationUrl?: string) {
  const baseUrl = invitationUrl || "http://localhost:3000/invite/accept";
  
  switch (role) {
    case "client":
      return {
        subject: `You're invited to join ${workspaceName} - Client Portal`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #D4AF37;">Welcome to ${workspaceName}</h2>
            <p>You've been invited to access your loan portal where you can:</p>
            <ul>
              <li>View your loan files and progress</li>
              <li>Access important documents</li>
              <li>Communicate with your advisor</li>
              <li>Track application status</li>
            </ul>
            ${message ? `<p style="font-style: italic;">"${message}"</p>` : ''}
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
            </div>
            <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
          </div>
        `,
      };
    case "staff":
      return {
        subject: `You're invited to join ${workspaceName} - Staff Portal`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #D4AF37;">Welcome to ${workspaceName}</h2>
            <p>You've been invited to join our team where you can:</p>
            <ul>
              <li>Manage client information</li>
              <li>Process loan applications</li>
              <li>Upload and organize documents</li>
              <li>Track workflow progress</li>
            </ul>
            ${message ? `<p style="font-style: italic;">"${message}"</p>` : ''}
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
            </div>
            <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
          </div>
        `,
      };
    case "partner":
      return {
        subject: `You're invited to join ${workspaceName} - Partner Portal`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #D4AF37;">Welcome to ${workspaceName}</h2>
            <p>You've been invited to collaborate with us where you can:</p>
            <ul>
              <li>Collaborate on loan processing</li>
              <li>Access shared resources</li>
              <li>Communicate with the team</li>
              <li>Review loan applications</li>
            </ul>
            ${message ? `<p style="font-style: italic;">"${message}"</p>` : ''}
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
            </div>
            <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
          </div>
        `,
      };
    default:
      return {
        subject: `You're invited to join ${workspaceName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #D4AF37;">Welcome to ${workspaceName}</h2>
            <p>You've been invited to join our platform.</p>
            ${message ? `<p style="font-style: italic;">"${message}"</p>` : ''}
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
            </div>
            <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
          </div>
        `,
      };
  }
}
