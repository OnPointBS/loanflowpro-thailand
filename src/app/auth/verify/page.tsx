"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CheckCircle, XCircle, ArrowRight, Mail } from "lucide-react";

export default function VerifyPage() {
  const { verifyMagicLink, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error" | "expired">("verifying");
  const [error, setError] = useState("");
  const [redirectRoute, setRedirectRoute] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setError("No verification token provided");
      return;
    }

    const verifyToken = async () => {
      try {
        const result = await verifyMagicLink(token);
        setStatus("success");
        setRedirectRoute(result.redirectRoute);
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push(result.redirectRoute);
        }, 2000);
      } catch (err) {
        console.error("Verification error:", err);
        
        if (err instanceof Error) {
          if (err.message.includes("expired")) {
            setStatus("expired");
          } else {
            setStatus("error");
            setError(err.message);
          }
        } else {
          setStatus("error");
          setError("Verification failed. Please try again.");
        }
      }
    };

    verifyToken();
  }, [searchParams, verifyMagicLink, router]);

  const handleRetry = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-center">
              {status === "verifying" && "Verifying your link"}
              {status === "success" && "Welcome to LoanFlow Pro!"}
              {status === "error" && "Verification failed"}
              {status === "expired" && "Link expired"}
            </CardTitle>
            <CardDescription className="text-center">
              {status === "verifying" && "Please wait while we verify your magic link"}
              {status === "success" && "You're being redirected to your dashboard"}
              {status === "error" && "There was an issue with your verification link"}
              {status === "expired" && "Your magic link has expired"}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            {status === "verifying" && (
              <div className="space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-600">Verifying your magic link...</p>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-green-600 font-medium">Verification successful!</p>
                  <p className="text-gray-600 text-sm mt-2">
                    Redirecting you to {redirectRoute}...
                  </p>
                </div>
                <div className="pt-4">
                  <Button onClick={() => router.push(redirectRoute)}>
                    Continue to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <p className="text-red-600 font-medium">Verification failed</p>
                  <p className="text-gray-600 text-sm mt-2">
                    {error || "There was an issue with your verification link. Please try again."}
                  </p>
                </div>
                <div className="pt-4">
                  <Button onClick={handleRetry} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {status === "expired" && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <p className="text-yellow-600 font-medium">Link expired</p>
                  <p className="text-gray-600 text-sm mt-2">
                    Your magic link has expired. Please request a new one.
                  </p>
                </div>
                <div className="pt-4">
                  <Button onClick={handleRetry}>
                    Request New Link
                    <Mail className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Having trouble? Contact support at{" "}
            <a href="mailto:support@loanflowpro.com" className="text-[#D4AF37] hover:underline">
              support@loanflowpro.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
