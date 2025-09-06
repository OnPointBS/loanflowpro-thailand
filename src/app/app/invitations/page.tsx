"use client";

import { useAuth } from "@/contexts/AuthContext";
import { UserInvitationManager } from "@/components/UserInvitationManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Mail, Clock, CheckCircle, Shield, Handshake } from "lucide-react";

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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Invitations
          </h1>
          <p className="text-gray-600">
            Invite clients, staff members, and partners to your workspace
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* User Type Overview */}
          <div className="lg:col-span-1">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Types
                </CardTitle>
                <CardDescription>
                  Different roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Clients</p>
                      <p className="text-xs text-gray-500">Access loan files & documents</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Staff</p>
                      <p className="text-xs text-gray-500">Manage clients & workflows</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Handshake className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Partners</p>
                      <p className="text-xs text-gray-500">Collaborate on loan processing</p>
                    </div>
                  </div>
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
                  <p>Partners can&apos;t be invited - only clients and staff</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>You can resend or cancel invitations anytime</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Future: Stripe billing will charge per seat</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invitation Manager */}
          <div className="lg:col-span-3">
            <UserInvitationManager 
              workspaceId={workspace.id} 
              canInvite={canInviteUsers} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
