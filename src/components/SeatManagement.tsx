"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Crown, 
  Shield, 
  Handshake,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SeatManagementProps {
  workspaceId: Id<"workspaces">;
  canManageBilling: boolean;
}

interface User {
  _id: Id<"users">;
  email: string;
  role: "advisor" | "staff" | "client" | "partner";
  status: "active" | "pending" | "suspended";
  profile: {
    firstName: string;
    lastName: string;
  };
  createdAt: number;
}

interface Workspace {
  _id: Id<"workspaces">;
  name: string;
  subscriptionTier: "solo" | "team" | "enterprise";
  subscription: {
    plan: "solo" | "team" | "enterprise";
    seats: number;
    status: "active" | "canceled" | "past_due";
  };
}

export function SeatManagement({ workspaceId, canManageBilling }: SeatManagementProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { workspace: workspaceContext } = useWorkspace();

  // Use workspace from context
  const workspace = workspaceContext;
  
  // Fetch users using workspace ID from context
  const users = useQuery(api.auth.getWorkspaceUsers, { 
    workspaceId: workspace?._id as any 
  });

  // Calculate seat usage
  const activeUsers = users?.filter(user => user.status === "active") || [];
  const seatUsage = {
    total: workspace?.subscription?.seats || 1,
    used: activeUsers.length,
    available: (workspace?.subscription?.seats || 1) - activeUsers.length,
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "advisor":
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case "staff":
        return <Shield className="w-4 h-4 text-green-600" />;
      case "partner":
        return <Handshake className="w-4 h-4 text-purple-600" />;
      case "client":
        return <Users className="w-4 h-4 text-blue-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "advisor":
        return "bg-yellow-100 text-yellow-800";
      case "staff":
        return "bg-green-100 text-green-800";
      case "partner":
        return "bg-purple-100 text-purple-800";
      case "client":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "suspended":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getSeatUsageColor = () => {
    const usagePercentage = (seatUsage.used / seatUsage.total) * 100;
    if (usagePercentage >= 90) return "text-red-600";
    if (usagePercentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const getSeatUsageBarColor = () => {
    const usagePercentage = (seatUsage.used / seatUsage.total) * 100;
    if (usagePercentage >= 90) return "bg-red-500";
    if (usagePercentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleUpgrade = () => {
    // This would integrate with Stripe billing
    console.log("Upgrade to more seats");
    setIsUpgrading(true);
    // Simulate upgrade process
    setTimeout(() => setIsUpgrading(false), 2000);
  };

  if (!workspace || !users) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading seat information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seat Usage Overview */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Seat Usage
          </CardTitle>
          <CardDescription>
            Current seat usage and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{seatUsage.used}</p>
                <p className="text-sm text-gray-600">Seats Used</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{seatUsage.available}</p>
                <p className="text-sm text-gray-600">Seats Available</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{seatUsage.total}</p>
                <p className="text-sm text-gray-600">Total Seats</p>
              </div>
            </div>

            {/* Usage Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Usage</span>
                <span className={cn("font-medium", getSeatUsageColor())}>
                  {seatUsage.used} / {seatUsage.total} seats
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={cn("h-2 rounded-full transition-all duration-300", getSeatUsageBarColor())}
                  style={{ width: `${(seatUsage.used / seatUsage.total) * 100}%` }}
                />
              </div>
            </div>

            {/* Upgrade Button */}
            {canManageBilling && seatUsage.available <= 1 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Running low on seats
                      </p>
                      <p className="text-xs text-yellow-700">
                        You have {seatUsage.available} seat(s) remaining
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUpgrade}
                    disabled={isUpgrading}
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                  >
                    {isUpgrading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    ) : (
                      <UserPlus className="w-4 h-4 mr-2" />
                    )}
                    Upgrade Seats
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Users */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Current Users</CardTitle>
          <CardDescription>
            All users in your workspace and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.profile.firstName} {user.profile.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(user.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(user.status)}
                        <span>{user.status}</span>
                      </div>
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Joined {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Information */}
      {canManageBilling && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>
              Current plan and billing details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {workspace.subscriptionTier} Plan
                  </p>
                  <p className="text-sm text-gray-600">
                    {workspace.subscription?.seats || 1} seats included
                  </p>
                </div>
                <Badge variant="info">
                  {workspace.subscription?.status || "active"}
                </Badge>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Future Stripe Integration:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Per-seat billing for additional users</li>
                  <li>• Automatic seat management</li>
                  <li>• Usage tracking and alerts</li>
                  <li>• Flexible upgrade/downgrade options</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
