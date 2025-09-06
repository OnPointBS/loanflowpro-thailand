"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Building2,
  User,
  ArrowRight
} from "lucide-react";

export default function ClientPortalContent() {
  const { user, workspace, logout } = useAuth();

  if (!user || !workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-black font-bold">Please log in to access the client portal</p>
        </div>
      </div>
    );
  }

  // Mock data - in real app, fetch from Convex
  const loanFiles = [
    {
      id: "1",
      type: "SBA 7(a)",
      status: "in_progress",
      progress: 65,
      client: "John Doe",
      createdAt: "2024-01-15",
      lastActivity: "2 days ago",
    },
    {
      id: "2", 
      type: "Business LOC",
      status: "pending",
      progress: 25,
      client: "Jane Smith",
      createdAt: "2024-01-20",
      lastActivity: "1 week ago",
    },
  ];

  const documents = [
    {
      id: "1",
      name: "Business Plan.pdf",
      type: "pdf",
      uploadedAt: "2024-01-15",
      status: "processed",
    },
    {
      id: "2",
      name: "Financial Statements.xlsx",
      type: "excel",
      uploadedAt: "2024-01-18",
      status: "processing",
    },
  ];

  const messages = [
    {
      id: "1",
      from: "Sarah Johnson",
      subject: "Additional documents needed",
      preview: "Hi John, we need your latest bank statements...",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: "2",
      from: "Mike Wilson",
      subject: "Application status update",
      preview: "Great news! Your application has been approved...",
      time: "1 day ago",
      unread: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "warning";
      case "pending":
        return "info";
      case "rejected":
        return "error";
      default:
        return "info";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-black" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-black" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-black" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-black" />;
      default:
        return <Clock className="w-4 h-4 text-black" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">
                  {workspace.name} - Client Portal
                </h1>
                <p className="text-sm text-black font-semibold">Welcome, {user.profile.firstName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/portal/messages'}
                className="flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </Button>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-black" />
                <span className="text-sm text-black font-bold">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loan Files - Full Width */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center text-black font-bold">
              <FileText className="w-5 h-5 mr-2 text-black" />
              Your Loan Files
            </CardTitle>
            <CardDescription className="text-black font-semibold">
              Track the progress of your loan applications and complete required tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loanFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.location.href = `/portal/loan-file/${file.id}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(file.status)}
                      <div>
                        <span className="text-lg font-bold text-black">{file.type}</span>
                        <Badge variant={getStatusColor(file.status)} className="ml-2">
                          {file.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-black">
                        {file.progress}% complete
                      </span>
                      <div className="text-sm text-gray-600">
                        {file.progress === 100 ? 'Ready for review' : 'In progress'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-[#D4AF37] h-3 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-black font-semibold">
                    <span>Created {file.createdAt}</span>
                    <span>Last activity {file.lastActivity}</span>
                    <div className="flex items-center space-x-2 text-[#D4AF37]">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
