"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Dynamically import the messages content to prevent static generation
const MessagesContent = dynamic(() => import("@/components/portal/MessagesContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading messages...</p>
      </div>
    </div>
  ),
});

export default function MessagesPage() {
  return <MessagesContent />;
}
