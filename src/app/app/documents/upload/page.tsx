"use client";

import { useState, useRef } from "react";
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
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  FolderOpen,
  User,
  Calendar,
  Tag,
  Eye,
  Download,
  Trash2
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  category: string;
  taskId?: string;
  clientId?: string;
  loanFileId?: string;
}

export default function UploadDocumentsPage() {
  const { user, hasPermission } = useAuth();
  const { workspace } = useWorkspace();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedLoanFile, setSelectedLoanFile] = useState("");
  const [description, setDescription] = useState("");

  // Convex queries and mutations
  const clients = useQuery(api.clients.getClients, workspace?._id ? { workspaceId: workspace._id } : "skip");
  const loanFiles = useQuery(api.loanFiles.getLoanFiles, workspace?._id ? { workspaceId: workspace._id } : "skip");
  const tasks = useQuery(api.tasks.getTasks, workspace?._id ? { workspaceId: workspace._id } : "skip");
  const loanTypes = useQuery(api.loanTypes.getLoanTypes, workspace?._id ? { workspaceId: workspace._id } : "skip");
  
  const uploadFile = useMutation(api.documents.uploadFile);
  const createTask = useMutation(api.tasks.createTask);
  const assignTaskToClient = useMutation(api.tasks.assignTaskToClient);

  if (!hasPermission("documents:upload")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Access Denied</h1>
          <p className="text-black font-semibold">You don't have permission to upload documents.</p>
        </div>
      </div>
    );
  }

  const categories = [
    "Income Verification",
    "Asset Documentation", 
    "Credit Information",
    "Property Documents",
    "Insurance",
    "Legal Documents",
    "Appraisal",
    "Other"
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const uploadPromises = selectedFiles.map(async (file, index) => {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: Math.min(prev[file.name] + 10, 90)
          }));
        }, 200);

        // Upload file to Convex storage
        const result = await uploadFile({
          file,
          workspaceId: workspace!._id,
          category: selectedCategory,
          taskId: selectedTask || undefined,
          clientId: selectedClient || undefined,
          loanFileId: selectedLoanFile || undefined,
          description: description || undefined
        });

        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

        // If this is associated with a task, create the task if it doesn't exist
        if (selectedTask && selectedClient) {
          await assignTaskToClient({
            taskId: selectedTask,
            clientId: selectedClient,
            workspaceId: workspace!._id
          });
        }

        return {
          id: result.id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: result.url,
          uploadedAt: new Date(),
          category: selectedCategory,
          taskId: selectedTask || undefined,
          clientId: selectedClient || undefined,
          loanFileId: selectedLoanFile || undefined
        };
      } catch (error) {
        console.error("Upload failed:", error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(Boolean) as UploadedFile[];
    
    setUploadedFiles(prev => [...prev, ...successfulUploads]);
    setSelectedFiles([]);
    setUploading(false);
    setUploadProgress({});
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Upload Documents
          </h1>
          <p className="text-black font-semibold">
            Upload and organize documents for tasks, clients, and loan files
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Files
                </CardTitle>
                <CardDescription className="text-black font-semibold">
                  Select files and associate them with tasks, clients, or loan files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Selection */}
                <div>
                  <label className="text-sm font-bold text-black mb-2 block">
                    Select Files
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-black font-semibold mb-2">
                      Click to select files or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB each
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-black">Selected Files:</h4>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-bold text-black">{file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Association Options */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-black mb-2 block">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none font-bold text-black"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-black mb-2 block">
                      Task (Optional)
                    </label>
                    <select
                      value={selectedTask}
                      onChange={(e) => setSelectedTask(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none font-bold text-black"
                    >
                      <option value="">Select a task</option>
                      {tasks?.map(task => (
                        <option key={task._id} value={task._id}>
                          {task.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-black mb-2 block">
                      Client (Optional)
                    </label>
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none font-bold text-black"
                    >
                      <option value="">Select a client</option>
                      {clients?.map(client => (
                        <option key={client._id} value={client._id}>
                          {client.firstName} {client.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-black mb-2 block">
                      Loan File (Optional)
                    </label>
                    <select
                      value={selectedLoanFile}
                      onChange={(e) => setSelectedLoanFile(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none font-bold text-black"
                    >
                      <option value="">Select a loan file</option>
                      {loanFiles?.map(loanFile => (
                        <option key={loanFile._id} value={loanFile._id}>
                          {loanFile.loanNumber} - {loanFile.clientName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-black mb-2 block">
                      Description (Optional)
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a description for these documents..."
                      rows={3}
                      className="font-bold text-black"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || uploading}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white font-bold"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Uploaded Files Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Uploaded Files
                </CardTitle>
                <CardDescription className="text-black font-semibold">
                  Recently uploaded documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-black font-semibold">No files uploaded yet</p>
                    <p className="text-sm text-gray-500">Upload files to see them here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-bold text-black">{file.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {file.category}
                              </Badge>
                              {file.taskId && (
                                <>
                                  <span>•</span>
                                  <Badge variant="success" className="text-xs">
                                    Task
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {Object.keys(uploadProgress).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(uploadProgress).map(([fileName, progress]) => (
                      <div key={fileName}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-bold text-black">{fileName}</span>
                          <span className="text-gray-500">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
