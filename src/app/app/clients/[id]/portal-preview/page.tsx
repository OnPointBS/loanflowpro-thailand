"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
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
  FileText,
  MessageSquare,
  Settings,
  User,
  Building2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ClientPortalPreviewPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { workspace } = useWorkspace();
  const { user, canInviteUsers } = useAuth();
  const [showPreview, setShowPreview] = useState(true);

  const client = useQuery(api.clients.getClient, { clientId });
  const loanFiles = useQuery(api.loanFiles.getLoanFilesByClient, { clientId });

  // If user doesn't have permission, redirect
  if (!canInviteUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to preview client portals.</p>
          <Link href="/app/clients">
            <Button>Back to Clients</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!client) {
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
                  Client Portal Preview
                </h1>
                <p className="text-sm text-yellow-700">
                  You are previewing the client portal as it would appear to {client.name}
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
              <Link href={`/app/clients/${clientId}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            {/* Client Portal Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {workspace?.name?.charAt(0) || "L"}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {workspace?.name || "LoanFlow Pro"}
                      </h1>
                      <p className="text-gray-600">Client Portal</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Welcome back,</p>
                    <p className="font-medium text-gray-900">{client.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Portal Content */}
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
                          Welcome to Your Client Portal
                        </h2>
                        <p className="text-gray-600">
                          You now have access to your loan information and can communicate directly with our team. 
                          Use the navigation below to explore your account.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Loan Files Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Your Loan Files
                    </CardTitle>
                    <CardDescription>
                      Track the progress of your loan applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loanFiles === undefined ? (
                      <LoadingSpinner size="sm" />
                    ) : loanFiles.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No loan files yet</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Your loan files will appear here once they are created
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {loanFiles.map((loanFile) => (
                          <div key={loanFile._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-medium text-gray-900">{loanFile.type}</h3>
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
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  ${loanFile.amount?.toLocaleString()}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(loanFile.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks you can perform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto p-4 justify-start">
                        <FileText className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">View Documents</div>
                          <div className="text-sm text-gray-500">Access your loan documents</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start">
                        <MessageSquare className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Send Message</div>
                          <div className="text-sm text-gray-500">Contact your loan officer</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start">
                        <Settings className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Account Settings</div>
                          <div className="text-sm text-gray-500">Update your information</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start">
                        <ExternalLink className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Download App</div>
                          <div className="text-sm text-gray-500">Get the mobile app</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Client Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Your Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">{client.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{client.email}</p>
                    </div>
                    {client.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-sm text-gray-900">{client.phone}</p>
                      </div>
                    )}
                    {client.profile.company && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company</label>
                        <p className="text-sm text-gray-900">{client.profile.company}</p>
                      </div>
                    )}
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
                      Call Us
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Us
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
                          This is a preview. The client needs to be invited to access their actual portal.
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
