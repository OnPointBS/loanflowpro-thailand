"use client";

import { useAuth } from "@/contexts/AuthContext";
import { SeatManagement } from "@/components/SeatManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, Crown, Shield, Handshake, AlertTriangle } from "lucide-react";

export default function SeatsPage() {
  const { user, workspace, canManageBilling } = useAuth();

  if (!user || !workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access this page</p>
        </div>
      </div>
    );
  }

  if (!canManageBilling) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">You don&apos;t have permission to manage seats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Seat Management
          </h1>
          <p className="text-gray-600">
            Manage user seats and plan limits for your workspace
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Plan Overview */}
          <div className="lg:col-span-1">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2" />
                  Current Plan
                </CardTitle>
                <CardDescription>
                  Your workspace subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                <div className="text-2xl font-bold text-[#D4AF37] mb-1">
                  {workspace.subscriptionTier}
                </div>
                <div className="text-sm text-gray-600">
                  {workspace.subscription?.seats || 1} seats included
                </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className="text-green-600 font-medium">
                      {workspace.subscription?.status || 'active'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium">
                      {workspace.subscription?.plan || workspace.subscriptionTier}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role Limits */}
            <Card variant="glass" className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Role Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Advisors</p>
                    <p className="text-xs text-gray-500">Unlimited (workspace owners)</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Staff</p>
                    <p className="text-xs text-gray-500">Counts toward seat limit</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Handshake className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Partners</p>
                    <p className="text-xs text-gray-500">Counts toward seat limit</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Clients</p>
                    <p className="text-xs text-gray-500">Unlimited (no seat cost)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Future Billing */}
            <Card variant="glass" className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Future Billing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Stripe integration coming soon</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Per-seat billing for staff & partners</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Automatic seat management</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Usage alerts and limits</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seat Management */}
          <div className="lg:col-span-3">
            <SeatManagement 
              workspaceId={workspace.id} 
              canManageBilling={canManageBilling} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
