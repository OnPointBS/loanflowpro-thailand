"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Dynamically import the sign-in content to prevent static generation
const SignInContent = dynamic(() => import("@/components/auth/SignInContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading sign-in page...</p>
      </div>
    </div>
  ),
});

export default function SignInPage() {
  return <SignInContent />;
}