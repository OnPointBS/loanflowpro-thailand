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
  User
} from "lucide-react";

export default function ClientPortalPage() {
  const { user, workspace, logout } = useAuth();

  if (!user || !workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access the client portal</p>
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
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
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
                <h1 className="text-xl font-semibold text-gray-900">
                  {workspace.name} - Client Portal
                </h1>
                <p className="text-sm text-gray-500">Welcome, {user.profile.firstName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Loan Files */}
          <div className="lg:col-span-2">
            <Card variant="glass">
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
                <div className="space-y-4">
                  {loanFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(file.status)}
                          <span className="font-medium">{file.type}</span>
                          <Badge variant={getStatusColor(file.status)}>
                            {file.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {file.progress}% complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Created {file.createdAt}</span>
                        <span>Last activity {file.lastActivity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2" />
                  Recent Documents
                </CardTitle>
                <CardDescription>
                  Your uploaded documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">{doc.name}</span>
                      </div>
                      <Badge variant={doc.status === "processed" ? "success" : "warning"}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Recent Messages
                </CardTitle>
                <CardDescription>
                  Communication with your advisor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg border ${
                        message.unread
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{message.from}</span>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500">{message.preview}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
