"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Save, FileText, Users, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";

export default function NewLoanFilePage() {
  const { workspace } = useWorkspace();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    clientId: "",
    type: "",
    amount: "",
    purpose: "",
    priority: "medium",
    dueDate: "",
  });

  const clients = useQuery(api.clients.getClients, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );
  const loanTypes = useQuery(api.loanTypes.getLoanTypes, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );

  const createLoanFile = useMutation(api.loanFiles.createLoanFile);
  const applyTemplate = useMutation(api.loanTypes.applyLoanTypeTemplate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!workspace) {
        throw new Error("Workspace not found");
      }

      const loanFileId = await createLoanFile({
        clientId: formData.clientId as any,
        workspaceId: workspace._id,
        type: formData.type,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        purpose: formData.purpose || undefined,
        priority: formData.priority as any,
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
      });

      // Apply loan type template if available
      const selectedLoanType = loanTypes?.find(lt => lt.name === formData.type);
      if (selectedLoanType) {
        await applyTemplate({
          loanFileId,
          loanTypeId: selectedLoanType._id,
        });
      }

      router.push(`/app/loan-files/${loanFileId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create loan file");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const priorityOptions = [
    { value: "low", label: "Low", color: "text-green-600 bg-green-50" },
    { value: "medium", label: "Medium", color: "text-yellow-600 bg-yellow-50" },
    { value: "high", label: "High", color: "text-orange-600 bg-orange-50" },
    { value: "urgent", label: "Urgent", color: "text-red-600 bg-red-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/app/loan-files">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Loan Files
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Loan File</h1>
          <p className="text-gray-600">
            Create a new loan file for a client
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Loan File Information
            </CardTitle>
            <CardDescription>
              Enter the loan details. Required fields are marked with an asterisk.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {/* Client Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client *
                </label>
                <select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none disabled:opacity-50"
                >
                  <option value="">Select a client</option>
                  {clients?.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.name} {client.profile.company && `(${client.profile.company})`}
                    </option>
                  ))}
                </select>
                {!clients || clients.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    No clients available. <Link href="/app/clients/new" className="text-[#D4AF37] hover:underline">Create a client first</Link>.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Loan Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none disabled:opacity-50"
                  >
                    <option value="">Select loan type</option>
                    {loanTypes?.map(loanType => (
                      <option key={loanType._id} value={loanType.name}>
                        {loanType.name}
                      </option>
                    ))}
                    <option value="Custom">Custom Loan Type</option>
                  </select>
                </div>

                {/* Amount */}
                <Input
                  label="Loan Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="100000"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {priorityOptions.map(option => (
                      <label
                        key={option.value}
                        className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.priority === option.value
                            ? "border-[#D4AF37] bg-[#D4AF37]/10"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={option.value}
                          checked={formData.priority === option.value}
                          onChange={handleChange}
                          className="sr-only"
                          disabled={isSubmitting}
                        />
                        <span className="text-sm font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <Input
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Describe the purpose of this loan..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none disabled:opacity-50"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link href="/app/loan-files">
                  <Button variant="outline" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={!formData.clientId || !formData.type}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Loan File
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
