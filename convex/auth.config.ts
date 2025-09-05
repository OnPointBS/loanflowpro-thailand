import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { MagicLink } from "@convex-dev/auth/providers/MagicLink";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    MagicLink({
      sendMagicLink: async ({ email, token, url }) => {
        try {
          await resend.emails.send({
            from: "LoanFlow Pro <noreply@loanflowpro.com>",
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
                    <a href="${url}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Sign In Securely</a>
                  </div>
                  <p style="color: #666; font-size: 14px;">This link expires in 15 minutes.</p>
                  <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this link, you can safely ignore this email.</p>
                </div>
              </div>
            `,
          });
        } catch (error) {
          console.error("Error sending magic link:", error);
          throw new Error("Failed to send magic link");
        }
      },
    }),
    Password({
      sendPasswordReset: async ({ email, token, url }) => {
        try {
          await resend.emails.send({
            from: "LoanFlow Pro <noreply@loanflowpro.com>",
            to: [email],
            subject: "Reset your password - LoanFlow Pro",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">LoanFlow Pro</h1>
                </div>
                <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h2 style="color: #333; margin-bottom: 20px;">Reset your password</h2>
                  <p style="color: #666; margin-bottom: 30px;">Click the button below to reset your password:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
                  </div>
                  <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
                  <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
              </div>
            `,
          });
        } catch (error) {
          console.error("Error sending password reset:", error);
          throw new Error("Failed to send password reset");
        }
      },
    }),
  ],
});
