# Magic Link Authentication + RBAC System

## Overview

LoanFlow Pro implements a comprehensive authentication system using Convex Auth with magic links and a robust Role-Based Access Control (RBAC) engine. The system automatically routes users to the correct interface based on their role and workspace permissions.

## Architecture

### Authentication Flow

1. **User enters email** → Magic link sent via Resend
2. **User clicks magic link** → Token verification
3. **Auto-login + session creation** → RBAC engine determines redirect
4. **Route to correct interface** based on user role and permissions

### RBAC System

The system supports three user roles with granular permissions:

- **Advisor**: Full access to all features within their workspace
- **Staff**: Limited access (no billing, no user management)
- **Client**: Read-only access to their own loan files and documents

## Core Components

### 1. Convex Auth Configuration (`convex/auth.config.ts`)

```typescript
// Magic link provider with Resend integration
const resend = new Resend(process.env.RESEND_API_KEY);

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    MagicLink({
      sendMagicLink: async ({ email, token, url }) => {
        // Send beautiful HTML email via Resend
      },
    }),
    Password({
      sendPasswordReset: async ({ email, token, url }) => {
        // Password reset functionality
      },
    }),
  ],
});
```

### 2. RBAC Engine (`src/lib/rbac.ts`)

```typescript
export class RBACEngine {
  // Role-based permission matrix
  private static readonly ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    advisor: [/* all permissions */],
    staff: [/* limited permissions */],
    client: [/* read-only permissions */],
  };

  // Permission checking methods
  static hasPermission(user: User, permission: Permission): boolean
  static canUserAccess(user: User, resource: string, action: string): boolean
  static getDefaultRouteForUser(user: User, workspace: Workspace): string
  static canAccessRoute(user: User, route: string): boolean
}
```

### 3. Enhanced Schema (`convex/schema.ts`)

```typescript
export default defineSchema({
  // Convex Auth tables
  ...authTables,
  
  // Enhanced workspace with slug support
  workspaces: defineTable({
    name: v.string(),
    slug: v.string(), // unique identifier for URLs
    status: v.union(v.literal("active"), v.literal("trial"), v.literal("suspended")),
    subscriptionTier: v.union(v.literal("solo"), v.literal("team"), v.literal("enterprise")),
    settings: v.object({
      allowClientRegistration: v.boolean(),
      requireApproval: v.boolean(),
      customBranding: v.optional(v.object({
        logoUrl: v.optional(v.string()),
        primaryColor: v.optional(v.string()),
        companyName: v.optional(v.string())
      })),
    }),
  }).index("by_slug", ["slug"]),

  // Enhanced users with RBAC support
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("advisor"), v.literal("staff"), v.literal("client")),
    workspaceId: v.id("workspaces"),
    status: v.union(v.literal("active"), v.literal("pending"), v.literal("suspended")),
    permissions: v.optional(v.array(v.string())), // custom permissions override
    lastActiveAt: v.optional(v.number()),
  }).index("by_email", ["email"])
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_role", ["workspaceId", "role"]),

  // Magic links for authentication
  magicLinks: defineTable({
    email: v.string(),
    token: v.string(),
    workspaceId: v.optional(v.id("workspaces")),
    expiresAt: v.number(),
    usedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_token", ["token"])
    .index("by_email", ["email"]),
});
```

## Authentication Pages

### 1. Login Page (`/`)

**Features:**
- Email input with workspace detection
- Magic link request handling
- New workspace creation flow
- Loading states and error handling
- Support for workspace-specific login URLs

**Flow:**
1. User enters email and optional workspace slug
2. System checks if user exists
3. If user exists: Send magic link to their workspace
4. If new user: Offer workspace creation flow

### 2. Magic Link Verification (`/auth/verify`)

**Features:**
- Token verification from URL params
- Automatic login and redirect
- Error handling for expired/invalid tokens
- Loading state during verification
- Role-based redirect logic

**Flow:**
1. Extract token from URL
2. Verify token validity and expiration
3. Create/update user session
4. Determine redirect route based on role
5. Redirect to appropriate interface

### 3. Workspace Selection (`/workspaces`)

**Features:**
- Show available workspaces for multi-workspace users
- Create new workspace option for advisors
- Recently accessed workspaces
- Workspace status indicators
- Role-based workspace access

## Permission System

### Permission Types

```typescript
type Permission = 
  | "workspace:manage"
  | "clients:create" | "clients:read" | "clients:update" | "clients:delete"
  | "loanfiles:create" | "loanfiles:read" | "loanfiles:update" | "loanfiles:delete"
  | "documents:upload" | "documents:read" | "documents:delete"
  | "billing:manage" | "billing:read"
  | "users:invite" | "users:manage"
  | "settings:manage"
  | "tasks:create" | "tasks:read" | "tasks:update" | "tasks:delete"
  | "messages:create" | "messages:read"
  | "reports:read";
```

### Role Permissions Matrix

