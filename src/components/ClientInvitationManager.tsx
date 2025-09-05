"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { 
  Mail, 
  Send, 
  X, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  Plus
} from "lucide-react";

interface ClientInvitationManagerProps {
  workspaceId: string;
  canInvite: boolean;
}

export function ClientInvitationManager({ workspaceId, canInvite }: ClientInvitationManagerProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const sendInvitation = useMutation(api.clientInvitations.sendClientInvitation);
  const cancelInvitation = useMutation(api.clientInvitations.cancelInvitation);
  const resendInvitation = useMutation(api.clientInvitations.resendInvitation);

  const pendingInvitations = useQuery(api.clientInvitations.getPendingInvitations, {
    workspaceId: workspaceId as Id<"workspaces">,
  });

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canInvite) return;

    setError("");
    setIsSending(true);

    try {
      await sendInvitation({
        email,
        workspaceId: workspaceId as Id<"workspaces">,
        invitedBy: "current-user-id", // In real app, get from auth context
        message: message.trim() || undefined,
      });

      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setIsSending(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await cancelInvitation({ invitationId: invitationId as Id<"clientInvitations"> });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel invitation");
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      await resendInvitation({ invitationId: invitationId as Id<"clientInvitations"> });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend invitation");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "expired":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "accepted":
        return "success";
      case "expired":
        return "error";
      default:
        return "info";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = (expiresAt: number) => {
    return expiresAt < Date.now();
  };

  if (!canInvite) {
    return (
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Client Invitations
          </CardTitle>
          <CardDescription>
            You don&apos;t have permission to invite clients
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Send Invitation Form */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Invite Client
          </CardTitle>
          <CardDescription>
            Send an invitation to a client to access the portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendInvitation} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Client email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              required
              disabled={isSending}
            />

            <Input
              label="Personal message (optional)"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to the invitation"
              disabled={isSending}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isSending}
              disabled={!email || isSending}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Pending Invitations
          </CardTitle>
          <CardDescription>
            Manage sent invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingInvitations === undefined ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : pendingInvitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No pending invitations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(invitation.status)}
                      <span className="font-medium">{invitation.email}</span>
                      <Badge variant={getStatusColor(invitation.status)}>
                        {invitation.status}
                      </Badge>
                      {isExpired(invitation.expiresAt) && (
                        <Badge variant="error">Expired</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Sent {formatDate(invitation.createdAt)}
                      {invitation.message && (
                        <span className="ml-2 italic">• &quot;{invitation.message}&quot;</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResendInvitation(invitation._id)}
                      disabled={isExpired(invitation.expiresAt)}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Resend
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelInvitation(invitation._id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
