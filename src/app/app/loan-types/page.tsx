"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  FileText,
  Clock,
  Users,
  DollarSign,
  CreditCard,
  Home,
  Settings,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface PresetTask {
  title: string;
  description: string;
  category: string;
  isClientTask: boolean;
  isStaffTask: boolean;
  required: boolean;
  estimatedDays: number;
  order: number;
}

export default function LoanTypesPage() {
  const { user, hasPermission } = useAuth();
  const { workspace } = useWorkspace();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showTasks, setShowTasks] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    requirements: [""],
    interestRateRange: { min: 0, max: 0 },
    maxLoanAmount: 0,
    minCreditScore: 0,
    maxLtv: 0,
    active: true,
    presetTasks: [] as PresetTask[]
  });

  // Convex queries and mutations
  const loanTypes = useQuery(api.loanTypes.getLoanTypes, workspace?._id ? { workspaceId: workspace._id } : "skip");
  const createLoanType = useMutation(api.loanTypes.createLoanType);
  const updateLoanType = useMutation(api.loanTypes.updateLoanType);
  const deleteLoanType = useMutation(api.loanTypes.deleteLoanType);

  if (!hasPermission("loanfiles:create")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Access Denied</h1>
          <p className="text-black font-semibold">You don't have permission to manage loan types.</p>
        </div>
      </div>
    );
  }

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      name: "",
      description: "",
      requirements: [""],
      interestRateRange: { min: 0, max: 0 },
      maxLoanAmount: 0,
      minCreditScore: 0,
      maxLtv: 0,
      active: true,
      presetTasks: []
    });
  };

  const handleEdit = (loanType: any) => {
    setEditingId(loanType._id);
    setFormData({
      name: loanType.name,
      description: loanType.description || "",
      requirements: loanType.requirements || [""],
      interestRateRange: loanType.interestRateRange || { min: 0, max: 0 },
      maxLoanAmount: loanType.maxLoanAmount || 0,
      minCreditScore: loanType.minCreditScore || 0,
      maxLtv: loanType.maxLtv || 0,
      active: loanType.active,
      presetTasks: loanType.presetTasks || []
    });
  };

  const handleSave = async () => {
    if (!workspace) return;

    try {
      if (editingId) {
        await updateLoanType({
          loanTypeId: editingId as any,
          ...formData
        });
      } else {
        await createLoanType({
          ...formData,
          workspaceId: workspace._id
        });
      }
      
      setIsCreating(false);
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        requirements: [""],
        interestRateRange: { min: 0, max: 0 },
        maxLoanAmount: 0,
        minCreditScore: 0,
        maxLtv: 0,
        active: true,
        presetTasks: []
      });
    } catch (error) {
      console.error("Error saving loan type:", error);
    }
  };

  const handleDelete = async (loanTypeId: string) => {
    if (confirm("Are you sure you want to delete this loan type?")) {
      try {
        await deleteLoanType({ loanTypeId: loanTypeId as any });
      } catch (error) {
        console.error("Error deleting loan type:", error);
      }
    }
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""]
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addPresetTask = () => {
    setFormData(prev => ({
      ...prev,
      presetTasks: [...prev.presetTasks, {
        title: "",
        description: "",
        category: "General",
        isClientTask: false,
        isStaffTask: true,
        required: true,
        estimatedDays: 1,
        order: prev.presetTasks.length
      }]
    }));
  };

  const updatePresetTask = (index: number, field: keyof PresetTask, value: any) => {
    setFormData(prev => ({
      ...prev,
      presetTasks: prev.presetTasks.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }));
  };

  const removePresetTask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      presetTasks: prev.presetTasks.filter((_, i) => i !== index)
    }));
  };

  const moveTask = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...formData.presetTasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newTasks.length) {
      [newTasks[index], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[index]];
      newTasks.forEach((task, i) => {
        task.order = i;
      });
      
      setFormData(prev => ({
        ...prev,
        presetTasks: newTasks
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Loan Types
              </h1>
              <p className="text-black font-semibold">
                Manage loan types with preset tasks for staff and clients
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Loan Type
            </Button>
          </div>
        </div>

        {/* Loan Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loanTypes?.map((loanType) => (
            <Card key={loanType._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-black">
                    {loanType.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTasks(showTasks === loanType._id ? null : loanType._id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(loanType)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(loanType._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-black font-semibold">
                  {loanType.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-black">Interest Rate:</span>
                    <span className="text-sm text-gray-600">
                      {loanType.interestRateRange.min}% - {loanType.interestRateRange.max}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-black">Max Amount:</span>
                    <span className="text-sm text-gray-600">
                      ${loanType.maxLoanAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-black">Min Credit Score:</span>
                    <span className="text-sm text-gray-600">{loanType.minCreditScore}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-black">Max LTV:</span>
                    <span className="text-sm text-gray-600">{loanType.maxLtv}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-black">Preset Tasks:</span>
                    <Badge variant="outline">
                      {loanType.presetTasks.length} tasks
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-black">Status:</span>
                    <Badge variant={loanType.active ? "success" : "warning"}>
                      {loanType.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Preset Tasks Preview */}
                {showTasks === loanType._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-bold text-black mb-2">Preset Tasks:</h4>
                    <div className="space-y-2">
                      {loanType.presetTasks.map((task, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-black">{task.title}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{task.category}</span>
                              <span>•</span>
                              <span>{task.estimatedDays} days</span>
                              {task.isClientTask && <Badge variant="info" className="text-xs">Client</Badge>}
                              {task.isStaffTask && <Badge variant="warning" className="text-xs">Staff</Badge>}
                              {task.required && <Badge variant="success" className="text-xs">Required</Badge>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black">
                {editingId ? "Edit Loan Type" : "Create New Loan Type"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-black mb-2 block">
                    Loan Type Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Conventional Mortgage"
                    className="font-bold text-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-black mb-2 block">
                    Max Loan Amount *
                  </label>
                  <Input
                    type="number"
                    value={formData.maxLoanAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxLoanAmount: Number(e.target.value) }))}
                    placeholder="1000000"
                    className="font-bold text-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-black mb-2 block">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this loan type..."
                  rows={3}
                  className="font-bold text-black"
                />
              </div>

              {/* Loan Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-bold text-black mb-2 block">
                    Min Interest Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.interestRateRange.min}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      interestRateRange: { ...prev.interestRateRange, min: Number(e.target.value) }
                    }))}
                    className="font-bold text-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-black mb-2 block">
                    Max Interest Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.interestRateRange.max}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      interestRateRange: { ...prev.interestRateRange, max: Number(e.target.value) }
                    }))}
                    className="font-bold text-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-black mb-2 block">
                    Min Credit Score
                  </label>
                  <Input
                    type="number"
                    value={formData.minCreditScore}
                    onChange={(e) => setFormData(prev => ({ ...prev, minCreditScore: Number(e.target.value) }))}
                    className="font-bold text-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-black mb-2 block">
                  Max Loan-to-Value Ratio (%)
                </label>
                <Input
                  type="number"
                  value={formData.maxLtv}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxLtv: Number(e.target.value) }))}
                  placeholder="80"
                  className="font-bold text-black"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="text-sm font-bold text-black mb-2 block">
                  Requirements
                </label>
                <div className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        placeholder="Enter requirement..."
                        className="font-bold text-black"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addRequirement}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>
              </div>

              {/* Preset Tasks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-black">
                    Preset Tasks
                  </label>
                  <Button
                    variant="outline"
                    onClick={addPresetTask}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {formData.presetTasks.map((task, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-black">Task {index + 1}</h4>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveTask(index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveTask(index, 'down')}
                            disabled={index === formData.presetTasks.length - 1}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removePresetTask(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-black mb-1 block">
                            Task Title *
                          </label>
                          <Input
                            value={task.title}
                            onChange={(e) => updatePresetTask(index, 'title', e.target.value)}
                            placeholder="e.g., Submit Income Verification"
                            className="font-bold text-black"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-black mb-1 block">
                            Category
                          </label>
                          <select
                            value={task.category}
                            onChange={(e) => updatePresetTask(index, 'category', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none font-bold text-black"
                          >
                            <option value="General">General</option>
                            <option value="Income Verification">Income Verification</option>
                            <option value="Asset Documentation">Asset Documentation</option>
                            <option value="Credit Information">Credit Information</option>
                            <option value="Property Documents">Property Documents</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Legal Documents">Legal Documents</option>
                            <option value="Appraisal">Appraisal</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-black mb-1 block">
                            Estimated Days
                          </label>
                          <Input
                            type="number"
                            value={task.estimatedDays}
                            onChange={(e) => updatePresetTask(index, 'estimatedDays', Number(e.target.value))}
                            className="font-bold text-black"
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={task.isClientTask}
                              onChange={(e) => updatePresetTask(index, 'isClientTask', e.target.checked)}
                            />
                            <span className="text-xs font-bold text-black">Client Task</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={task.isStaffTask}
                              onChange={(e) => updatePresetTask(index, 'isStaffTask', e.target.checked)}
                            />
                            <span className="text-xs font-bold text-black">Staff Task</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={task.required}
                              onChange={(e) => updatePresetTask(index, 'required', e.target.checked)}
                            />
                            <span className="text-xs font-bold text-black">Required</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <label className="text-xs font-bold text-black mb-1 block">
                          Description
                        </label>
                        <Textarea
                          value={task.description}
                          onChange={(e) => updatePresetTask(index, 'description', e.target.value)}
                          placeholder="Describe what needs to be done..."
                          rows={2}
                          className="font-bold text-black"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-bold"
                >
                  {editingId ? "Update" : "Create"} Loan Type
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}