| Permission | Advisor | Staff | Client |
|------------|---------|-------|--------|
| workspace:manage | ✅ | ❌ | ❌ |
| clients:* | ✅ | ✅ | ❌ |
| loanfiles:* | ✅ | ✅ | read only |
| documents:* | ✅ | ✅ | read only |
| billing:manage | ✅ | ❌ | ❌ |
| users:* | ✅ | ❌ | ❌ |
| settings:manage | ✅ | ❌ | ❌ |

## Route Protection

### Middleware (`middleware.ts`)

The middleware automatically:
- Protects authenticated routes
- Redirects based on user role
- Handles workspace switching
- Validates permissions for API routes
- Enforces workspace isolation

### Route Mapping

- **Advisor** → `/app` (full dashboard)
- **Staff** → `/app` (limited dashboard)
- **Client** → `/portal` (client portal)

## API Integration

### Convex Functions

#### Authentication Functions (`convex/auth.ts`)

```typescript
// Send magic link
export const sendMagicLink = mutation({
  args: { email: v.string(), workspaceSlug: v.optional(v.string()) },
  handler: async (ctx, { email, workspaceSlug }) => {
    // Generate token, send email, store magic link
  }
});

// Verify magic link
export const verifyMagicLink = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    // Verify token, create session, determine redirect
  }
});

// Create workspace and user
export const createWorkspaceAndUser = mutation({
  args: { email: v.string(), workspaceName: v.string(), ... },
  handler: async (ctx, args) => {
    // Create workspace, user, and send magic link
  }
});
```

#### Permission Functions (`convex/permissions.ts`)

```typescript
// Get user permissions
export const getUserPermissions = query({ ... });

// Check resource access
export const canUserAccessResource = query({ ... });

// Check route access
export const canUserAccessRoute = query({ ... });

// Get available routes
export const getAvailableRoutes = query({ ... });
```

## Email Templates

### Magic Link Email

Beautiful HTML email template with:
- Branded header with gradient
- Clear call-to-action button
- Security messaging
- Expiration notice
- Fallback text

### Password Reset Email

Similar template for password reset functionality.

## Security Features

### Magic Link Security

- **15-minute expiration** for all magic links
- **Single-use tokens** - cannot be reused
- **Secure token generation** with timestamp and random component
- **Rate limiting** on magic link requests
- **Audit logging** for all authentication events

### Workspace Isolation

- **Strict workspace boundaries** - users can only access their workspace
- **Role-based access control** within workspaces
- **Permission inheritance** from roles with custom overrides
- **Session validation** on every request

### Session Management

- **Convex Auth integration** for secure session handling
- **Automatic session refresh** and validation
- **Cross-tab synchronization** of authentication state
- **Secure logout** with session cleanup

## Usage Examples

### Frontend Usage

```typescript
// Send magic link
const { sendMagicLink } = useAuth();
await sendMagicLink("user@example.com", "company-slug");

// Check permissions
const { hasPermission, canAccess } = useAuth();
if (hasPermission("clients:create")) {
  // Show create client button
}

// Check route access
const { canAccessRoute } = useAuth();
if (canAccessRoute("/app/billing")) {
  // Show billing menu item
}
```

### Backend Usage

```typescript
// In Convex functions
const user = await ctx.db.get(userId);
const canAccess = RBACEngine.canUserAccess(user, "clients", "create");

// Check workspace access
const hasAccess = RBACEngine.canAccessWorkspace(user, workspaceId);
```

## Environment Variables

### Required Environment Variables

```bash
# Resend API
RESEND_API_KEY=re_your_api_key_here

# Convex Auth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## Testing

### Test Scenarios

1. **Magic Link Flow**
   - Send magic link to existing user
   - Send magic link to new user
   - Verify expired token handling
   - Verify used token handling

2. **RBAC Testing**
   - Test advisor permissions
   - Test staff permissions
   - Test client permissions
   - Test custom permission overrides

3. **Workspace Isolation**
   - Test cross-workspace access prevention
   - Test workspace switching
   - Test multi-workspace users

4. **Route Protection**
   - Test protected route access
   - Test role-based redirects
   - Test middleware functionality

## Troubleshooting

### Common Issues

1. **Magic link not sending**
   - Check Resend API key configuration
   - Verify email domain setup
   - Check rate limiting

2. **Permission denied errors**
   - Verify user role assignment
   - Check workspace membership
   - Review permission matrix

3. **Redirect loops**
   - Check middleware configuration
   - Verify route protection rules
   - Review user status and workspace status

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` to see:
- Detailed error messages
- Permission check results
- Route access decisions
- Session state information

## Future Enhancements

### Planned Features

1. **Multi-factor Authentication**
   - SMS-based 2FA
   - TOTP support
   - Hardware key support

2. **Advanced RBAC**
   - Custom role creation
   - Permission groups
   - Time-based permissions

3. **SSO Integration**
   - SAML support
   - OAuth providers
   - Enterprise directory integration

4. **Audit & Compliance**
   - Detailed audit logs
   - Compliance reporting
   - Security monitoring

## Support

For issues with the authentication system:

1. Check the logs for specific error messages
2. Verify environment variable configuration
3. Test with different user roles and permissions
4. Contact support with specific error details

The authentication system is designed to be secure, scalable, and user-friendly while providing granular control over access and permissions.
