"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatCurrency, formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";
import {
  FileText,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function LoanFilesPage() {
  const { workspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loanFiles = useQuery(api.loanFiles.getLoanFiles, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );

  const filteredLoanFiles = loanFiles?.filter(loanFile => {
    const matchesSearch = searchQuery === "" || 
      loanFile.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loanFile.purpose && loanFile.purpose.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || loanFile.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "in_progress", label: "In Progress" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "funded", label: "Funded" },
    { value: "declined", label: "Declined" },
    { value: "cancelled", label: "Cancelled" },
  ];

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Files</h1>
          <p className="text-gray-600">
            Manage loan applications and track their progress
          </p>
        </div>
        <Link href="/app/loan-files/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Loan File
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search loan files by type, purpose, or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Files List */}
      {loanFiles === undefined ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredLoanFiles?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter !== "all" ? "No loan files found" : "No loan files yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first loan file"
              }
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/app/loan-files/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Loan File
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLoanFiles?.map((loanFile) => (
            <Card key={loanFile._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {loanFile.type}
                      </h3>
                      <Badge
                        variant={getStatusColor(loanFile.status).includes("green") ? "success" :
                                getStatusColor(loanFile.status).includes("blue") ? "info" :
                                getStatusColor(loanFile.status).includes("yellow") ? "warning" : "default"}
                        size="sm"
                      >
                        {loanFile.status.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant={getPriorityColor(loanFile.priority).includes("red") ? "error" :
                                getPriorityColor(loanFile.priority).includes("orange") ? "warning" :
                                getPriorityColor(loanFile.priority).includes("yellow") ? "info" : "success"}
                        size="sm"
                      >
                        {loanFile.priority}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {loanFile.amount ? formatCurrency(loanFile.amount) : "Amount TBD"}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {loanFile.dueDate ? formatDate(loanFile.dueDate) : "No due date"}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {loanFile.tasks.length} tasks
                      </div>
                    </div>

                    {loanFile.purpose && (
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>Purpose:</strong> {loanFile.purpose}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{loanFile.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${loanFile.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created {formatDate(loanFile.createdAt)}</span>
                      <span>Updated {formatDate(loanFile.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Link href={`/app/loan-files/${loanFile._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {filteredLoanFiles && filteredLoanFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {filteredLoanFiles.length}
                </div>
                <div className="text-sm text-gray-500">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredLoanFiles.filter(f => f.status === "in_progress").length}
                </div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredLoanFiles.filter(f => f.status === "funded").length}
                </div>
                <div className="text-sm text-gray-500">Funded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredLoanFiles.filter(f => f.status === "under_review").length}
                </div>
                <div className="text-sm text-gray-500">Under Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
