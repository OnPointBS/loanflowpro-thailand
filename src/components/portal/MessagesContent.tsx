"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  ArrowLeft,
  MessageSquare,
  Send,
  User,
  Building2,
  Clock,
  CheckCircle,
  Eye,
  Phone,
  Mail,
  Calendar,
  FileText,
  Download,
  Upload,
  MoreVertical,
  Search
} from "lucide-react";

export default function MessagesContent() {
  const { user, workspace, logout } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showClientProfile, setShowClientProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - in real app, fetch from Convex
  const conversations = [
    {
      id: "1",
      participant: {
        id: "advisor1",
        name: "Sarah Johnson",
        role: "Senior Advisor",
        avatar: "SJ",
        status: "online"
      },
      lastMessage: "I've reviewed your business plan. It looks great! We just need a few more financial documents.",
      lastMessageTime: "2 hours ago",
      unreadCount: 2,
      isActive: true
    },
    {
      id: "2",
      participant: {
        id: "staff1",
        name: "Mike Wilson",
        role: "Loan Processor",
        avatar: "MW",
        status: "away"
      },
      lastMessage: "Your tax returns have been processed. Everything looks good so far.",
      lastMessageTime: "1 day ago",
      unreadCount: 0,
      isActive: false
    }
  ];

  const messages = useMemo(() => [
    {
      id: "1",
      senderId: "advisor1",
      senderName: "Sarah Johnson",
      content: "Hi John! I've reviewed your SBA 7(a) loan application. Everything looks great so far!",
      timestamp: "2024-01-20 10:30 AM",
      isFromClient: false,
      attachments: []
    },
    {
      id: "2",
      senderId: "client1",
      senderName: "John Doe",
      content: "Thank you Sarah! I'm excited to move forward with this. What's the next step?",
      timestamp: "2024-01-20 10:45 AM",
      isFromClient: true,
      attachments: []
    },
    {
      id: "3",
      senderId: "advisor1",
      senderName: "Sarah Johnson",
      content: "I've reviewed your business plan. It looks great! We just need a few more financial documents. I've uploaded a checklist for you.",
      timestamp: "2024-01-20 11:00 AM",
      isFromClient: false,
      attachments: [
        { name: "Document Checklist.pdf", type: "pdf", size: "2.3 MB" }
      ]
    },
    {
      id: "4",
      senderId: "client1",
      senderName: "John Doe",
      content: "Perfect! I'll work on getting those documents together. Should I upload them here or through the loan file page?",
      timestamp: "2024-01-20 11:15 AM",
      isFromClient: true,
      attachments: []
    },
    {
      id: "5",
      senderId: "advisor1",
      senderName: "Sarah Johnson",
      content: "You can upload them directly in the loan file page - it's more organized that way. I'll be notified when you upload them.",
      timestamp: "2024-01-20 11:20 AM",
      isFromClient: false,
      attachments: []
    }
  ], []);

  const clientProfile = {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    company: "Doe Enterprises LLC",
    loanAmount: "$150,000",
    loanType: "SBA 7(a)",
    applicationDate: "2024-01-15",
    status: "In Progress",
    progress: 65,
    documents: [
      { name: "Business Plan.pdf", uploaded: true, date: "2024-01-18" },
      { name: "Financial Statements 2023.pdf", uploaded: true, date: "2024-01-19" },
      { name: "Tax Returns 2023.pdf", uploaded: false, date: null }
    ]
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, call Convex mutation to send message
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  if (!user || !workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-black font-bold">Please log in to access the client portal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/portal'}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">
                  Messages - {workspace.name}
                </h1>
                <p className="text-sm text-black font-semibold">Direct communication with your team</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-black" />
                <span className="text-sm text-black font-bold">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-black font-bold">Conversations</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation === conversation.id ? "bg-[#D4AF37]/10 border-r-2 border-[#D4AF37]" : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {conversation.participant.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            conversation.participant.status === "online" ? "bg-green-500" : "bg-gray-400"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-black truncate">
                              {conversation.participant.name}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-[#D4AF37] text-white text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {conversation.participant.role}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {conversation.lastMessageTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedConversation ? (
              <Card variant="glass" className="h-[600px] flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedConv?.participant.avatar}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black">
                          {selectedConv?.participant.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedConv?.participant.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowClientProfile(true)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Profile</span>
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromClient ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isFromClient 
                            ? "bg-[#D4AF37] text-white" 
                            : "bg-gray-100 text-black"
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-semibold">
                              {message.senderName}
                            </span>
                            <span className="text-xs opacity-75">
                              {message.timestamp}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          
                          {/* Attachments */}
                          {message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center space-x-2 p-2 bg-white/20 rounded">
                                  <FileText className="w-4 h-4" />
                                  <span className="text-xs truncate">{attachment.name}</span>
                                  <Button size="sm" variant="outline" className="text-xs p-1">
                                    <Download className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Upload className="w-4 h-4" />
                    </Button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-[#D4AF37] hover:bg-[#B8941F]"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card variant="glass" className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Client Profile Modal */}
      {showClientProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">Client Profile</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowClientProfile(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                  {clientProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 className="text-lg font-bold text-black">{clientProfile.name}</h4>
                <p className="text-gray-600">{clientProfile.company}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-black">{clientProfile.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-black">{clientProfile.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-black">{clientProfile.loanType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-black">{clientProfile.loanAmount}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-semibold text-black mb-2">Document Status</h5>
                <div className="space-y-2">
                  {clientProfile.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-black">{doc.name}</span>
                      <div className="flex items-center space-x-2">
                        {doc.uploaded ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Uploaded</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={() => setShowClientProfile(false)}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowClientProfile(false);
                    // Navigate to full client profile
                  }}
                >
                  View Full Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
