"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity,
  Building2,
  Shield,
  Star,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign,
  Target,
  Zap,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  Filter,
  Eye,
  UserCheck,
  FolderOpen,
  Clock3,
  AlertTriangle,
  CheckSquare,
  XCircle,
  BarChart,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";

export default function ReportsPage() {
  const { workspace } = useWorkspace();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedView, setSelectedView] = useState("overview");

  const analytics = useQuery(api.analytics.getWorkspaceAnalytics, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );
  const staffPerformance = useQuery(api.analytics.getStaffPerformance, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );
  const loanFilePipeline = useQuery(api.analytics.getLoanFilePipeline, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );
  const clientEngagement = useQuery(api.analytics.getClientEngagement, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analytics || !staffPerformance || !loanFilePipeline || !clientEngagement) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <div className="space-y-8 p-6">
        {/* Luxury Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-transparent rounded-2xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Analytics & Reports
                    </h1>
                    <p className="text-slate-600 font-medium">
                      Comprehensive insights into your workspace performance
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Last Updated</p>
                  <p className="text-lg font-bold text-slate-900">
                    {new Date(analytics.generatedAt).toLocaleTimeString()}
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white border-0 shadow-lg px-6 py-3">
                  <Download className="w-5 h-5 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-semibold text-slate-900">Reporting Period</span>
              </div>
              <div className="flex space-x-2">
                {[
                  { key: "7d", label: "7 Days" },
                  { key: "30d", label: "30 Days" },
                  { key: "90d", label: "90 Days" },
                  { key: "1y", label: "1 Year" },
                ].map((period) => (
                  <Button
                    key={period.key}
                    variant={selectedPeriod === period.key ? "default" : "outline"}
                    onClick={() => setSelectedPeriod(period.key)}
                    className={
                      selectedPeriod === period.key
                        ? "bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white border-0"
                        : "border-slate-200 hover:border-[#D4AF37] text-slate-700"
                    }
                  >
                    {period.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Clients */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Clients</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{analytics.clientStats.total}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
                    <span className="text-sm font-semibold text-emerald-600">
                      +{analytics.growth.clientsLast30Days} this month
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Loan Files */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Active Loans</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{analytics.loanFileStats.total}</p>
                  <div className="flex items-center mt-2">
                    <DollarSign className="w-4 h-4 text-[#D4AF37] mr-1" />
                    <span className="text-sm font-semibold text-[#D4AF37]">
                      {formatCurrency(analytics.loanFileStats.totalAmount)}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-[#D4AF37]/10 to-[#B8941F]/10 rounded-2xl">
                  <FileText className="w-8 h-8 text-[#D4AF37]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Completion Rate */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Task Completion</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{formatPercentage(analytics.taskStats.completionRate)}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mr-1" />
                    <span className="text-sm font-semibold text-emerald-600">
                      {analytics.taskStats.completed} completed
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Team Members</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{analytics.userStats.total}</p>
                  <div className="flex items-center mt-2">
                    <UserCheck className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-sm font-semibold text-blue-600">
                      {analytics.userStats.active} active
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Loan File Pipeline */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl shadow-lg">
                  <BarChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Loan Pipeline</CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    Track loan files through each stage
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {Object.entries(loanFilePipeline.pipeline).map(([status, files]) => (
                  <div key={status} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'funded' ? 'bg-emerald-500' :
                        status === 'approved' ? 'bg-blue-500' :
                        status === 'under_review' ? 'bg-amber-500' :
                        status === 'in_progress' ? 'bg-purple-500' :
                        'bg-slate-400'
                      }`} />
                      <span className="font-semibold text-slate-900 capitalize">
                        {status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{files.length}</div>
                      <div className="text-sm text-slate-600">
                        {formatCurrency(files.reduce((sum: number, file: any) => sum + (file.amount || 0), 0))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {formatPercentage(loanFilePipeline.conversionRates.overall)}
                    </div>
                    <div className="text-sm text-slate-600 font-semibold">Overall Conversion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#D4AF37]">
                      {formatCurrency(loanFilePipeline.averageAmount)}
                    </div>
                    <div className="text-sm text-slate-600 font-semibold">Average Loan Size</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staff Performance */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Staff Performance</CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    Individual team member metrics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {staffPerformance.map((staff) => (
                <div key={staff.userId} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold text-slate-900">{staff.name}</div>
                      <div className="text-sm text-slate-600">{staff.role}</div>
                    </div>
                    <Badge className={`px-3 py-1 text-xs font-semibold ${
                      staff.completionRate >= 80 ? 'bg-emerald-100 text-emerald-700' :
                      staff.completionRate >= 60 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {formatPercentage(staff.completionRate)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-slate-900">{staff.totalTasks}</div>
                      <div className="text-xs text-slate-600">Total Tasks</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-emerald-600">{staff.completedTasks}</div>
                      <div className="text-xs text-slate-600">Completed</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-600">{staff.overdueTasks}</div>
                      <div className="text-xs text-slate-600">Overdue</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Client Engagement Analytics */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <PieChartIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Client Engagement</CardTitle>
                <CardDescription className="text-slate-600 font-medium">
                  Track client activity and engagement levels
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Engagement Overview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Engagement Overview</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                      <span className="font-medium text-slate-900">High Engagement</span>
                    </div>
                    <span className="font-bold text-emerald-600">{clientEngagement.highEngagementClients}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full" />
                      <span className="font-medium text-slate-900">Medium Engagement</span>
                    </div>
                    <span className="font-bold text-amber-600">
                      {clientEngagement.clients.length - clientEngagement.highEngagementClients - clientEngagement.lowEngagementClients}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="font-medium text-slate-900">Low Engagement</span>
                    </div>
                    <span className="font-bold text-red-600">{clientEngagement.lowEngagementClients}</span>
                  </div>
                </div>
              </div>

              {/* Top Clients */}
              <div className="lg:col-span-2">
                <h4 className="font-semibold text-slate-900 mb-4">Top Engaged Clients</h4>
                <div className="space-y-3">
                  {clientEngagement.clients.slice(0, 5).map((client, index) => (
                    <div key={client.clientId} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{client.name}</div>
                          <div className="text-sm text-slate-600">{client.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{client.engagementScore}</div>
                        <div className="text-sm text-slate-600">Engagement Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Analytics */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Document Analytics</CardTitle>
                <CardDescription className="text-slate-600 font-medium">
                  File storage and processing insights
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-50 rounded-xl">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {formatNumber(analytics.documentStats.total)}
                </div>
                <div className="text-sm text-slate-600 font-semibold">Total Documents</div>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-xl">
                <div className="text-3xl font-bold text-[#D4AF37] mb-2">
                  {formatBytes(analytics.documentStats.totalSize)}
                </div>
                <div className="text-sm text-slate-600 font-semibold">Storage Used</div>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatBytes(analytics.documentStats.averageSize)}
                </div>
                <div className="text-sm text-slate-600 font-semibold">Average File Size</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
