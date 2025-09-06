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
  Handshake,
  FileText,
  MessageSquare,
  Settings,
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
  Users,
  Shield,
  Target,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PartnerPortalPreviewPage() {
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
          <p className="text-gray-600 mb-4">You don't have permission to preview partner portals.</p>
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
                  Partner Portal Preview
                </h1>
                <p className="text-sm text-yellow-700">
                  You are previewing the partner portal as it would appear to {invitation.email}
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
            {/* Partner Portal Header */}
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
                      <p className="text-gray-600">Partner Portal</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Welcome back,</p>
                    <p className="font-medium text-gray-900">{invitation.email}</p>
                    <Badge className="mt-1 bg-purple-100 text-purple-800">
                      <Handshake className="w-3 h-3 mr-1" />
                      Partner
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Portal Content */}
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
                          Welcome to Your Partner Portal
                        </h2>
                        <p className="text-gray-600">
                          You now have access to collaborate on loan processing and support our mutual clients. 
                          Use the tools below to efficiently work together on loan applications and provide excellent service.
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
                          <p className="text-sm text-gray-600">Shared Clients</p>
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
                          <p className="text-sm text-gray-600">Collaborations</p>
                          <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                        <Handshake className="w-8 h-8 text-purple-600" />
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
                        <TrendingUp className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Collaboration Opportunities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Collaboration Opportunities
                    </CardTitle>
                    <CardDescription>
                      Current projects and opportunities for partnership
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loanFiles && loanFiles.length > 0 ? (
                        loanFiles.slice(0, 3).map((loanFile) => (
                          <div key={loanFile._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-medium">{loanFile.type}</p>
                                <p className="text-sm text-gray-500">
                                  ${loanFile.amount?.toLocaleString()} • {loanFile.status}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Collaboration opportunity available
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
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
                              <Button size="sm" variant="outline">
                                <Handshake className="w-4 h-4 mr-1" />
                                Collaborate
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No collaboration opportunities</p>
                          <p className="text-sm text-gray-400 mt-2">
                            Opportunities will appear here as new projects become available
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
                      Common tasks you can perform as a partner
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto p-4 justify-start">
                        <Handshake className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Collaborate on Loans</div>
                          <div className="text-sm text-gray-500">Work together on loan processing</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start">
                        <Users className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">View Shared Clients</div>
                          <div className="text-sm text-gray-500">Access mutual client information</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start">
                        <MessageSquare className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Partner Communication</div>
                          <div className="text-sm text-gray-500">Message the main team</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start">
                        <BarChart3 className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">View Reports</div>
                          <div className="text-sm text-gray-500">Access shared analytics</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Partner Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Handshake className="w-5 h-5 mr-2" />
                      Partner Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{invitation.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <p className="text-sm text-gray-900">Partner</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Permissions</label>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">• View shared clients</p>
                        <p className="text-sm text-gray-900">• Collaborate on loans</p>
                        <p className="text-sm text-gray-900">• Send messages</p>
                        <p className="text-sm text-gray-900">• View shared reports</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Partnership Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="w-5 h-5 mr-2" />
                      Partnership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Partner Since</label>
                      <p className="text-sm text-gray-900">
                        {new Date(invitation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Collaboration Level</label>
                      <p className="text-sm text-gray-900">Full Access</p>
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
                      Contact Team
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Partner Manager
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Support
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
                          This is a preview. The partner needs to accept their invitation to access their actual portal.
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
