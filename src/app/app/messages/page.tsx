"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Reply,
  Archive,
  Star,
  Clock,
  User,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function MessagesPage() {
  const { workspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  // Mock data for now - replace with real Convex queries when available
  const messages = [
    {
      _id: "1",
      subject: "Additional documents needed for SBA 7(a) application",
      from: "Sarah Johnson",
      fromEmail: "sarah@example.com",
      to: "test-fixed@example.com",
      content: "Hi John, we need your latest bank statements and tax returns to complete your SBA 7(a) application. Please upload these documents as soon as possible.",
      status: "unread",
      priority: "high",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      loanFileId: "loan-1",
      clientId: "client-1",
    },
    {
      _id: "2",
      subject: "Application status update",
      from: "Mike Wilson",
      fromEmail: "mike@example.com",
      to: "test-fixed@example.com",
      content: "Great news! Your application has been approved and is now in the final review stage. We should have the funds disbursed within 5-7 business days.",
      status: "read",
      priority: "medium",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      loanFileId: "loan-2",
      clientId: "client-2",
    },
    {
      _id: "3",
      subject: "Meeting scheduled for tomorrow",
      from: "Lisa Chen",
      fromEmail: "lisa@example.com",
      to: "test-fixed@example.com",
      content: "Just a reminder that we have our weekly check-in meeting scheduled for tomorrow at 2 PM. Please prepare any questions you might have about your loan progress.",
      status: "read",
      priority: "low",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      loanFileId: "loan-3",
      clientId: "client-3",
    },
  ];

  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchQuery === "" || 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "all", label: "All Messages" },
    { value: "unread", label: "Unread" },
    { value: "read", label: "Read" },
    { value: "archived", label: "Archived" },
  ];

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">
            Communicate with clients and team members
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Messages</span>
                <Badge variant="default" size="sm">
                  {filteredMessages.filter(m => m.status === "unread").length} unread
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredMessages.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No messages found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <div
                      key={message._id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedMessage === message._id ? "bg-[#D4AF37]/5 border-r-2 border-[#D4AF37]" : ""
                      } ${message.status === "unread" ? "bg-blue-50" : ""}`}
                      onClick={() => setSelectedMessage(message._id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{message.from}</p>
                            <p className="text-xs text-gray-500">{message.fromEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge
                            className={`text-xs ${priorityColors[message.priority as keyof typeof priorityColors]}`}
                            size="sm"
                          >
                            {message.priority}
                          </Badge>
                          {message.status === "unread" && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatTimeAgo(message.createdAt)}</span>
                        <div className="flex items-center space-x-1">
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Star className="w-3 h-3" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Archive className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {filteredMessages.find(m => m._id === selectedMessage)?.subject}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      From: {filteredMessages.find(m => m._id === selectedMessage)?.from} &lt;
                      {filteredMessages.find(m => m._id === selectedMessage)?.fromEmail}&gt;
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Reply className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTimeAgo(filteredMessages.find(m => m._id === selectedMessage)?.createdAt || new Date())}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      To: {filteredMessages.find(m => m._id === selectedMessage)?.to}
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {filteredMessages.find(m => m._id === selectedMessage)?.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a message
                </h3>
                <p className="text-gray-500">
                  Choose a message from the list to view its content
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Stats */}
      {filteredMessages.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {filteredMessages.length}
                </div>
                <div className="text-sm text-gray-500">Total Messages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredMessages.filter(m => m.status === "unread").length}
                </div>
                <div className="text-sm text-gray-500">Unread</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredMessages.filter(m => m.priority === "high").length}
                </div>
                <div className="text-sm text-gray-500">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredMessages.filter(m => m.status === "read").length}
                </div>
                <div className="text-sm text-gray-500">Read</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
