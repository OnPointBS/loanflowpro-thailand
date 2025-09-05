# LoanFlow Pro - Loan Workflow Management System

A comprehensive loan workflow management system for financial advisors with multi-tenancy, document processing, and client portals.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Convex (database, auth, real-time, file storage)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with glassmorphic design
- **Icons**: Lucide React
- **Payments**: Stripe integration
- **Email**: Resend API
- **OCR**: Google Vision API

## Features

### 🔐 Authentication & Multi-tenancy
- Email-based OTP authentication with Resend
- Multi-workspace support with role-based access control
- Secure session management with Convex auth

### 📊 Workflow Management
- Pre-configured loan type templates (SBA 7(a), Business LOC, Commercial Real Estate)
- Task management with due dates, urgency flags, and status tracking
- Visual progress tracking with completion percentages
- Client management with full CRUD operations

### 📄 Document Hub
- Upload support for PDFs, images (JPG/PNG/HEIC) via Convex file storage
- OCR processing queue with Google Vision integration
- Auto-tagging and task linking rules
- Page-level rotate & crop transformations

### 💬 Communication System
- Thread-based messaging per loan file
- Real-time activity tracking with Convex subscriptions
- Audit logs for compliance

### 💳 Billing & Subscriptions
- Three-tier pricing: Solo ($49/mo), Team Starter ($99/mo), Enterprise ($299/mo)
- Trial period management with feature restrictions
- Usage tracking (seats, storage, active clients)
- Stripe checkout integration with webhooks

### 🌐 Client Portal
- Customizable sections (Tasks, Documents, Messages)
- Read-only mode when workspace blocked
- Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Convex account
- Stripe account
- Resend account
- Google Cloud account (for Vision API)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LoanFlowPro-ThailandMode
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for detailed setup instructions.

**Quick Setup:**
- Set Convex environment variables in your Convex dashboard
- Set Vercel environment variables in your Vercel dashboard
- Create `.env.local` for local development

**Required Services:**
- **Resend**: For OTP emails (configure in Convex)
- **Stripe**: For payments (configure in both Convex and Vercel)
- **Google Vision**: For OCR processing (configure in Convex)

4. Set up Convex:
```bash
npx convex dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── app/               # Protected app pages
│   │   ├── clients/       # Client management
│   │   ├── loan-files/    # Loan file management
│   │   ├── loan-types/    # Template management
│   │   ├── billing/       # Subscription management
│   │   └── settings/      # Workspace configuration
│   └── portal/            # Client-facing portal
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components
│   └── layout/           # Layout components
├── contexts/             # React contexts
├── lib/                  # Utility functions
└── styles/               # Global styles

convex/                   # Convex backend
├── auth.ts              # Authentication functions
├── clients.ts           # Client management
├── loanFiles.ts         # Loan file management
├── tasks.ts             # Task management
├── documents.ts         # Document management
├── messages.ts          # Messaging system
├── billing.ts           # Billing and subscriptions
├── loanTypes.ts         # Loan type templates
└── schema.ts            # Database schema
```

## API Routes

- `/api/stripe/webhook` - Stripe webhook handler
- `/api/auth/otp` - OTP verification
- `/api/ocr/process` - Google Vision processing

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Convex Deployment

1. Run `npx convex deploy` for production
2. Update environment variables with production URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@loanflowpro.com or join our Discord community.