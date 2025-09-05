# Environment Variables Configuration

This document outlines all the environment variables needed for LoanFlow Pro to function properly. Set these in your Convex dashboard and Vercel deployment.

## Required Environment Variables

### Convex Environment Variables

Set these in your Convex dashboard under Settings > Environment Variables:

#### 1. Resend API (Email Service)
```bash
RESEND_API_KEY=re_your_resend_api_key_here
```
- **Purpose**: Sends OTP emails and notifications
- **How to get**: Sign up at [resend.com](https://resend.com) and create an API key
- **Required for**: User authentication, email notifications

#### 2. Stripe (Payment Processing)
```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```
- **Purpose**: Handles subscription billing and payments
- **How to get**: 
  - Create account at [stripe.com](https://stripe.com)
  - Get secret key from Dashboard > Developers > API keys
  - Get webhook secret from Dashboard > Developers > Webhooks
- **Required for**: Billing, subscriptions, payment processing

#### 3. Google Vision API (OCR Processing)
```bash
GOOGLE_VISION_API_KEY=your_google_vision_api_key_here
```
- **Purpose**: Processes document OCR for text extraction
- **How to get**: 
  - Go to [Google Cloud Console](https://console.cloud.google.com)
  - Enable Vision API
  - Create credentials (API key or service account)
- **Required for**: Document processing, OCR text extraction

#### 4. NextAuth (Authentication)
```bash
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```
- **Purpose**: Session management and security
- **How to get**: Generate a random string (32+ characters)
- **Required for**: Session security, CSRF protection

### Vercel Environment Variables

Set these in your Vercel dashboard under Settings > Environment Variables:

#### 1. Convex Configuration
```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```
- **Purpose**: Frontend connection to Convex backend
- **How to get**: From Convex dashboard after deployment
- **Required for**: Frontend-backend communication

#### 2. Stripe Public Key
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```
- **Purpose**: Client-side Stripe integration
- **How to get**: From Stripe dashboard (publishable key)
- **Required for**: Payment forms, checkout

## Environment Variable Setup Instructions

### 1. Convex Setup

1. Go to your Convex dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with its value
4. Deploy your Convex functions

### 2. Vercel Setup

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable for Production, Preview, and Development
5. Redeploy your application

### 3. Local Development

Create a `.env.local` file in your project root:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Resend
RESEND_API_KEY=re_your_resend_api_key_here

# Google Vision
GOOGLE_VISION_API_KEY=your_google_vision_api_key_here

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Service Setup Guides

### Resend Setup
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain)
3. Create an API key
4. Add to Convex environment variables

### Stripe Setup
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard > Developers > API keys
3. Create webhook endpoint: `https://your-domain.com/api/stripe/webhook`
4. Select events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`
5. Get webhook secret
6. Add keys to both Convex and Vercel

### Google Vision API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Vision API
4. Create credentials (API key or service account)
5. Add to Convex environment variables

## Testing Without Services

The application is designed to work with mock data when services are not configured:

- **Resend**: OTP codes will be logged to console
- **Stripe**: Checkout will use mock sessions
- **Google Vision**: OCR will use mock text extraction

## Security Notes

- Never commit `.env.local` to version control
- Use different API keys for development and production
- Rotate API keys regularly
- Monitor usage and set up alerts for unusual activity

## Troubleshooting

### Common Issues

1. **OTP emails not sending**: Check Resend API key and domain verification
2. **Stripe payments failing**: Verify webhook endpoint and event selection
3. **OCR not working**: Check Google Vision API key and billing setup
4. **Convex connection issues**: Verify NEXT_PUBLIC_CONVEX_URL

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages and mock data fallbacks.

## Support

If you encounter issues with environment variable setup:

1. Check the service-specific documentation
2. Verify all variables are set correctly
3. Check the application logs for specific error messages
4. Contact support with specific error details
