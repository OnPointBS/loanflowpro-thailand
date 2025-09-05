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
} from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
  const { workspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // const clients = useQuery(api.clients.getClients, 
  //   workspace ? { workspaceId: workspace._id } : "skip"
  // );
  // const searchResults = useQuery(api.clients.searchClients, 
  //   workspace && searchQuery ? { workspaceId: workspace._id, query: searchQuery } : "skip"
  // );
  
  // Mock data for now
  const clients: any[] = [];
  const searchResults: any[] = [];

  // const deleteClient = useMutation(api.clients.deleteClient);

  const handleDeleteClient = async (clientId: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      try {
        // await deleteClient({ clientId });
        console.log("Deleting client:", clientId);
      } catch (error) {
        console.error("Error deleting client:", error);
      }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">
            Manage your client relationships and loan files
          </p>
        </div>
        <Link href="/app/clients/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search clients by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      {displayClients === undefined ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : displayClients.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No clients found" : "No clients yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? "Try adjusting your search terms"
                : "Get started by adding your first client"
              }
            </p>
            {!searchQuery && (
              <Link href="/app/clients/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Client
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayClients.map((client) => (
            <Card key={client._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-700">
                        {client.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <CardDescription>{client.email}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge
                      variant={
                        client.status === "active" ? "success" :
                        client.status === "inactive" ? "default" : "warning"
                      }
                      size="sm"
                    >
                      {client.status}
                    </Badge>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {client.profile.company && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      {client.profile.company}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {client.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {client.email}
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Loan Files</span>
                      <span className="font-medium">{client.loanFiles.length}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Link href={`/app/clients/${client._id}`}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClient(client._id)}
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
      {displayClients && displayClients.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {displayClients.length}
                </div>
                <div className="text-sm text-gray-500">Total Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {displayClients.filter(c => c.status === "active").length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {displayClients.filter(c => c.status === "prospect").length}
                </div>
                <div className="text-sm text-gray-500">Prospects</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
