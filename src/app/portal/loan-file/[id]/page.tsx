"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Dynamically import the loan file detail content to prevent static generation
const LoanFileDetailContent = dynamic(() => import("@/components/portal/LoanFileDetailContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading loan file details...</p>
      </div>
    </div>
  ),
});

export default function LoanFileDetailPage() {
  return <LoanFileDetailContent />;
}
