"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Shield, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Building2
} from "lucide-react";

function SignInWidgetContent() {
  const searchParams = useSearchParams();
  const workspaceSlug = searchParams.get("workspace");
  const domain = searchParams.get("domain");
  
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [workspace, setWorkspace] = useState<any>(null);

  const sendMagicLink = useMutation(api.auth.sendMagicLink);

  useEffect(() => {
    // Verify domain authorization and get workspace info
    if (workspaceSlug) {
      // In a real implementation, you would verify the domain is authorized
      // and fetch workspace details
      setWorkspace({
        name: workspaceSlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        slug: workspaceSlug
      });
    }
  }, [workspaceSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !workspaceSlug) return;

    setIsSubmitting(true);
    setError("");
    setStatus("idle");

    try {
      await sendMagicLink({
        email,
        workspaceSlug,
        source: "widget",
        domain: domain || "unknown"
      });
      setStatus("success");
    } catch (err) {
      setError("Failed to send magic link. Please try again.");
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-black font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-black">
              Client Portal Sign-In
            </CardTitle>
            <CardDescription className="text-black font-semibold">
              Sign in to access your loan information
            </CardDescription>
          </CardHeader>

          <CardContent>
            {status === "success" ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black mb-2">
                    Magic Link Sent!
                  </h3>
                  <p className="text-black font-semibold mb-4">
                    Check your email for a secure sign-in link. Click the link to access your client portal.
                  </p>
                  <p className="text-sm text-gray-600">
                    The link will expire in 15 minutes for security.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatus("idle");
                    setEmail("");
                  }}
                  className="w-full"
                >
                  Send Another Link
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                      <p className="text-sm text-red-700 font-semibold">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-black">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                    className="font-bold text-black"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white font-bold"
                  disabled={!email || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Magic Link
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Powered by <span className="font-bold text-black">{workspace.name}</span>
                  </p>
                </div>
              </form>
            )}

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-900">Secure Sign-In</p>
                  <p className="text-xs text-blue-700">
                    We use magic links for secure, passwordless authentication. 
                    No passwords are stored or transmitted.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignInWidgetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-black font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <SignInWidgetContent />
    </Suspense>
  );
}
