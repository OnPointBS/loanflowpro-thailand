# Vercel Deployment Guide

## Quick Fix for Build Error

The error "No Output Directory named 'dist' found" occurs because Vercel is not detecting this as a Next.js project properly.

## Solution

1. **Remove any custom vercel.json** (if present)
2. **Set the correct environment variables in Vercel**
3. **Redeploy**

## Required Environment Variables for Vercel

Set these in your Vercel dashboard under Settings > Environment Variables:

### Production Environment Variables

```bash
NEXT_PUBLIC_CONVEX_URL=https://optimistic-ibex-155.convex.cloud
```

### Optional Environment Variables (for full functionality)

```bash
# Stripe (if you want to enable payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here

# Resend (already configured in Convex)
# No additional Vercel env vars needed for Resend
```

## Deployment Steps

1. **Push to Git**:
   ```bash
   git add .
   git commit -m "Fix Vercel build configuration"
   git push origin main
   ```

2. **Set Environment Variables in Vercel**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add `NEXT_PUBLIC_CONVEX_URL` with value `https://optimistic-ibex-155.convex.cloud`
   - Set for Production, Preview, and Development environments

3. **Redeploy**:
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger automatic deployment

## Why This Fixes the Issue

- **Next.js Detection**: Vercel automatically detects Next.js projects when there's no custom vercel.json
- **Environment Variables**: The `NEXT_PUBLIC_CONVEX_URL` is required for the app to connect to Convex
- **Build Process**: Next.js builds to `.next` directory by default, which Vercel handles automatically

## Verification

After deployment, verify:
1. ✅ Build completes successfully
2. ✅ App loads without errors
3. ✅ Authentication works (magic link login)
4. ✅ Dashboard displays correctly

## Troubleshooting

If you still get build errors:

1. **Check Framework Detection**: Vercel should show "Next.js" as the framework
2. **Check Build Command**: Should be `npm run build`
3. **Check Output Directory**: Should be `.next` (auto-detected)
4. **Check Environment Variables**: Ensure `NEXT_PUBLIC_CONVEX_URL` is set

## Support

If issues persist:
1. Check Vercel build logs for specific errors
2. Verify all environment variables are set correctly
3. Ensure the Convex deployment is active and accessible
