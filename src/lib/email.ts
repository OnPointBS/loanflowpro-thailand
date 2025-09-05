import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface MagicLinkEmailProps {
  email: string;
  magicLink: string;
  workspaceName?: string;
}

export interface ClientInvitationEmailProps {
  email: string;
  inviterName: string;
  workspaceName: string;
  invitationLink: string;
  clientName?: string;
}

// Magic Link Email Template
export const sendMagicLinkEmail = async ({ email, magicLink, workspaceName = "LoanFlow Pro" }: MagicLinkEmailProps) => {
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

    return data;
  } catch (error) {
    console.error('Error in sendMagicLinkEmail:', error);
    throw error;
  }
};

// Client Invitation Email Template
export const sendClientInvitationEmail = async ({ 
  email, 
  inviterName, 
  workspaceName, 
  invitationLink, 
  clientName 
}: ClientInvitationEmailProps) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'noreply@flow.loanflowpro.com',
      to: [email],
      subject: `You're invited to join ${workspaceName} - LoanFlow Pro`,
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
                  <path d="m22 21-3-3m0 0a2 2 0 1 0-2.828-2.828l2.828 2.828Z"></path>
                </svg>
              </div>
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">${workspaceName}</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Loan workflow management platform</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 24px;">
              <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px; font-weight: 600; text-align: center;">
                You're invited to join as a client!
              </h2>
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.5; text-align: center;">
                ${clientName ? `Hi ${clientName},` : 'Hello,'} <strong>${inviterName}</strong> has invited you to join their loan workflow management platform. 
                You'll be able to track your loan progress, upload documents, and communicate with your advisor.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${invitationLink}" 
                   style="display: inline-flex; align-items: center; justify-content: center; padding: 12px 24px; background-color: #D4AF37; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="m22 21-3-3m0 0a2 2 0 1 0-2.828-2.828l2.828 2.828Z"></path>
                  </svg>
                  Accept Invitation
                </a>
              </div>

              <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">What you can do as a client:</p>
                <ul style="margin: 0; padding-left: 20px; color: #0c4a6e; font-size: 14px; line-height: 1.5;">
                  <li>Track your loan application progress</li>
                  <li>Upload required documents securely</li>
                  <li>Communicate with your advisor</li>
                  <li>View task deadlines and requirements</li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                This invitation was sent to <strong>${email}</strong>
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
      console.error('Error sending client invitation email:', error);
      throw new Error('Failed to send client invitation email');
    }

    return data;
  } catch (error) {
    console.error('Error in sendClientInvitationEmail:', error);
    throw error;
  }
};
