# Client Invitation System with Resend

## Overview

The client invitation system allows advisors and staff to invite clients to access the client portal through secure, branded email invitations sent via Resend. Clients can accept invitations and gain access to their loan files, documents, and communication with their advisors.

## Features

### ✅ **Core Functionality**
- **Secure invitation tokens** with 7-day expiration
- **Beautiful HTML email templates** with branding
- **Personal message support** for custom invitations
- **Invitation management** (resend, cancel, track status)
- **Automatic client portal access** upon acceptance
- **Permission-based access control** (only advisors/staff can invite)

### ✅ **Email Templates**
- **Branded design** with workspace customization
- **Clear call-to-action** buttons
- **Feature highlights** showing portal capabilities
- **Security messaging** and expiration notices
- **Responsive design** for all devices

### ✅ **Admin Interface**
- **Invitation management dashboard** with stats
- **Send new invitations** with personal messages
- **Track pending invitations** with status indicators
- **Resend or cancel** invitations as needed
- **Quick tips** and guidance for users

## Architecture

### Database Schema

```typescript
// Client invitations table
clientInvitations: defineTable({
  email: v.string(),
  workspaceId: v.id("workspaces"),
  invitedBy: v.id("users"),
  token: v.string(),
  status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("expired")),
  expiresAt: v.number(),
  acceptedAt: v.optional(v.number()),
  clientId: v.optional(v.id("clients")),
  message: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
```

### Convex Functions

#### 1. Send Client Invitation (`convex/clientInvitations.ts`)

```typescript
export const sendClientInvitation = mutation({
  args: {
    email: v.string(),
    workspaceId: v.id("workspaces"),
    invitedBy: v.id("users"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, { email, workspaceId, invitedBy, message }) => {
    // 1. Validate email format
    // 2. Check user permissions
    // 3. Check for existing invitations
    // 4. Generate secure token
    // 5. Create invitation record
    // 6. Send branded email via Resend
    // 7. Log the action
  }
});
```

#### 2. Accept Client Invitation

```typescript
export const acceptClientInvitation = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    // 1. Validate token and check expiration
    // 2. Create or update user account
    // 3. Set role as "client"
    // 4. Update invitation status
    // 5. Return user data and redirect route
  }
});
```

#### 3. Invitation Management

```typescript
// Get pending invitations
export const getPendingInvitations = query({ ... });

// Cancel invitation
export const cancelInvitation = mutation({ ... });

// Resend invitation
export const resendInvitation = mutation({ ... });
```

## Email Templates

### Invitation Email Template

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">LoanFlow Pro</h1>
  </div>
  <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #333; margin-bottom: 20px;">You're invited to join {workspaceName}</h2>
    <p style="color: #666; margin-bottom: 20px;">
      You've been invited to access the client portal for <strong>{workspaceName}</strong> on LoanFlow Pro.
    </p>
    
    <!-- Personal message section -->
    {message ? `
      <div style="background: #f8f9fa; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; color: #333; font-style: italic;">"{message}"</p>
      </div>
    ` : ''}
    
    <p style="color: #666; margin-bottom: 30px;">
      Click the button below to accept your invitation and access your loan files, documents, and messages.
    </p>
    
    <!-- Call-to-action button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{invitationUrl}" style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
    </div>
    
    <!-- Feature highlights -->
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
```

### Resend Invitation Template

Similar template with "Reminder" in the subject and updated messaging to indicate it's a follow-up.

## User Interface

### 1. Invitation Management Page (`/app/invitations`)

**Features:**
- **Send invitation form** with email and personal message
- **Pending invitations list** with status indicators
- **Quick actions** (resend, cancel)
- **Invitation statistics** and tips
- **Permission-based access** (only users with invite permissions)

**Components:**
- `ClientInvitationManager` - Main invitation management component
- Form validation and error handling
- Real-time status updates
- Responsive design for all devices

### 2. Invitation Acceptance Page (`/invite/accept`)

**Features:**
- **Token validation** and expiration checking
- **Automatic account creation** for new users
- **Role assignment** as "client"
- **Redirect to client portal** after acceptance
- **Error handling** for invalid/expired tokens

**Flow:**
1. User clicks invitation link
2. System validates token
3. Creates/updates user account
4. Sets role as "client"
5. Redirects to client portal

### 3. Client Portal (`/portal`)

**Features:**
- **Loan file tracking** with progress indicators
- **Document access** and status
- **Message communication** with advisors
- **Workspace branding** and personalization
- **Responsive design** for mobile access

## Security Features

### Invitation Security

- **7-day expiration** for all invitations
- **Single-use tokens** - cannot be reused after acceptance
- **Secure token generation** with timestamp and random component
- **Email validation** before sending
- **Permission checking** - only authorized users can invite

### Access Control

- **Role-based permissions** - only advisors/staff can invite
- **Workspace isolation** - invitations are workspace-specific
- **Audit logging** for all invitation actions
- **Rate limiting** support for invitation sending

### Data Protection

- **Personal message encryption** in transit
- **Secure token storage** in database
- **Email content sanitization** to prevent XSS
- **GDPR compliance** with data handling

## Usage Examples

### Frontend Usage

```typescript
// Send invitation
const { sendInvitation } = useClientInvitations();
await sendInvitation({
  email: "client@example.com",
  message: "Welcome to our loan process!",
});

