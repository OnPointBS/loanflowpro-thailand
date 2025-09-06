"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, X, Check, Trash2, ExternalLink } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { formatDistanceToNow } from "date-fns";

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className = "" }: NotificationBellProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const notifications = useQuery(
    api.notifications.getUserNotifications,
    user ? { userId: user._id, limit: 20 } : "skip"
  );

  const unreadCount = useQuery(
    api.notifications.getUnreadCount,
    user ? { userId: user._id } : "skip"
  );

  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const handleNotificationClick = async (notificationId: string, actionUrl?: string) => {
    // Mark as read
    await markAsRead({ notificationId });
    
    // Navigate if action URL provided
    if (actionUrl) {
      window.location.href = actionUrl;
    }
  };

  const handleMarkAllAsRead = async () => {
    if (user) {
      await markAllAsRead({ userId: user._id });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification({ notificationId });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "taskAssigned":
      case "taskCompleted":
      case "taskOverdue":
        return "📋";
      case "clientAdded":
      case "clientUpdated":
        return "👤";
      case "loanFileStatusChange":
        return "📄";
      case "documentUploaded":
        return "📎";
      case "messageReceived":
        return "💬";
      case "invitationReceived":
        return "✉️";
      case "systemAlert":
        return "⚠️";
      default:
        return "🔔";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Bell Icon */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-slate-100 rounded-full"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount && unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-hidden z-50 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-bold text-slate-900">
                Notifications
              </CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount && unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-slate-600 hover:text-slate-900"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 max-h-80 overflow-y-auto">
              {notifications && notifications.length > 0 ? (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                      onClick={() => handleNotificationClick(
                        notification._id,
                        notification.actionUrl
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-1">
                              <Badge
                                variant="outline"
                                className={`text-xs ${getPriorityColor(notification.priority)}`}
                              >
                                {notification.priority}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slate-500">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                            
                            <div className="flex items-center space-x-1">
                              {notification.actionUrl && (
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notification._id);
                                }}
                                className="p-1 h-6 w-6 text-slate-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-600 mb-1">
                    No notifications
                  </h3>
                  <p className="text-xs text-slate-500">
                    You're all caught up!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
