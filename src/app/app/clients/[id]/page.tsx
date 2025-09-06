"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Building2,
  MapPin,
  Calendar,
  FileText,
  ExternalLink,
  User,
  Shield,
  Send,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ClientProfilePage() {
  const params = useParams();
  const clientId = params.id as string;
  const { workspace } = useWorkspace();
  const { user, canInviteUsers } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const client = useQuery(api.clients.getClient, { clientId });
  const loanFiles = useQuery(api.loanFiles.getLoanFilesByClient, { clientId });
  
  const deleteClient = useMutation(api.clients.deleteClient);
  const sendInvitation = useMutation(api.userInvitations.sendUserInvitation);

  const handleDeleteClient = async () => {
    if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await deleteClient({ clientId });
        // Redirect to clients list
        window.location.href = "/app/clients";
      } catch (error) {
        console.error("Error deleting client:", error);
        setIsDeleting(false);
      }
    }
  };

  const handleSendClientInvitation = async () => {
    if (!workspace || !client || !user) return;
    
    try {
      await sendInvitation({
        email: client.email,
        role: "client",
        invitationType: "client",
        workspaceId: workspace._id,
        invitedBy: user._id,
        message: `Welcome to your client portal! You can now access your loan information and communicate with our team.`,
      });
      alert("Client invitation sent successfully!");
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("Failed to send invitation. Please try again.");
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/app/clients">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Clients
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                <p className="text-gray-600">Client Profile</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClient}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Client Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Client Information
                </CardTitle>
                <CardDescription>
                  Basic information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg font-medium text-gray-900">{client.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg font-medium text-gray-900">{client.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-lg font-medium text-gray-900">{client.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-lg font-medium text-gray-900">{client.profile.company || "Not provided"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-lg font-medium text-gray-900">{client.address || "Not provided"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="text-lg font-medium text-gray-900">{client.notes || "No notes"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loan Files */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Loan Files
                </CardTitle>
                <CardDescription>
                  All loan files associated with this client
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loanFiles === undefined ? (
                  <LoadingSpinner size="sm" />
                ) : loanFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No loan files yet</p>
                    <Link href="/app/loan-files/new">
                      <Button className="mt-4" size="sm">
                        Create First Loan File
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {loanFiles.map((loanFile) => (
                      <div key={loanFile._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium">{loanFile.type}</p>
                          <p className="text-sm text-gray-500">${loanFile.amount?.toLocaleString()}</p>
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
                          <Link href={`/app/loan-files/${loanFile._id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Status & Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        client.status === "active" ? "success" :
                        client.status === "inactive" ? "default" : "warning"
                      }
                      size="lg"
                    >
                      {client.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm text-gray-900">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900">
                    {new Date(client.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Client Portal Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Client Portal Access
                </CardTitle>
                <CardDescription>
                  Manage client's portal access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {canInviteUsers ? (
                  <>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Portal Preview Available
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            As an admin, you can preview what the client sees in their portal.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Link href={`/app/clients/${clientId}/portal-preview`}>
                        <Button className="w-full" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Client Portal
                        </Button>
                      </Link>
                      
                      <Button 
                        className="w-full" 
                        onClick={handleSendClientInvitation}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Portal Invitation
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                      You don't have permission to manage client portal access.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Loan Files</span>
                  <span className="font-medium">{loanFiles?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <span className="font-medium">
                    ${loanFiles?.reduce((sum, file) => sum + (file.amount || 0), 0).toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Active Files</span>
                  <span className="font-medium">
                    {loanFiles?.filter(file => file.status === "active" || file.status === "in_progress").length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