// Check invitation status
const { pendingInvitations } = useClientInvitations();
console.log(pendingInvitations);

// Resend invitation
const { resendInvitation } = useClientInvitations();
await resendInvitation(invitationId);
```

### Backend Usage

```typescript
// In Convex functions
const invitation = await ctx.db
  .query("clientInvitations")
  .withIndex("by_token", (q) => q.eq("token", token))
  .first();

// Check permissions
if (!RBACEngine.canInviteUsers(user)) {
  throw new Error("No permission to invite clients");
}
```

## Configuration

### Environment Variables

```bash
# Resend API
RESEND_API_KEY=re_your_api_key_here

# Application URL
NEXTAUTH_URL=http://localhost:3000
```

### Resend Setup

1. **Create Resend account** at [resend.com](https://resend.com)
2. **Verify your domain** or use their test domain
3. **Create API key** in dashboard
4. **Add to Convex environment variables**
5. **Configure sender email** in code

## Testing

### Test Scenarios

1. **Send Invitation**
   - Valid email address
   - Invalid email format
   - Duplicate invitation
   - Permission denied

2. **Accept Invitation**
   - Valid token
   - Expired token
   - Already accepted token
   - Invalid token

3. **Email Delivery**
   - Resend API integration
   - Email template rendering
   - Personal message inclusion
   - Branding consistency

4. **Permission Control**
   - Advisor can invite
   - Staff can invite
   - Client cannot invite
   - Workspace isolation

### Mock Mode

When `RESEND_API_KEY` is not configured:
- Invitations are logged to console
- Development-friendly URLs
- No actual emails sent
- Full functionality preserved

## Troubleshooting

### Common Issues

1. **Invitation not sending**
   - Check Resend API key configuration
   - Verify email domain setup
   - Check rate limiting
   - Review error logs

2. **Client can't accept invitation**
   - Check token expiration
   - Verify invitation status
   - Check workspace access
   - Review user creation process

3. **Email not received**
   - Check spam folder
   - Verify email address
   - Check Resend delivery logs
   - Test with different email

4. **Permission errors**
   - Verify user role
   - Check workspace membership
   - Review permission matrix
   - Check invitation permissions

### Debug Mode

Enable debug logging by setting `NODE_ENV=development`:
- Detailed error messages
- Invitation token logging
- Email content preview
- Permission check results

## Future Enhancements

### Planned Features

1. **Bulk Invitations**
   - CSV upload for multiple clients
   - Batch processing
   - Progress tracking
   - Error handling

2. **Custom Email Templates**
   - Workspace-specific branding
   - Template editor
   - Preview functionality
   - A/B testing

3. **Advanced Analytics**
   - Invitation open rates
   - Acceptance rates
   - Time to acceptance
   - Client engagement metrics

4. **Integration Features**
   - CRM integration
   - Calendar scheduling
   - Document pre-population
   - Automated follow-ups

## Support

For issues with the client invitation system:

1. Check the Resend dashboard for delivery status
2. Verify environment variable configuration
3. Test with different email addresses
4. Review the audit logs for detailed information
5. Contact support with specific error details

The client invitation system is designed to be secure, user-friendly, and fully integrated with the existing authentication and permission system.
