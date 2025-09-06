"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  Shield,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { workspace, isTrial } = useWorkspace();
  
  // Fetch dashboard data
  const clients = useQuery(api.clients.getClients, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );
  const loanFiles = useQuery(api.loanFiles.getLoanFiles, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );
  const tasks = useQuery(api.tasks.getTasks, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );
  const overdueTasks = useQuery(api.tasks.getOverdueTasks, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );
  const taskStats = useQuery(api.tasks.getTaskStats, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      name: "Total Clients",
      value: clients?.length || 0,
      icon: Users,
      color: "text-[#D4AF37]",
      bgColor: "bg-gradient-to-br from-[#D4AF37]/10 to-[#B8941F]/5",
      borderColor: "border-[#D4AF37]/20",
      change: "+12%",
      changeType: "positive",
      description: "Active client portfolio"
    },
    {
      name: "Active Loan Files",
      value: loanFiles?.filter(f => f.status === "in_progress").length || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100/50",
      borderColor: "border-blue-200",
      change: "+8%",
      changeType: "positive",
      description: "Currently processing"
    },
    {
      name: "Completed Tasks",
      value: taskStats?.completed || 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
      borderColor: "border-emerald-200",
      change: "+15%",
      changeType: "positive",
      description: "This month"
    },
    {
      name: "Overdue Tasks",
      value: overdueTasks?.length || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100/50",
      borderColor: "border-red-200",
      change: "-5%",
      changeType: "negative",
      description: "Requires attention"
    },
  ];

  const recentLoanFiles = loanFiles?.slice(0, 5) || [];
  const recentTasks = tasks?.slice(0, 5) || [];

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
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Welcome back, {workspace.name}
                    </h1>
                    <p className="text-slate-600 font-medium">
                      Your comprehensive loan operations dashboard
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {isTrial && (
                  <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                    <Star className="w-4 h-4 mr-2" />
                    Trial - {workspace.subscriptionTier || 'solo'} Plan
                  </Badge>
                )}
                <div className="text-right">
                  <p className="text-sm text-slate-500">Last updated</p>
                  <p className="text-sm font-semibold text-slate-700">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center space-x-1">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-semibold ${
                      stat.changeType === "positive" ? "text-emerald-600" : "text-red-600"
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm font-semibold text-slate-600">{stat.name}</p>
                  <p className="text-xs text-slate-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Loan Files */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Recent Loan Files</CardTitle>
                    <CardDescription className="text-slate-600">
                      Latest loan applications and their status
                    </CardDescription>
                  </div>
                </div>
                <Link href="/app/loan-files">
                  <Button variant="outline" size="sm" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-300">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentLoanFiles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl w-fit mx-auto mb-6">
                    <FileText className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No loan files yet</h3>
                  <p className="text-slate-600 mb-6">Start by creating your first loan file to track applications</p>
                  <Link href="/app/loan-files/new">
                    <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white border-0 shadow-lg">
                      Create First Loan File
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLoanFiles.map((loanFile) => (
                    <div
                      key={loanFile._id}
                      className="group p-4 border border-slate-200 rounded-xl hover:border-[#D4AF37]/30 hover:shadow-lg transition-all duration-300 bg-white/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="p-1.5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                              <FileText className="w-4 h-4 text-slate-600" />
                            </div>
                            <p className="font-semibold text-slate-900">{loanFile.type}</p>
                          </div>
                          <p className="text-sm text-slate-600 ml-8">
                            {loanFile.amount ? `$${loanFile.amount.toLocaleString()}` : "Amount TBD"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge
                            className={`px-3 py-1 text-xs font-semibold ${
                              loanFile.status === "completed" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                              loanFile.status === "in_progress" ? "bg-blue-100 text-blue-700 border-blue-200" :
                              loanFile.status === "pending" ? "bg-amber-100 text-amber-700 border-amber-200" : 
                              "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {loanFile.status.replace("_", " ")}
                          </Badge>
                          <div className="w-20 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${loanFile.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Recent Tasks</CardTitle>
                    <CardDescription className="text-slate-600">
                      Latest tasks and their progress
                    </CardDescription>
                  </div>
                </div>
                <Link href="/app/tasks">
                  <Button variant="outline" size="sm" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-300">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl w-fit mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No tasks yet</h3>
                  <p className="text-slate-600 mb-6">Create your first task to start managing your workflow</p>
                  <Link href="/app/tasks/new">
                    <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white border-0 shadow-lg">
                      Create First Task
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="group p-4 border border-slate-200 rounded-xl hover:border-[#D4AF37]/30 hover:shadow-lg transition-all duration-300 bg-white/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="p-1.5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-slate-600" />
                            </div>
                            <p className="font-semibold text-slate-900">{task.title}</p>
                          </div>
                          <p className="text-sm text-slate-600 ml-8">
                            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`px-3 py-1 text-xs font-semibold ${
                              task.status === "completed" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                              task.status === "in_progress" ? "bg-blue-100 text-blue-700 border-blue-200" :
                              task.status === "pending" ? "bg-amber-100 text-amber-700 border-amber-200" : 
                              "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {task.status.replace("_", " ")}
                          </Badge>
                          <Badge
                            className={`px-3 py-1 text-xs font-semibold ${
                              task.urgency === "urgent" ? "bg-red-100 text-red-700 border-red-200" :
                              task.urgency === "high" ? "bg-orange-100 text-orange-700 border-orange-200" :
                              task.urgency === "medium" ? "bg-blue-100 text-blue-700 border-blue-200" : 
                              "bg-emerald-100 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {task.urgency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Quick Actions</CardTitle>
                <CardDescription className="text-slate-600">
                  Get started with common tasks and operations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/app/clients/new">
                <Button className="group w-full h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-white to-slate-50 hover:from-[#D4AF37]/5 hover:to-[#B8941F]/10 border-2 border-slate-200 hover:border-[#D4AF37]/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-slate-900 group-hover:text-[#D4AF37] transition-colors duration-300">New Client</span>
                </Button>
              </Link>
              <Link href="/app/loan-files/new">
                <Button className="group w-full h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-white to-slate-50 hover:from-[#D4AF37]/5 hover:to-[#B8941F]/10 border-2 border-slate-200 hover:border-[#D4AF37]/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-slate-900 group-hover:text-[#D4AF37] transition-colors duration-300">New Loan File</span>
                </Button>
              </Link>
              <Link href="/app/documents/upload">
                <Button className="group w-full h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-white to-slate-50 hover:from-[#D4AF37]/5 hover:to-[#B8941F]/10 border-2 border-slate-200 hover:border-[#D4AF37]/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-slate-900 group-hover:text-[#D4AF37] transition-colors duration-300">Upload Document</span>
                </Button>
              </Link>
              <Link href="/app/reports">
                <Button className="group w-full h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-white to-slate-50 hover:from-[#D4AF37]/5 hover:to-[#B8941F]/10 border-2 border-slate-200 hover:border-[#D4AF37]/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-slate-900 group-hover:text-[#D4AF37] transition-colors duration-300">View Reports</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
