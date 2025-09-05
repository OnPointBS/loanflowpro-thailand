"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Building2, Plus, ArrowRight, Users, Crown, Shield } from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  status: "active" | "trial" | "suspended";
  role: "advisor" | "staff" | "client";
  memberCount: number;
  lastActive: string;
}

export default function WorkspacesPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  // Mock data - in real app, fetch from Convex
  useEffect(() => {
    const mockWorkspaces: Workspace[] = [
      {
        id: "1",
        name: "Acme Financial Services",
        slug: "acme-financial",
        status: "active",
        role: "advisor",
        memberCount: 5,
        lastActive: "2 hours ago",
      },
      {
        id: "2",
        name: "Metro Lending Group",
        slug: "metro-lending",
        status: "trial",
        role: "staff",
        memberCount: 12,
        lastActive: "1 day ago",
      },
    ];

    setTimeout(() => {
      setWorkspaces(mockWorkspaces);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleWorkspaceSelect = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
    // In real app, switch workspace context
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      router.push(`/app`);
    }
  };

  const handleCreateWorkspace = () => {
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "trial":
        return "warning";
      case "suspended":
        return "error";
      default:
        return "info";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "advisor":
        return <Crown className="w-4 h-4 text-[#D4AF37]" />;
      case "staff":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "client":
        return <Shield className="w-4 h-4 text-gray-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Loading your workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Select Workspace
          </h1>
          <p className="text-gray-600">
            Choose which workspace you&apos;d like to access
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Card 
              key={workspace.id} 
              variant="glass"
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedWorkspace === workspace.id 
                  ? "ring-2 ring-[#D4AF37] bg-[#D4AF37]/5" 
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleWorkspaceSelect(workspace.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-gray-600" />
                    <CardTitle className="text-lg">{workspace.name}</CardTitle>
                  </div>
                  <Badge variant={getStatusColor(workspace.status)}>
                    {workspace.status}
                  </Badge>
                </div>
                <CardDescription>
                  {workspace.slug}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(workspace.role)}
                      <span className="text-gray-600 capitalize">{workspace.role}</span>
                    </div>
                    <span className="text-gray-500">{workspace.memberCount} members</span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Last active: {workspace.lastActive}
                  </div>

                  <Button 
                    className="w-full"
                    variant={selectedWorkspace === workspace.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWorkspaceSelect(workspace.id);
                    }}
                  >
                    {selectedWorkspace === workspace.id ? "Selected" : "Select Workspace"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Workspace Card */}
          <Card 
            variant="glass"
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-gray-50 border-dashed border-2 border-gray-300"
            onClick={handleCreateWorkspace}
          >
            <CardHeader>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle className="text-lg">Create New Workspace</CardTitle>
                <CardDescription>
                  Start a new workspace for your business
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <Button 
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateWorkspace();
                }}
              >
                Create Workspace
                <Plus className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            onClick={logout}
            className="text-gray-600 hover:text-gray-800"
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
