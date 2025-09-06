"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Building2, Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SignInContent() {
  const [email, setEmail] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      await login(email, workspaceSlug || undefined);
      setMessage("Magic link sent! Check your email and click the link to sign in.");
      setMessageType("success");
    } catch (error) {
      console.error("Sign in error:", error);
      setMessage(error instanceof Error ? error.message : "Failed to send magic link. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">LoanFlow Pro</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-center text-black font-bold">Sign In</CardTitle>
            <CardDescription className="text-center text-black font-semibold">
              Enter your email to receive a magic link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 text-black font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace" className="text-black font-semibold">
                  Workspace (Optional)
                </Label>
                <Input
                  id="workspace"
                  type="text"
                  placeholder="Your workspace slug (if you have one)"
                  value={workspaceSlug}
                  onChange={(e) => setWorkspaceSlug(e.target.value)}
                  className="text-black font-semibold"
                />
                <p className="text-sm text-gray-600">
                  If you don't have a workspace, leave this blank and we'll help you create one.
                </p>
              </div>

              {message && (
                <div className={`p-4 rounded-lg flex items-center space-x-2 ${
                  messageType === "success" 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {messageType === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm font-medium">{message}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-3"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Sending magic link...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Send Magic Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-[#D4AF37] hover:text-[#B8941F] font-semibold">
                  Start your free trial
                </Link>
              </p>
            </div>
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
