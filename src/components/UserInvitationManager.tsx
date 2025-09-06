"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { 
  Users, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Send, 
  RefreshCw, 
  X,
  UserPlus,
  Shield,
  Handshake,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserInvitation {
  _id: Id<"userInvitations">;
  email: string;
  invitationType: "client" | "staff" | "partner";
  role: "client" | "staff" | "partner";
  status: "pending" | "accepted" | "expired";
  message?: string;
  permissions?: string[];
  createdAt: number;
  expiresAt: number;
  acceptedAt?: number;
}

interface UserInvitationManagerProps {
  workspaceId: Id<"workspaces">;
  canInvite: boolean;
}

export function UserInvitationManager({ workspaceId, canInvite }: UserInvitationManagerProps) {
  const [selectedTab, setSelectedTab] = useState<"all" | "client" | "staff" | "partner">("all");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    invitationType: "client" as "client" | "staff" | "partner",
    role: "client" as "client" | "staff" | "partner",
    message: "",
    permissions: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch invitations
  const allInvitations = useQuery(api.userInvitations.getPendingInvitations, { workspaceId });
  const clientInvitations = useQuery(api.userInvitations.getInvitationsByType, { 
    workspaceId, 
    invitationType: "client" 
  });
  const staffInvitations = useQuery(api.userInvitations.getInvitationsByType, { 
    workspaceId, 
    invitationType: "staff" 
  });
  const partnerInvitations = useQuery(api.userInvitations.getInvitationsByType, { 
    workspaceId, 
    invitationType: "partner" 
  });

  // Mutations
  const sendInvitation = useMutation(api.userInvitations.sendUserInvitation);
  const sendEmail = useMutation(api.userInvitations.sendInvitationEmail);
  const cancelInvitation = useMutation(api.userInvitations.cancelInvitation);
  const resendInvitation = useMutation(api.userInvitations.resendInvitation);

  // Get current invitations based on selected tab
  const getCurrentInvitations = (): UserInvitation[] => {
    switch (selectedTab) {
      case "client":
        return clientInvitations || [];
      case "staff":
        return staffInvitations || [];
      case "partner":
        return partnerInvitations || [];
      default:
        return allInvitations || [];
    }
  };

  // Calculate stats
  const invitations = getCurrentInvitations();
  const stats = {
    total: invitations.length,
    pending: invitations.filter(inv => inv.status === "pending").length,
    accepted: invitations.filter(inv => inv.status === "accepted").length,
    expired: invitations.filter(inv => inv.status === "expired").length,
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.email || !canInvite) return;

    setIsSubmitting(true);
    try {
      const result = await sendInvitation({
        email: inviteForm.email,
        workspaceId,
        invitedBy: "temp" as Id<"users">, // This should be the current user ID
        invitationType: inviteForm.invitationType,
        role: inviteForm.role,
        message: inviteForm.message || undefined,
        permissions: inviteForm.permissions.length > 0 ? inviteForm.permissions : undefined,
      });

      if (result.success) {
        setInviteForm({
          email: "",
          invitationType: "client",
          role: "client",
          message: "",
          permissions: [],
        });
        setShowInviteForm(false);
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendInvitation = async (invitationId: Id<"userInvitations">) => {
    try {
      await resendInvitation({ invitationId });
      await sendEmail({ invitationId });
    } catch (error) {
      console.error("Error resending invitation:", error);
    }
  };

  const handleCancelInvitation = async (invitationId: Id<"userInvitations">) => {
    try {
      await cancelInvitation({ invitationId });
    } catch (error) {
      console.error("Error canceling invitation:", error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "client":
        return <Users className="w-4 h-4" />;
      case "staff":
        return <Shield className="w-4 h-4" />;
      case "partner":
        return <Handshake className="w-4 h-4" />;
      default:
        return <UserPlus className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "client":
        return "bg-blue-100 text-blue-800";
      case "staff":
        return "bg-green-100 text-green-800";
      case "partner":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "expired":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const isExpired = (expiresAt: number) => {
    return expiresAt < Date.now();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Invitations</h2>
          <p className="text-gray-600">Manage invitations for clients, staff, and partners</p>
        </div>
        {canInvite && (
          <Button
            onClick={() => setShowInviteForm(true)}
            className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invitations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite Form Modal */}
      {showInviteForm && (
        <Card variant="glass" className="border-2 border-[#D4AF37]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Invite New User</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInviteForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>
              Send an invitation to a client, staff member, or partner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendInvitation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Type
                  </label>
                  <Select
                    value={inviteForm.invitationType}
                    onValueChange={(value: "client" | "staff" | "partner") => {
                      setInviteForm({ 
                        ...inviteForm, 
                        invitationType: value,
                        role: value
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Client
                        </div>
                      </SelectItem>
                      <SelectItem value="staff">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          Staff Member
                        </div>
                      </SelectItem>
                      <SelectItem value="partner">
                        <div className="flex items-center">
                          <Handshake className="w-4 h-4 mr-2" />
                          Partner
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Message (Optional)
                </label>
                <Textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  placeholder="Add a personal message to make the invitation more welcoming..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !inviteForm.email}
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Invitation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Invitations List */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Invitations</CardTitle>
          <CardDescription>
            Manage all pending and completed invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No invitations found</p>
              <p className="text-sm text-gray-500">
                {selectedTab === "all" 
                  ? "Start by inviting users to your workspace"
                  : `No ${selectedTab} invitations found`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(invitation.role)}
                      <Badge className={getRoleColor(invitation.role)}>
                        {invitation.role}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900">{invitation.email}</p>
                      <p className="text-sm text-gray-500">
                        Invited {formatDate(invitation.createdAt)}
                        {invitation.message && (
                          <span className="ml-2 text-gray-400">• {invitation.message}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(invitation.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(invitation.status)}
                        <span>{invitation.status}</span>
                      </div>
                    </Badge>

                    {invitation.status === "pending" && (
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResendInvitation(invitation._id)}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelInvitation(invitation._id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
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
