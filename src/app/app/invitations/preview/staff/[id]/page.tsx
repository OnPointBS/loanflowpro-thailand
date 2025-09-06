"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Shield,
  Building2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  BarChart3,
  UserCheck,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function StaffPortalPreviewPage() {
  const params = useParams();
  const invitationId = params.id as string;
  const { workspace } = useWorkspace();
  const { user, canInviteUsers } = useAuth();
  const [showPreview, setShowPreview] = useState(true);

  const invitation = useQuery(api.userInvitations.getInvitation, { invitationId });
  const clients = useQuery(api.clients.getClients, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );
  const loanFiles = useQuery(api.loanFiles.getLoanFiles, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );

  // If user doesn't have permission, redirect
  if (!canInviteUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to preview staff portals.</p>
          <Link href="/app/invitations">
            <Button>Back to Invitations</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!invitation || !workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Admin Preview Header */}
      <div className="bg-yellow-50 border-b border-yellow-200 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <h1 className="text-lg font-semibold text-yellow-900">
                  Staff Portal Preview
                </h1>
                <p className="text-sm text-yellow-700">
                  You are previewing the staff portal as it would appear to {invitation.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Show Preview
                  </>
                )}
              </Button>
              <Link href="/app/invitations">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Invitations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            {/* Staff Portal Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {workspace.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {workspace.name}
                      </h1>
                      <p className="text-gray-600">Staff Portal</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Welcome back,</p>
                    <p className="font-medium text-gray-900">{invitation.email}</p>
                    <Badge className="mt-1 bg-green-100 text-green-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Staff Member
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Portal Content */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Welcome Message */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                          Welcome to Your Staff Portal
                        </h2>
                        <p className="text-gray-600">
                          You now have access to manage clients, loan files, and workflows. 
                          Use the tools below to efficiently process loan applications and support clients.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Clients</p>
                          <p className="text-2xl font-bold text-gray-900">{clients?.length || 0}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Active Loans</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {loanFiles?.filter(file => file.status === "active" || file.status === "in_progress").length || 0}
                          </p>
                        </div>
                        <FileText className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Pending Tasks</p>
                          <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                        <ClipboardList className="w-8 h-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">This Month</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${loanFiles?.reduce((sum, file) => sum + (file.amount || 0), 0).toLocaleString() || 0}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Latest updates and tasks in your workspace
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loanFiles && loanFiles.length > 0 ? (
                        loanFiles.slice(0, 5).map((loanFile) => (
                          <div key={loanFile._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{loanFile.type}</p>
                                <p className="text-sm text-gray-500">
                                  ${loanFile.amount?.toLocaleString()} • {loanFile.status}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                loanFile.status === "approved" ? "success" :
                                loanFile.status === "declined" ? "destructive" :
                                loanFile.status === "funded" ? "success" : "default"
                              }
                              size="sm"
                            >
                              {loanFile.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No recent activity</p>
                          <p className="text-sm text-gray-400 mt-2">
                            Activity will appear here as you work with clients and loan files
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks you can perform as a staff member
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto p-4 justify-start">
                        <Users className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Manage Clients</div>
                          <div className="text-sm text-gray-500">View and edit client information</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start">
                        <FileText className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Process Loans</div>
                          <div className="text-sm text-gray-500">Review and approve loan applications</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start">
                        <MessageSquare className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Client Communication</div>
                          <div className="text-sm text-gray-500">Send messages and updates</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start">
                        <Settings className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Workspace Settings</div>
                          <div className="text-sm text-gray-500">Configure your workspace</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Staff Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Staff Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{invitation.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <p className="text-sm text-gray-900">Staff Member</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Permissions</label>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">• Manage clients</p>
                        <p className="text-sm text-gray-900">• Process loan files</p>
                        <p className="text-sm text-gray-900">• Send messages</p>
                        <p className="text-sm text-gray-900">• View reports</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Workspace Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="w-5 h-5 mr-2" />
                      Workspace
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">{workspace.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Plan</label>
                      <p className="text-sm text-gray-900">{workspace.subscriptionTier}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <Badge className="bg-green-100 text-green-800">
                        {workspace.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Support */}
                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Admin
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Admin
                    </Button>
                  </CardContent>
                </Card>

                {/* Portal Access Notice */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Portal Access
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          This is a preview. The staff member needs to accept their invitation to access their actual portal.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
