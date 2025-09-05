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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Active Loan Files",
      value: loanFiles?.filter(f => f.status === "in_progress").length || 0,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Completed Tasks",
      value: taskStats?.completed || 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      name: "Overdue Tasks",
      value: overdueTasks?.length || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const recentLoanFiles = loanFiles?.slice(0, 5) || [];
  const recentTasks = tasks?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {workspace.name}!
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your loan workflow today.
          </p>
        </div>
        {isTrial && (
          <Badge variant="warning" size="md">
            Trial - {workspace.subscriptionTier || 'solo'} Plan
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Loan Files */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Loan Files</CardTitle>
              <Link href="/app/loan-files">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>
              Latest loan applications and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentLoanFiles.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No loan files yet</p>
                <Link href="/app/loan-files/new">
                  <Button>Create First Loan File</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentLoanFiles.map((loanFile) => (
                  <div
                    key={loanFile._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{loanFile.type}</p>
                      <p className="text-sm text-gray-500">
                        {loanFile.amount ? `$${loanFile.amount.toLocaleString()}` : "Amount TBD"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          loanFile.status === "completed" ? "success" :
                          loanFile.status === "in_progress" ? "info" :
                          loanFile.status === "pending" ? "warning" : "default"
                        }
                        size="sm"
                      >
                        {loanFile.status.replace("_", " ")}
                      </Badge>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#D4AF37] h-2 rounded-full"
                          style={{ width: `${loanFile.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Tasks</CardTitle>
              <Link href="/app/tasks">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>
              Latest tasks and their progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No tasks yet</p>
                <Link href="/app/tasks/new">
                  <Button>Create First Task</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          task.status === "completed" ? "success" :
                          task.status === "in_progress" ? "info" :
                          task.status === "pending" ? "warning" : "default"
                        }
                        size="sm"
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant={
                          task.urgency === "urgent" ? "error" :
                          task.urgency === "high" ? "warning" :
                          task.urgency === "medium" ? "info" : "success"
                        }
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
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/app/clients/new">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="w-6 h-6" />
                <span>New Client</span>
              </Button>
            </Link>
            <Link href="/app/loan-files/new">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <FileText className="w-6 h-6" />
                <span>New Loan File</span>
              </Button>
            </Link>
            <Link href="/app/documents/upload">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <TrendingUp className="w-6 h-6" />
                <span>Upload Document</span>
              </Button>
            </Link>
            <Link href="/app/reports">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <DollarSign className="w-6 h-6" />
                <span>View Reports</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
