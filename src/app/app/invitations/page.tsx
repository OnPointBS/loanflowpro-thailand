"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ClientInvitationManager } from "@/components/ClientInvitationManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Mail, Clock, CheckCircle } from "lucide-react";

export default function InvitationsPage() {
  const { user, workspace, canInviteUsers } = useAuth();

  if (!user || !workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access this page</p>
        </div>
      </div>
    );
  }

  if (!canInviteUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">You don&apos;t have permission to manage invitations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Client Invitations
          </h1>
          <p className="text-gray-600">
            Invite clients to access their portal and manage invitations
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Invitation Stats */}
          <div className="lg:col-span-1">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Invitation Stats
                </CardTitle>
                <CardDescription>
                  Overview of your invitations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Sent</span>
                  </div>
                  <Badge variant="info">0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <Badge variant="warning">0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Accepted</span>
                  </div>
                  <Badge variant="success">0</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card variant="glass" className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Invitations expire after 7 days</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Add a personal message to make it more welcoming</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Clients can access their loan files and documents</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>You can resend or cancel invitations anytime</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invitation Manager */}
          <div className="lg:col-span-2">
            <ClientInvitationManager 
              workspaceId={workspace.id} 
              canInvite={canInviteUsers} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
