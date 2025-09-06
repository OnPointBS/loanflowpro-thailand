import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { Resend } from "resend";
import { api } from "./_generated/api";

const resend = new Resend(process.env.RESEND_API_KEY);

// Submit application from widget
export const submitApplication = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    source: v.string(),
    additionalData: v.object({
      loanAmount: v.optional(v.string()),
      propertyAddress: v.optional(v.string()),
      employmentStatus: v.optional(v.string()),
      annualIncome: v.optional(v.string()),
      creditScore: v.optional(v.string()),
      loanPurpose: v.optional(v.string()),
      downPayment: v.optional(v.string()),
      additionalNotes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // Create client record
    const clientId = await ctx.db.insert("clients", {
      name: `${args.firstName} ${args.lastName}`,
      email: args.email,
      phone: args.phone,
      status: "prospect",
      workspaceId: args.workspaceId,
      profile: {
        firstName: args.firstName,
        lastName: args.lastName,
        company: "",
        address: args.additionalData.propertyAddress || "",
        notes: args.additionalData.additionalNotes || "",
        applicationData: args.additionalData,
      },
      loanFiles: [],
      source: args.source,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Log the action
    await ctx.db.insert("auditLogs", {
      action: "application_submitted",
      resourceType: "client",
      resourceId: clientId,
      userId: undefined,
      workspaceId: args.workspaceId,
      details: { 
        clientName: `${args.firstName} ${args.lastName}`,
        source: args.source,
        email: args.email
      },
      createdAt: Date.now(),
    });

    return clientId;
  },
});

// Send thank you email after application submission
export const sendApplicationThankYouEmail = action({
  args: {
    clientId: v.id("clients"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { clientId, workspaceId }) => {
    // Get client and workspace data
    const client = await ctx.runQuery(api.clients.getClient, { clientId });
    const workspace = await ctx.runQuery(api.auth.getWorkspace, { workspaceId });
    
    if (!client || !workspace) {
      throw new Error("Client or workspace not found");
    }

    const workspaceName = workspace.name;
    const clientName = client.profile?.firstName || client.name.split(' ')[0];
    const clientEmail = client.email;

    // Create personalized email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Your Application</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #D4AF37;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #D4AF37;
            margin-bottom: 10px;
          }
          .workspace-name {
            font-size: 18px;
            color: #666;
            font-weight: 500;
          }
          .content {
            margin-bottom: 30px;
          }
          .greeting {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .message {
            font-size: 16px;
            color: #555;
            margin-bottom: 20px;
            line-height: 1.6;
          }
          .next-steps {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .next-steps h3 {
            color: #333;
            margin-top: 0;
            margin-bottom: 15px;
          }
          .next-steps ul {
            margin: 0;
            padding-left: 20px;
          }
          .next-steps li {
            margin-bottom: 8px;
            color: #555;
          }
          .contact-info {
            background: #D4AF37;
            color: white;
            padding: 20px;
            border-radius: 6px;
            text-align: center;
            margin-top: 30px;
          }
          .contact-info h3 {
            margin-top: 0;
            margin-bottom: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .powered-by {
            color: #999;
            font-size: 12px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">${workspaceName}</div>
            <div class="workspace-name">Loan Application Portal</div>
          </div>
          
          <div class="content">
            <div class="greeting">Thank you, ${clientName}!</div>
            
            <div class="message">
              We've successfully received your loan application and are excited to help you with your financing needs. Our team will review your application and get back to you within 1-2 business days.
            </div>
            
            <div class="next-steps">
              <h3>What happens next?</h3>
              <ul>
                <li>Our loan specialists will review your application</li>
                <li>We'll verify the information you provided</li>
                <li>You'll receive a personalized loan proposal</li>
                <li>We'll guide you through the next steps in the process</li>
              </ul>
            </div>
            
            <div class="message">
              If you have any questions or need to provide additional information, please don't hesitate to reach out to us. We're here to help make your loan process as smooth as possible.
            </div>
          </div>
          
          <div class="contact-info">
            <h3>Need Help?</h3>
            <p>Contact our team at <strong>support@${workspaceName.toLowerCase().replace(/\s+/g, '')}.com</strong></p>
            <p>Or call us at <strong>(555) 123-4567</strong></p>
          </div>
          
          <div class="footer">
            <p>This email was sent from your loan application portal.</p>
            <div class="powered-by">Powered by LoanFlow Pro</div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend
    try {
      const emailResult = await resend.emails.send({
        from: `"${workspaceName}" <noreply@flow.loanflowpro.com>`,
        to: [clientEmail],
        subject: `Thank you for your loan application - ${workspaceName}`,
        html: emailHtml,
        replyTo: `support@${workspaceName.toLowerCase().replace(/\s+/g, '')}.com`,
      });

      console.log(`Thank you email sent successfully to ${clientEmail}:`, emailResult);

      // Log the email sending
      await ctx.runMutation(api.applications.logEmailSent, {
        clientId: clientId,
        workspaceId: workspaceId,
        clientEmail: clientEmail,
        emailId: emailResult.data?.id || "unknown",
        workspaceName: workspaceName
      });

      return { success: true, emailId: emailResult.data?.id || "unknown" };
    } catch (error) {
      console.error("Failed to send thank you email:", error);
      throw new Error("Failed to send thank you email");
    }
  },
});

// Get applications for a workspace
export const getApplications = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("clients")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .filter((q) => q.eq(q.field("source"), "widget"))
      .collect();
  },
});

// Get application by ID
export const getApplication = query({
  args: { applicationId: v.id("clients") },
  handler: async (ctx, { applicationId }) => {
    return await ctx.db.get(applicationId);
  },
});

// Log email sent
export const logEmailSent = mutation({
  args: {
    clientId: v.id("clients"),
    workspaceId: v.id("workspaces"),
    clientEmail: v.string(),
    emailId: v.string(),
    workspaceName: v.string(),
  },
  handler: async (ctx, { clientId, workspaceId, clientEmail, emailId, workspaceName }) => {
    await ctx.db.insert("auditLogs", {
      action: "thank_you_email_sent",
      resourceType: "client",
      resourceId: clientId,
      userId: undefined,
      workspaceId: workspaceId,
      details: { 
        clientEmail: clientEmail,
        emailId: emailId,
        workspaceName: workspaceName
      },
      createdAt: Date.now(),
    });
  },
});
