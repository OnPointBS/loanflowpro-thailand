"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  User,
  Building2,
  Mail,
  Clock,
  Shield
} from "lucide-react";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);

  const acceptInvitation = useMutation(api.userInvitations.acceptUserInvitation);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link");
      setLoading(false);
      return;
    }

    handleAcceptInvitation();
  }, [token]);

  const handleAcceptInvitation = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const result = await acceptInvitation({ token });
      
      if (result.success) {
        setSuccess(true);
        setInvitation(result.invitation);
        
        // Redirect to appropriate portal after 3 seconds
        setTimeout(() => {
          if (result.invitation?.role === 'client') {
            router.push('/portal');
          } else {
            router.push('/app');
          }
        }, 3000);
      } else {
        setError(result.error || "Failed to accept invitation");
      }
    } catch (err: any) {
      console.error("Error accepting invitation:", err);
      setError(err.message || "An error occurred while accepting the invitation");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-black animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Accepting Invitation</h1>
          <p className="text-black font-bold">Please wait while we process your invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-black mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Invitation Error</h1>
          <p className="text-black font-bold mb-6">{error}</p>
          <Button
            onClick={() => router.push('/')}
            className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-bold"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  if (success && invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-2xl font-bold text-black">
                Welcome to {invitation.workspaceName}!
              </CardTitle>
              <CardDescription className="text-black font-semibold">
                Your invitation has been accepted successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <User className="w-5 h-5 text-black" />
                <span className="text-black font-bold">{invitation.email}</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <Building2 className="w-5 h-5 text-black" />
                <span className="text-black font-bold">{invitation.workspaceName}</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5 text-black" />
                <Badge variant="outline" className="text-black font-bold">
                  {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                </Badge>
              </div>

              {invitation.message && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-black font-bold italic">"{invitation.message}"</p>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-black mb-2">What you can do:</h3>
                <ul className="text-sm text-black font-bold space-y-1">
                  {invitation.role === 'client' ? (
                    <>
                      <li>• View your loan files and progress</li>
                      <li>• Access important documents</li>
                      <li>• Communicate with your advisor</li>
                      <li>• Track application status</li>
                    </>
                  ) : invitation.role === 'staff' ? (
                    <>
                      <li>• Manage client information</li>
                      <li>• Process loan applications</li>
                      <li>• Upload and organize documents</li>
                      <li>• Track workflow progress</li>
                    </>
                  ) : (
                    <>
                      <li>• Collaborate on loan processing</li>
                      <li>• Access shared resources</li>
                      <li>• Communicate with the team</li>
                      <li>• Review loan applications</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-black font-bold">
                <Clock className="w-4 h-4 text-black" />
                <span>Redirecting you to your portal in 3 seconds...</span>
              </div>

              <Button
                onClick={() => {
                  if (invitation.role === 'client') {
                    router.push('/portal');
                  } else {
                    router.push('/app');
                  }
                }}
                className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white font-bold"
              >
                Continue to Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-black animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Loading...</h1>
          <p className="text-black font-bold">Please wait...</p>
        </div>
      </div>
    }>
      <AcceptInvitationContent />
    </Suspense>
  );
}