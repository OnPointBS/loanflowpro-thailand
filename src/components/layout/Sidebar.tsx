"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Badge } from "@/components/ui/Badge";
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderOpen,
  MessageSquare,
  CreditCard,
  Settings,
  Menu,
  X,
  Building2,
  BarChart3,
  FileCheck,
  Upload,
  Mail,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/app", icon: LayoutDashboard },
  { name: "Clients", href: "/app/clients", icon: Users },
  { name: "Loan Files", href: "/app/loan-files", icon: FileText },
  { name: "Loan Types", href: "/app/loan-types", icon: FolderOpen },
  { name: "Messages", href: "/app/messages", icon: MessageSquare },
  { name: "Invitations", href: "/app/invitations", icon: Mail },
  { name: "Seats", href: "/app/seats", icon: UserCheck },
  { name: "Billing", href: "/app/billing", icon: CreditCard },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

const quickActions = [
  { name: "New Client", href: "/app/clients/new", icon: Users },
  { name: "New Loan File", href: "/app/loan-files/new", icon: FileText },
  { name: "Upload Document", href: "/app/documents/upload", icon: Upload },
  { name: "View Reports", href: "/app/reports", icon: BarChart3 },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCollapsed, toggleCollapse } = useSidebar();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { workspace, isTrial } = useWorkspace();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-lg border border-gray-200"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-200 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Collapse Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    LoanFlow Pro
                  </h1>
                  {workspace && (
                    <p className="text-sm text-gray-500">{workspace.name}</p>
                  )}
                </div>
              )}
            </div>
            {/* Collapse Toggle Button - Only show on desktop */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>

          {/* User info */}
          {user && (
            <div className={cn("px-6 py-4 border-b border-gray-200", isCollapsed && "px-3")}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user.profile.firstName[0]}{user.profile.lastName[0]}
                  </span>
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.profile.firstName} {user.profile.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
              {isTrial && !isCollapsed && (
                <div className="mt-2">
                  <Badge variant="warning" size="sm">
                    Trial - {workspace?.subscriptionTier || 'solo'} Plan
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Navigation */}
            <nav className={cn("py-4 space-y-1", isCollapsed ? "px-2" : "px-4")}>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center text-sm font-medium rounded-lg transition-colors group",
                      isCollapsed ? "px-2 py-3 justify-center" : "px-3 py-2",
                      isActive
                        ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className={cn("py-4 border-t border-gray-200", isCollapsed ? "px-2" : "px-4")}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
              )}
              <div className="space-y-1">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    href={action.href}
                    className={cn(
                      "flex items-center text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group",
                      isCollapsed ? "px-2 py-3 justify-center" : "px-3 py-2"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    title={isCollapsed ? action.name : undefined}
                  >
                    <action.icon className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && action.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={cn("py-4 border-t border-gray-200", isCollapsed ? "px-2" : "px-4")}>
            {/* Sign Out Button */}
            <button
              onClick={logout}
              className={cn(
                "w-full flex items-center text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group mb-3",
                isCollapsed ? "px-2 py-3 justify-center" : "px-3 py-2"
              )}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && "Sign Out"}
            </button>
            
            {/* Copyright */}
            {!isCollapsed ? (
              <div className="text-xs text-gray-500">
                <p>© 2024 LoanFlow Pro</p>
                <p>Version 1.0.0</p>
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center">
                <p>v1.0.0</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
