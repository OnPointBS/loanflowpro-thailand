"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Settings,
  Save,
  Building2,
  Users,
  Mail,
  Shield,
  Palette,
  Globe,
  Clock,
  Bell,
  Key,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const { workspace } = useWorkspace();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [settings, setSettings] = useState({
    workspace: {
      name: workspace?.name || "",
      slug: workspace?.slug || "",
      timezone: workspace?.settings?.timezone || "America/New_York",
      dateFormat: workspace?.settings?.dateFormat || "MM/DD/YYYY",
      timeFormat: workspace?.settings?.timeFormat || "12h",
    },
    branding: {
      companyName: workspace?.settings?.branding?.companyName || "",
      primaryColor: workspace?.settings?.branding?.primaryColor || "#D4AF37",
      logoUrl: workspace?.settings?.branding?.logoUrl || "",
    },
    permissions: {
      allowClientRegistration: workspace?.settings?.allowClientRegistration || true,
      requireApproval: workspace?.settings?.requireApproval || false,
    },
    notifications: {
      email: true,
      inApp: true,
      frequency: "immediate" as "immediate" | "hourly" | "daily",
      types: {
        taskAssigned: true,
        taskCompleted: true,
        taskOverdue: true,
        clientAdded: true,
        clientUpdated: true,
        loanFileStatusChange: true,
        documentUploaded: true,
        messageReceived: true,
        invitationReceived: true,
        systemAlert: true,
      },
    },
  });

  const updateWorkspace = useMutation(api.auth.updateWorkspace);
  const notificationSettings = useQuery(
    api.notifications.getUserNotificationSettings,
    user ? { userId: user._id } : "skip"
  );
  const updateNotificationSettings = useMutation(api.notifications.updateNotificationSettings);

  // Load notification settings when they're available
  useEffect(() => {
    if (notificationSettings) {
      setSettings(prev => ({
        ...prev,
        notifications: notificationSettings,
      }));
    }
  }, [notificationSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // Update workspace settings
      await updateWorkspace({
        workspaceId: workspace._id,
        updates: {
          name: settings.workspace.name,
          slug: settings.workspace.slug,
          settings: {
            timezone: settings.workspace.timezone,
            dateFormat: settings.workspace.dateFormat,
            timeFormat: settings.workspace.timeFormat,
            allowClientRegistration: settings.permissions.allowClientRegistration,
            requireApproval: settings.permissions.requireApproval,
            branding: {
              companyName: settings.branding.companyName,
              primaryColor: settings.branding.primaryColor,
              logoUrl: settings.branding.logoUrl,
            },
          },
        },
      });

      // Update notification settings
      if (user) {
        await updateNotificationSettings({
          userId: user._id,
          settings: settings.notifications,
        });
      }

      setSuccess("Settings saved successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
  ];

  const getNotificationDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      taskAssigned: "When a task is assigned to you",
      taskCompleted: "When a task is marked as completed",
      taskOverdue: "When a task becomes overdue",
      clientAdded: "When a new client is added",
      clientUpdated: "When client information is updated",
      loanFileStatusChange: "When loan file status changes",
      documentUploaded: "When documents are uploaded",
      messageReceived: "When you receive a message",
      invitationReceived: "When you receive an invitation",
      systemAlert: "Important system notifications",
    };
    return descriptions[type] || "Notification type";
  };

  const dateFormats = [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your workspace settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Workspace Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Workspace Information
          </CardTitle>
          <CardDescription>
            Basic information about your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Workspace Name"
              value={settings.workspace.name}
              onChange={(e) => handleChange("workspace", "name", e.target.value)}
              placeholder="My Loan Company"
            />
            <Input
              label="Workspace Slug"
              value={settings.workspace.slug}
              onChange={(e) => handleChange("workspace", "slug", e.target.value)}
              placeholder="my-loan-company"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={settings.workspace.timezone}
                onChange={(e) => handleChange("workspace", "timezone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none"
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Format
              </label>
              <select
                value={settings.workspace.dateFormat}
                onChange={(e) => handleChange("workspace", "dateFormat", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none"
              >
                {dateFormats.map(format => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Format
              </label>
              <select
                value={settings.workspace.timeFormat}
                onChange={(e) => handleChange("workspace", "timeFormat", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none"
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Branding
          </CardTitle>
          <CardDescription>
            Customize the appearance of your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name"
              value={settings.branding.companyName}
              onChange={(e) => handleChange("branding", "companyName", e.target.value)}
              placeholder="Your Company Name"
            />
            <Input
              label="Logo URL"
              value={settings.branding.logoUrl}
              onChange={(e) => handleChange("branding", "logoUrl", e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.branding.primaryColor}
                onChange={(e) => handleChange("branding", "primaryColor", e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <Input
                value={settings.branding.primaryColor}
                onChange={(e) => handleChange("branding", "primaryColor", e.target.value)}
                placeholder="#D4AF37"
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Permissions
          </CardTitle>
          <CardDescription>
            Control access and registration settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Allow Client Registration</h4>
                <p className="text-sm text-gray-500">
                  Allow clients to register themselves for the portal
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.permissions.allowClientRegistration}
                  onChange={(e) => handleChange("permissions", "allowClientRegistration", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Require Approval</h4>
                <p className="text-sm text-gray-500">
                  Require admin approval for new client registrations
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.permissions.requireApproval}
                  onChange={(e) => handleChange("permissions", "requireApproval", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-lg">General Settings</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-slate-900">Email Notifications</h5>
                <p className="text-sm text-slate-600">
                  Receive notifications via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleChange("notifications", "email", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-slate-900">In-App Notifications</h5>
                <p className="text-sm text-slate-600">
                  Show notifications in the application
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.inApp}
                  onChange={(e) => handleChange("notifications", "inApp", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Notification Frequency
              </label>
              <select
                value={settings.notifications.frequency}
                onChange={(e) => handleChange("notifications", "frequency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none"
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly Digest</option>
                <option value="daily">Daily Digest</option>
              </select>
            </div>
          </div>

          {/* Notification Types */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-lg">Notification Types</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings.notifications.types).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <h5 className="font-bold text-slate-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h5>
                    <p className="text-xs text-slate-600">
                      {getNotificationDescription(key)}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleChange("notifications", "types", {
                        ...settings.notifications.types,
                        [key]: e.target.checked,
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Trash2 className="w-5 h-5 mr-2" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-medium text-red-900">Delete Workspace</h4>
                <p className="text-sm text-red-600">
                  Permanently delete this workspace and all its data
                </p>
              </div>
              <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                Delete Workspace
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
