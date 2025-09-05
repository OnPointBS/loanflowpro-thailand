"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Mail, Lock, ArrowRight, CheckCircle, Building2, Users } from "lucide-react";

export default function LoginPage() {
  const { sendMagicLink, createWorkspace, isLoading } = useAuth();
  const [step, setStep] = useState<"email" | "workspace" | "new-workspace">("email");
  const [email, setEmail] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await sendMagicLink(email, workspaceSlug);
      setStep("email");
      // Show success message
    } catch (err) {
      if (err instanceof Error && err.message.includes("not found")) {
        setIsNewUser(true);
        setStep("new-workspace");
      } else {
        setError("Failed to send magic link. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewWorkspaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await createWorkspace(email, workspaceName, name, firstName, lastName);
      setStep("email");
      // Show success message
    } catch (err) {
      setError("Failed to create workspace. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37] rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LoanFlow Pro
          </h1>
          <p className="text-gray-600">
            Streamline your loan workflow management
          </p>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-center">
              {step === "email" && "Sign in to your account"}
              {step === "workspace" && "Select your workspace"}
              {step === "new-workspace" && "Create your workspace"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === "email" && "We'll send you a secure magic link"}
              {step === "workspace" && "Choose which workspace to access"}
              {step === "new-workspace" && "Set up your new workspace"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {step === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                />
                <Input
                  label="Workspace (optional)"
                  type="text"
                  value={workspaceSlug}
                  onChange={(e) => setWorkspaceSlug(e.target.value)}
                  placeholder="company-name"
                  disabled={isSubmitting}
                  helperText="Leave blank if you're not sure"
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting}
                  disabled={!email}
                >
                  Send magic link
                  <Mail className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}

            {step === "new-workspace" && (
              <form onSubmit={handleNewWorkspaceSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    disabled={isSubmitting}
                  />
                  <Input
                    label="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Input
                  label="Company/Workspace name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Your Company Name"
                  required
                  disabled={isSubmitting}
                />
                <Input
                  label="Display name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting}
                  disabled={!firstName || !lastName || !workspaceName}
                >
                  Create workspace
                  <Building2 className="w-4 h-4 ml-2" />
                </Button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full text-sm text-gray-600 hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  ← Back to email
                </button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <Badge variant="info">Secure</Badge>
            <Badge variant="success">No passwords</Badge>
            <Badge variant="warning">14-day trial</Badge>
          </div>
        </div>

        {isNewUser && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <p className="text-sm text-blue-800">
                New to LoanFlow Pro? Create your workspace to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}