"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Dynamically import the sign-up content to prevent static generation
const SignUpContent = dynamic(() => import("@/components/auth/SignUpContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading sign-up page...</p>
      </div>
    </div>
  ),
});

export default function SignUpPage() {
  return <SignUpContent />;
}