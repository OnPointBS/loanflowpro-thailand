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
  Building2,
  Shield,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
  UserCheck,
  TrendingUp,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  XCircle,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 p-6 space-y-8">
      {/* Premium Header */}
      <div className="bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-2xl shadow-lg">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Loan Files
              </h1>
              <p className="text-slate-600 font-medium text-lg">
                Manage loan applications and track their progress
              </p>
            </div>
          </div>
          <Link href="/app/loan-files/new">
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white border-0 shadow-lg px-6 py-3 text-lg font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              New Loan File
            </Button>
          </Link>
        </div>
      </div>

      {/* Premium Search and Filters */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search loan files by type, purpose, or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-slate-900 font-medium border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none text-slate-900 font-medium bg-white"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="outline" className="border-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-slate-600 hover:text-[#D4AF37] px-6 py-3 rounded-xl">
                <Filter className="w-5 h-5 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Loan Files List */}
      {loanFiles === undefined ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredLoanFiles?.length === 0 ? (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-16 text-center">
            <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl w-fit mx-auto mb-8">
              <FileText className="w-20 h-20 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {searchQuery || statusFilter !== "all" ? "No loan files found" : "No loan files yet"}
            </h3>
            <p className="text-slate-600 mb-8 text-lg">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first loan file to begin managing applications"
              }
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/app/loan-files/new">
                <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white border-0 shadow-lg px-8 py-4 text-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Loan File
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredLoanFiles?.map((loanFile) => (
            <Card key={loanFile._id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:scale-[1.01]">
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#D4AF37] transition-colors duration-300">
                          {loanFile.type}
                        </h3>
                        <div className="flex items-center space-x-3 mt-2">
                          <Badge
                            className={`px-3 py-1 text-xs font-semibold ${
                              getStatusColor(loanFile.status).includes("green") ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                              getStatusColor(loanFile.status).includes("blue") ? "bg-blue-100 text-blue-700 border-blue-200" :
                              getStatusColor(loanFile.status).includes("yellow") ? "bg-amber-100 text-amber-700 border-amber-200" : 
                              "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {loanFile.status.replace("_", " ")}
                          </Badge>
                          <Badge
                            className={`px-3 py-1 text-xs font-semibold ${
                              getPriorityColor(loanFile.priority).includes("red") ? "bg-red-100 text-red-700 border-red-200" :
                              getPriorityColor(loanFile.priority).includes("orange") ? "bg-orange-100 text-orange-700 border-orange-200" :
                              getPriorityColor(loanFile.priority).includes("yellow") ? "bg-yellow-100 text-yellow-700 border-yellow-200" : 
                              "bg-emerald-100 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {loanFile.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="flex items-center text-sm text-slate-600 bg-slate-50 rounded-lg p-4">
                        <DollarSign className="w-5 h-5 mr-3 text-[#D4AF37]" />
                        <div>
                          <div className="font-semibold text-slate-900">
                            {loanFile.amount ? formatCurrency(loanFile.amount) : "Amount TBD"}
                          </div>
                          <div className="text-xs text-slate-500">Loan Amount</div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-slate-600 bg-slate-50 rounded-lg p-4">
                        <Calendar className="w-5 h-5 mr-3 text-[#D4AF37]" />
                        <div>
                          <div className="font-semibold text-slate-900">
                            {loanFile.dueDate ? formatDate(loanFile.dueDate) : "No due date"}
                          </div>
                          <div className="text-xs text-slate-500">Due Date</div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-slate-600 bg-slate-50 rounded-lg p-4">
                        <Users className="w-5 h-5 mr-3 text-[#D4AF37]" />
                        <div>
                          <div className="font-semibold text-slate-900">{loanFile.tasks.length} tasks</div>
                          <div className="text-xs text-slate-500">Total Tasks</div>
                        </div>
                      </div>
                    </div>

                    {loanFile.purpose && (
                      <div className="bg-slate-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold text-slate-900">Purpose:</span> {loanFile.purpose}
                        </p>
                      </div>
                    )}

                    {/* Premium Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                        <span className="font-semibold">Progress</span>
                        <span className="font-bold text-slate-900">{loanFile.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] h-3 rounded-full transition-all duration-500 shadow-lg"
                          style={{ width: `${loanFile.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-200">
                      <span className="font-medium">Created {formatDate(loanFile.createdAt)}</span>
                      <span className="font-medium">Updated {formatDate(loanFile.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ml-6">
                    <Link href={`/app/loan-files/${loanFile._id}`}>
                      <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white border-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="border-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-slate-600 hover:text-[#D4AF37] transition-all duration-300">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Premium Stats */}
      {filteredLoanFiles && filteredLoanFiles.length > 0 && (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  {filteredLoanFiles.length}
                </div>
                <div className="text-sm text-slate-600 font-semibold uppercase tracking-wide">Total Files</div>
              </div>
              <div className="text-center group">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {filteredLoanFiles.filter(f => f.status === "in_progress").length}
                </div>
                <div className="text-sm text-slate-600 font-semibold uppercase tracking-wide">In Progress</div>
              </div>
              <div className="text-center group">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {filteredLoanFiles.filter(f => f.status === "funded").length}
                </div>
                <div className="text-sm text-slate-600 font-semibold uppercase tracking-wide">Funded</div>
              </div>
              <div className="text-center group">
                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
                <div className="text-4xl font-bold text-amber-600 mb-2">
                  {filteredLoanFiles.filter(f => f.status === "under_review").length}
                </div>
                <div className="text-sm text-slate-600 font-semibold uppercase tracking-wide">Under Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
