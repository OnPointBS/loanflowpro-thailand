"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  FileText, 
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  User,
  MessageSquare,
  Upload,
  Download,
  Eye,
  Calendar,
  Target,
  Zap
} from "lucide-react";

export default function LoanFileDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user, workspace, logout } = useAuth();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  if (!user || !workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-black font-bold">Please log in to access the client portal</p>
        </div>
      </div>
    );
  }

  // Mock data - in real app, fetch from Convex based on loan file ID
  const loanFile = {
    id: params.id,
    type: "SBA 7(a)",
    status: "in_progress",
    progress: 65,
    client: "John Doe",
    createdAt: "2024-01-15",
    lastActivity: "2 days ago",
    description: "Small Business Administration 7(a) loan for business expansion",
    amount: "$150,000",
    term: "10 years",
    interestRate: "6.5%"
  };

  const tasks = [
    {
      id: "1",
      title: "Complete Business Plan",
      description: "Upload your comprehensive business plan including market analysis, financial projections, and growth strategy.",
      status: "completed",
      dueDate: "2024-01-20",
      completedAt: "2024-01-18",
      priority: "high",
      documents: [
        { name: "Business Plan Template.pdf", type: "pdf", uploaded: true },
        { name: "Market Analysis.xlsx", type: "excel", uploaded: true }
      ]
    },
    {
      id: "2",
      title: "Financial Statements",
      description: "Provide last 3 years of financial statements and current year-to-date statements.",
      status: "in_progress",
      dueDate: "2024-01-25",
      priority: "high",
      documents: [
        { name: "2023 Financial Statements.pdf", type: "pdf", uploaded: true },
        { name: "2022 Financial Statements.pdf", type: "pdf", uploaded: true },
        { name: "2024 YTD Statements.pdf", type: "pdf", uploaded: false }
      ]
    },
    {
      id: "3",
      title: "Personal Financial Statement",
      description: "Complete and submit your personal financial statement form.",
      status: "pending",
      dueDate: "2024-01-30",
      priority: "medium",
      documents: [
        { name: "Personal Financial Statement Form.pdf", type: "pdf", uploaded: false }
      ]
    },
    {
      id: "4",
      title: "Tax Returns",
      description: "Provide last 3 years of personal and business tax returns.",
      status: "pending",
      dueDate: "2024-02-05",
      priority: "high",
      documents: [
        { name: "2023 Tax Return.pdf", type: "pdf", uploaded: false },
        { name: "2022 Tax Return.pdf", type: "pdf", uploaded: false },
        { name: "2021 Tax Return.pdf", type: "pdf", uploaded: false }
      ]
    },
    {
      id: "5",
      title: "Bank Statements",
      description: "Provide last 3 months of business bank statements.",
      status: "pending",
      dueDate: "2024-02-10",
      priority: "medium",
      documents: [
        { name: "December 2023 Bank Statement.pdf", type: "pdf", uploaded: false },
        { name: "January 2024 Bank Statement.pdf", type: "pdf", uploaded: false },
        { name: "February 2024 Bank Statement.pdf", type: "pdf", uploaded: false }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "warning";
      case "pending":
        return "info";
      default:
        return "info";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTaskComplete = (taskId: string) => {
    // In real app, call Convex mutation to mark task as complete
    console.log(`Marking task ${taskId} as complete`);
    // Update local state or refetch data
  };

  const handleDocumentUpload = (taskId: string, documentName: string) => {
    // In real app, handle file upload to Convex
    console.log(`Uploading document ${documentName} for task ${taskId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">
                  {loanFile.type} - {workspace.name}
                </h1>
                <p className="text-sm text-black font-semibold">Loan Application Details</p>
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
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Loan File Info */}
          <div className="lg:col-span-1">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-black font-bold">Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-sm font-bold text-black">{loanFile.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Term</span>
                  <span className="text-sm font-bold text-black">{loanFile.term}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interest Rate</span>
                  <span className="text-sm font-bold text-black">{loanFile.interestRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={getStatusColor(loanFile.status)}>
                    {loanFile.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-bold text-black">{loanFile.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loanFile.progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card variant="glass" className="mt-6">
              <CardHeader>
                <CardTitle className="text-black font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => window.location.href = '/portal/messages'}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Advisor
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => window.location.href = '/portal/documents'}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => window.location.href = '/portal/documents'}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Forms
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tasks */}
          <div className="lg:col-span-2">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center text-black font-bold">
                  <Target className="w-5 h-5 mr-2 text-black" />
                  Required Tasks
                </CardTitle>
                <CardDescription className="text-black font-semibold">
                  Complete these tasks to move your loan application forward
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border ${
                        selectedTask === task.id 
                          ? "border-[#D4AF37] bg-[#D4AF37]/5" 
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          {getStatusIcon(task.status)}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-black">{task.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant={getStatusColor(task.status)}>
                            {task.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {task.dueDate}</span>
                          </div>
                          {task.completedAt && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Completed: {task.completedAt}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-black mb-2">Required Documents:</h4>
                        <div className="space-y-2">
                          {task.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-black">{doc.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {doc.uploaded ? (
                                  <div className="flex items-center space-x-1 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-xs">Uploaded</span>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDocumentUpload(task.id, doc.name)}
                                    className="text-xs"
                                  >
                                    <Upload className="w-3 h-3 mr-1" />
                                    Upload
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Task Actions */}
                      {task.status !== "completed" && (
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="text-sm text-gray-600">
                            {task.status === "in_progress" 
                              ? "Complete all required documents to finish this task"
                              : "Start working on this task"
                            }
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleTaskComplete(task.id)}
                            disabled={task.documents.some(doc => !doc.uploaded)}
                            className="bg-[#D4AF37] hover:bg-[#B8941F]"
                          >
                            {task.status === "in_progress" ? "Mark Complete" : "Start Task"}
                          </Button>
                        </div>
                      )}
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
