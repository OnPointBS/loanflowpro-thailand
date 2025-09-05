"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  Users,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function LoanTypesPage() {
  const { workspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const loanTypes = useQuery(api.loanTypes.getLoanTypes, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );
  
  const deleteLoanType = useMutation(api.loanTypes.deleteLoanType);

  const handleDeleteLoanType = async (loanTypeId: string) => {
    if (confirm("Are you sure you want to delete this loan type? This will also delete all associated tasks.")) {
      try {
        await deleteLoanType({ loanTypeId });
      } catch (error) {
        console.error("Error deleting loan type:", error);
      }
    }
  };

  const filteredLoanTypes = loanTypes?.filter(loanType => 
    searchQuery === "" || 
    loanType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loanType.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Loan Types</h1>
          <p className="text-gray-600">
            Manage loan types and their associated workflows
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Loan Type
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search loan types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loan Types Grid */}
      {loanTypes === undefined ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredLoanTypes?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No loan types found" : "No loan types yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? "Try adjusting your search terms"
                : "Get started by creating your first loan type"
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Loan Type
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoanTypes?.map((loanType) => (
            <Card key={loanType._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{loanType.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {loanType.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={loanType.isActive ? "success" : "default"}
                    size="sm"
                  >
                    {loanType.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {loanType.estimatedDays} days estimated
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {loanType.defaultTasks?.length || 0} default tasks
                  </div>
                  {loanType.requirements && loanType.requirements.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Requirements:</span>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {loanType.requirements.slice(0, 3).map((req, index) => (
                          <li key={index} className="text-xs">{req}</li>
                        ))}
                        {loanType.requirements.length > 3 && (
                          <li className="text-xs text-gray-400">
                            +{loanType.requirements.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteLoanType(loanType._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {filteredLoanTypes && filteredLoanTypes.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {filteredLoanTypes.length}
                </div>
                <div className="text-sm text-gray-500">Total Loan Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredLoanTypes.filter(lt => lt.isActive).length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredLoanTypes.reduce((acc, lt) => acc + (lt.defaultTasks?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Total Tasks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Loan Type Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Loan Type</h3>
            <p className="text-gray-600 mb-6">
              This feature is coming soon. For now, you can create loan types through the API or database directly.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
