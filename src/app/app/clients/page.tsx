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
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Building2,
  UserCheck,
  TrendingUp,
  Award,
  Star,
  Shield,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
  const { workspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    clientId: string | null;
    clientName: string;
  }>({
    isOpen: false,
    clientId: null,
    clientName: ""
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const clients = useQuery(api.clients.getClients, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );
  const searchResults = useQuery(api.clients.searchClients, 
    workspace && searchQuery ? { workspaceId: workspace._id, query: searchQuery } : "skip"
  );
  
  const deleteClient = useMutation(api.clients.deleteClient);

  const handleDeleteClient = (clientId: string, clientName: string) => {
    setDeleteModal({
      isOpen: true,
      clientId,
      clientName
    });
  };

  const confirmDeleteClient = async () => {
    if (!deleteModal.clientId) return;
    
    setIsDeleting(true);
    try {
      await deleteClient({ clientId: deleteModal.clientId });
      setDeleteModal({ isOpen: false, clientId: null, clientName: "" });
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({ isOpen: false, clientId: null, clientName: "" });
    }
  };

  const displayClients = searchQuery ? searchResults : clients;

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Client Portfolio
                    </h1>
                    <p className="text-slate-600 font-medium">
                      Manage your client relationships and loan files
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total Clients</p>
                  <p className="text-2xl font-bold text-slate-900">{displayClients?.length || 0}</p>
                </div>
                <Link href="/app/clients/new">
                  <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white border-0 shadow-lg px-6 py-3">
                    <Plus className="w-5 h-5 mr-2" />
                    New Client
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Search and Filters */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors duration-300" />
                  <Input
                    placeholder="Search clients by name, email, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 border-2 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>
              <Button variant="outline" className="border-2 border-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-slate-700 hover:text-[#D4AF37] px-6 py-3 rounded-xl transition-all duration-300">
                <Filter className="w-5 h-5 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Premium Clients Grid */}
        {displayClients === undefined ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : displayClients.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl w-fit mx-auto mb-8">
                <Users className="w-20 h-20 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {searchQuery ? "No clients found" : "No clients yet"}
              </h3>
              <p className="text-slate-600 mb-8 text-lg">
                {searchQuery 
                  ? "Try adjusting your search terms or filters"
                  : "Get started by adding your first client to build your portfolio"
                }
              </p>
              {!searchQuery && (
                <Link href="/app/clients/new">
                  <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white border-0 shadow-lg px-8 py-4 text-lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Add First Client
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayClients.map((client) => (
              <Card key={client._id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:scale-[1.02]">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-xl font-bold text-white">
                            {client.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                          {client.status === "active" ? (
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                          ) : client.status === "prospect" ? (
                            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          ) : (
                            <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-[#D4AF37] transition-colors duration-300">
                          {client.name}
                        </CardTitle>
                        <CardDescription className="text-slate-600 font-medium">
                          {client.email}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`px-3 py-1 text-xs font-semibold ${
                          client.status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                          client.status === "prospect" ? "bg-amber-100 text-amber-700 border-amber-200" :
                          "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {client.status}
                      </Badge>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-300">
                        <MoreVertical className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {client.profile.company && (
                      <div className="flex items-center text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                        <Building2 className="w-4 h-4 mr-3 text-[#D4AF37]" />
                        <span className="font-medium">{client.profile.company}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                        <Phone className="w-4 h-4 mr-3 text-[#D4AF37]" />
                        <span className="font-medium">{client.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                      <Mail className="w-4 h-4 mr-3 text-[#D4AF37]" />
                      <span className="font-medium">{client.email}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-500 font-medium">Loan Files</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-slate-900">{client.loanFiles.length}</span>
                        <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-4">
                    <Link href={`/app/clients/${client._id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white border-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="border-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-slate-600 hover:text-[#D4AF37] transition-all duration-300">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClient(client._id, client.name)}
                      className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Premium Stats */}
        {displayClients && displayClients.length > 0 && (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    {displayClients.length}
                  </div>
                  <div className="text-sm text-slate-600 font-semibold uppercase tracking-wide">Total Clients</div>
                </div>
                <div className="text-center group">
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">
                    {displayClients.filter(c => c.status === "active").length}
                  </div>
                  <div className="text-sm text-slate-600 font-semibold uppercase tracking-wide">Active</div>
                </div>
                <div className="text-center group">
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="text-4xl font-bold text-amber-600 mb-2">
                    {displayClients.filter(c => c.status === "prospect").length}
                  </div>
                  <div className="text-sm text-slate-600 font-semibold uppercase tracking-wide">Prospects</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteClient}
          title="Delete Client"
          message={`Are you sure you want to delete "${deleteModal.clientName}"? This action cannot be undone and will permanently remove all client data, loan files, and associated records.`}
          confirmText="Delete Client"
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}