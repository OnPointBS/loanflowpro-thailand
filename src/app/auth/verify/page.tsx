"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CheckCircle, XCircle, ArrowRight, Mail } from "lucide-react";

function VerifyPageContent() {
  const { verifyMagicLink, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error" | "expired">("verifying");
  const [error, setError] = useState("");
  const [redirectRoute, setRedirectRoute] = useState("");
  const isVerifyingRef = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setError("No verification token provided");
      return;
    }

    // Prevent multiple verification attempts
    if (isVerifyingRef.current) return;

    const verifyToken = async () => {
      isVerifyingRef.current = true;
      
      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (isVerifyingRef.current) {
          console.error("Verification timeout");
          setStatus("error");
          setError("Verification timed out. Please try again.");
          isVerifyingRef.current = false;
        }
      }, 10000); // 10 second timeout
      
      try {
        console.log("Starting magic link verification...");
        const result = await verifyMagicLink(token);
        console.log("Verification result:", result);
        
        clearTimeout(timeoutId);
        setStatus("success");
        setRedirectRoute(result.redirectRoute);
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push(result.redirectRoute);
        }, 1000); // Reduced delay for faster UX
      } catch (err) {
        console.error("Verification error:", err);
        clearTimeout(timeoutId);
        
        if (err instanceof Error) {
          if (err.message.includes("expired")) {
            setStatus("expired");
          } else if (err.message.includes("already been used")) {
            // If already used, redirect to dashboard (user is already logged in)
            setStatus("success");
            setRedirectRoute("/app");
            setTimeout(() => {
              router.push("/app");
            }, 500); // Faster redirect for already used links
          } else {
            setStatus("error");
            setError(err.message);
          }
        } else {
          setStatus("error");
          setError("Verification failed. Please try again.");
        }
      } finally {
        isVerifyingRef.current = false;
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
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <LoadingSpinner size="lg" />
                </div>
                <div>
                  <p className="text-blue-600 font-medium">Verifying your magic link...</p>
                  <p className="text-gray-600 text-sm mt-2">Please wait while we authenticate you</p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-green-600 font-medium">Welcome to LoanFlow Pro!</p>
                  <p className="text-gray-600 text-sm mt-2">
                    You're being redirected to your dashboard...
                  </p>
                </div>
                <div className="pt-4">
                  <Button onClick={() => router.push(redirectRoute)} className="bg-[#D4AF37] hover:bg-[#B8941F]">
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

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading verification...</p>
        </div>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  );
}
