"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatCurrency, formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Upload,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function LoanFileDetailPage() {
  const params = useParams();
  const loanFileId = params.id as string;
  const { workspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState("overview");

  const loanFileDetails = useQuery(api.loanFiles.getLoanFileDetails, 
    { loanFileId }
  );

  const updateLoanFile = useMutation(api.loanFiles.updateLoanFile);
  const deleteLoanFile = useMutation(api.loanFiles.deleteLoanFile);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateLoanFile({
        loanFileId,
        status: newStatus as string,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this loan file? This action cannot be undone.")) {
      try {
        await deleteLoanFile({ loanFileId });
        // Redirect to loan files list
        window.location.href = "/app/loan-files";
      } catch (error) {
        console.error("Error deleting loan file:", error);
      }
    }
  };

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (loanFileDetails === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!loanFileDetails) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loan file not found</h3>
        <p className="text-gray-500 mb-6">The loan file you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/app/loan-files">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Loan Files
          </Button>
        </Link>
      </div>
    );
  }

  const { client, tasks, documents, messages } = loanFileDetails;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "tasks", label: "Tasks", icon: CheckCircle },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/app/loan-files">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{loanFileDetails.type}</h1>
            <p className="text-gray-600">
              {client?.name} • {loanFileDetails.amount ? formatCurrency(loanFileDetails.amount) : "Amount TBD"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status and Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Badge
                variant={getStatusColor(loanFileDetails.status).includes("green") ? "success" :
                        getStatusColor(loanFileDetails.status).includes("blue") ? "info" :
                        getStatusColor(loanFileDetails.status).includes("yellow") ? "warning" : "default"}
                size="md"
              >
                {loanFileDetails.status.replace("_", " ")}
              </Badge>
              <Badge
                variant={getPriorityColor(loanFileDetails.priority).includes("red") ? "error" :
                        getPriorityColor(loanFileDetails.priority).includes("orange") ? "warning" :
                        getPriorityColor(loanFileDetails.priority).includes("yellow") ? "info" : "success"}
                size="md"
              >
                {loanFileDetails.priority} priority
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{loanFileDetails.progress}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-[#D4AF37] h-3 rounded-full transition-all duration-300"
              style={{ width: `${loanFileDetails.progress}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              {loanFileDetails.amount ? formatCurrency(loanFileDetails.amount) : "Amount TBD"}
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              {loanFileDetails.dueDate ? formatDate(loanFileDetails.dueDate) : "No due date"}
            </div>
            <div className="flex items-center text-gray-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              {tasks.length} tasks
            </div>
            <div className="flex items-center text-gray-600">
              <FileText className="w-4 h-4 mr-2" />
              {documents.length} documents
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-[#D4AF37] text-[#D4AF37]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{client?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{client?.email}</p>
                </div>
                {client?.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{client.phone}</p>
                  </div>
                )}
                {client?.profile.company && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-900">{client.profile.company}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-gray-900">{loanFileDetails.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-gray-900">
                    {loanFileDetails.amount ? formatCurrency(loanFileDetails.amount) : "Amount TBD"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <Badge
                    variant={getPriorityColor(loanFileDetails.priority).includes("red") ? "error" :
                            getPriorityColor(loanFileDetails.priority).includes("orange") ? "warning" :
                            getPriorityColor(loanFileDetails.priority).includes("yellow") ? "info" : "success"}
                    size="sm"
                  >
                    {loanFileDetails.priority}
                  </Badge>
                </div>
                {loanFileDetails.purpose && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Purpose</label>
                    <p className="text-gray-900">{loanFileDetails.purpose}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{formatDate(loanFileDetails.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "tasks" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tasks</CardTitle>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No tasks yet</p>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Task
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Due: {task.dueDate ? formatDate(task.dueDate) : "No due date"}</span>
                        <Badge
                          variant={getStatusColor(task.status).includes("green") ? "success" :
                                  getStatusColor(task.status).includes("blue") ? "info" :
                                  getStatusColor(task.status).includes("yellow") ? "warning" : "default"}
                          size="sm"
                        >
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={getPriorityColor(task.urgency).includes("red") ? "error" :
                                getPriorityColor(task.urgency).includes("orange") ? "warning" :
                                getPriorityColor(task.urgency).includes("yellow") ? "info" : "success"}
                        size="sm"
                      >
                        {task.urgency}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "documents" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Documents</CardTitle>
              <Button size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No documents yet</p>
                <Button size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload First Document
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-500">
                        {doc.type} • {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={doc.ocrStatus === "completed" ? "success" :
                                doc.ocrStatus === "processing" ? "info" :
                                doc.ocrStatus === "failed" ? "error" : "warning"}
                        size="sm"
                      >
                        {doc.ocrStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "messages" && (
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No messages yet</p>
                <Button size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Conversation
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {message.authorId === "system" ? "S" : "U"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {message.authorId === "system" ? "System" : "User"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
