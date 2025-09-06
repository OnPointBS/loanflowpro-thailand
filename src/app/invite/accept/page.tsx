"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CheckCircle, XCircle, ArrowRight, Mail, Users } from "lucide-react";

function AcceptInvitationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error" | "expired">("verifying");
  const [error, setError] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const acceptInvitation = useMutation(api.userInvitations.acceptUserInvitation);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setError("No invitation token provided");
      setIsLoading(false);
      return;
    }

    const acceptInvite = async () => {
      try {
        const result = await acceptInvitation({ token });
        
        if (result.success) {
          setStatus("success");
          setWorkspaceName(result.workspace.name);
          
          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify(result.user));
          localStorage.setItem("workspace", JSON.stringify(result.workspace));
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push(result.redirectRoute);
          }, 3000);
        }
      } catch (err) {
        console.error("Invitation acceptance error:", err);
        
        if (err instanceof Error) {
          if (err.message.includes("expired")) {
            setStatus("expired");
          } else if (err.message.includes("already been accepted")) {
            setStatus("error");
            setError("This invitation has already been accepted");
          } else if (err.message.includes("already a member")) {
            setStatus("error");
            setError("You are already a member of this workspace");
          } else {
            setStatus("error");
            setError(err.message);
          }
        } else {
          setStatus("error");
          setError("Failed to accept invitation. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    acceptInvite();
  }, [searchParams, acceptInvitation, router]);

  const handleRetry = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Processing your invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-center">
              {status === "verifying" && "Processing invitation"}
              {status === "success" && "Welcome to LoanFlow Pro!"}
              {status === "error" && "Invitation error"}
              {status === "expired" && "Invitation expired"}
            </CardTitle>
            <CardDescription className="text-center">
              {status === "verifying" && "Please wait while we process your invitation"}
              {status === "success" && `You're now part of ${workspaceName}`}
              {status === "error" && "There was an issue with your invitation"}
              {status === "expired" && "Your invitation has expired"}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            {status === "success" && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-green-600 font-medium">Invitation accepted successfully!</p>
                  <p className="text-gray-600 text-sm mt-2">
                    You now have access to {workspaceName} on LoanFlow Pro.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">What you can do now:</span>
                  </div>
                  <ul className="text-sm text-blue-700 text-left space-y-1">
                    <li>• Access your dashboard</li>
                    <li>• View loan files and documents</li>
                    <li>• Communicate with your team</li>
                    <li>• Manage your account</li>
                  </ul>
                </div>
                <div className="pt-4">
                  <Button onClick={() => router.push("/app")}>
                    Go to Dashboard
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
                  <p className="text-red-600 font-medium">Invitation error</p>
                  <p className="text-gray-600 text-sm mt-2">
                    {error || "There was an issue with your invitation. Please try again."}
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
                  <p className="text-yellow-600 font-medium">Invitation expired</p>
                  <p className="text-gray-600 text-sm mt-2">
                    Your invitation has expired. Please contact your advisor for a new invitation.
                  </p>
                </div>
                <div className="pt-4">
                  <Button onClick={handleRetry} variant="outline">
                    Contact Support
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support at{" "}
            <a href="mailto:support@loanflowpro.com" className="text-[#D4AF37] hover:underline">
              support@loanflowpro.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading invitation...</p>
        </div>
      </div>
    }>
      <AcceptInvitationPageContent />
    </Suspense>
  );
}
