"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Download,
  Settings,
  Crown,
  Zap,
  Building,
} from "lucide-react";

export default function BillingPage() {
  const { workspace } = useWorkspace();
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Mock billing data - replace with real Convex queries when available
  const billingData = {
    currentPlan: {
      name: "Solo",
      tier: "solo",
      price: 29,
      interval: "month",
      features: [
        "Up to 5 clients",
        "Unlimited loan files",
        "Basic reporting",
        "Email support",
      ],
      limits: {
        clients: 5,
        loanFiles: -1, // unlimited
        storage: "1GB",
        users: 1,
      },
    },
    usage: {
      clients: 2,
      loanFiles: 8,
      storage: "256MB",
      users: 1,
    },
    subscription: {
      status: "active",
      currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      amount: 29,
    },
    invoices: [
      {
        id: "inv_001",
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        amount: 29,
        status: "paid",
        downloadUrl: "#",
      },
      {
        id: "inv_002",
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        amount: 29,
        status: "paid",
        downloadUrl: "#",
      },
    ],
  };

  const plans = [
    {
      name: "Solo",
      tier: "solo",
      price: 29,
      interval: "month",
      description: "Perfect for individual loan officers",
      features: [
        "Up to 5 clients",
        "Unlimited loan files",
        "Basic reporting",
        "Email support",
      ],
      current: billingData.currentPlan.tier === "solo",
      popular: false,
    },
    {
      name: "Team",
      tier: "team",
      price: 79,
      interval: "month",
      description: "Great for small teams",
      features: [
        "Up to 25 clients",
        "Unlimited loan files",
        "Advanced reporting",
        "Priority support",
        "Team collaboration",
      ],
      current: billingData.currentPlan.tier === "team",
      popular: true,
    },
    {
      name: "Enterprise",
      tier: "enterprise",
      price: 199,
      interval: "month",
      description: "For large organizations",
      features: [
        "Unlimited clients",
        "Unlimited loan files",
        "Custom reporting",
        "24/7 phone support",
        "Custom integrations",
        "Dedicated account manager",
      ],
      current: billingData.currentPlan.tier === "enterprise",
      popular: false,
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return "text-green-600";
    if (percentage < 80) return "text-yellow-600";
    return "text-red-600";
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
          <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600">
            Manage your subscription and billing information
          </p>
        </div>
        <Button onClick={() => setIsUpgrading(true)}>
          <Crown className="w-4 h-4 mr-2" />
          Upgrade Plan
        </Button>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="w-5 h-5 mr-2" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Your current subscription details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {billingData.currentPlan.name}
              </h3>
              <p className="text-gray-600">
                {formatCurrency(billingData.currentPlan.price)}/{billingData.currentPlan.interval}
              </p>
              <Badge
                variant={billingData.subscription.status === "active" ? "success" : "warning"}
                className="mt-2"
              >
                {billingData.subscription.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Next billing date</p>
              <p className="font-medium">
                {formatDate(billingData.subscription.nextBillingDate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {billingData.usage.clients}
                  {billingData.currentPlan.limits.clients !== -1 && (
                    <span className="text-sm font-normal text-gray-500">
                      /{billingData.currentPlan.limits.clients}
                    </span>
                  )}
                </p>
              </div>
              <Users className="w-8 h-8 text-[#D4AF37]" />
            </div>
            {billingData.currentPlan.limits.clients !== -1 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#D4AF37] h-2 rounded-full"
                    style={{
                      width: `${getUsagePercentage(
                        billingData.usage.clients,
                        billingData.currentPlan.limits.clients
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className={`text-xs mt-1 ${getUsageColor(
                  getUsagePercentage(
                    billingData.usage.clients,
                    billingData.currentPlan.limits.clients
                  )
                )}`}>
                  {getUsagePercentage(
                    billingData.usage.clients,
                    billingData.currentPlan.limits.clients
                  ).toFixed(0)}% used
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Loan Files</p>
                <p className="text-2xl font-bold text-gray-900">
                  {billingData.usage.loanFiles}
                  {billingData.currentPlan.limits.loanFiles !== -1 && (
                    <span className="text-sm font-normal text-gray-500">
                      /{billingData.currentPlan.limits.loanFiles}
                    </span>
                  )}
                </p>
              </div>
              <FileText className="w-8 h-8 text-[#D4AF37]" />
            </div>
            {billingData.currentPlan.limits.loanFiles !== -1 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#D4AF37] h-2 rounded-full"
                    style={{
                      width: `${getUsagePercentage(
                        billingData.usage.loanFiles,
                        billingData.currentPlan.limits.loanFiles
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className={`text-xs mt-1 ${getUsageColor(
                  getUsagePercentage(
                    billingData.usage.loanFiles,
                    billingData.currentPlan.limits.loanFiles
                  )
                )}`}>
                  {getUsagePercentage(
                    billingData.usage.loanFiles,
                    billingData.currentPlan.limits.loanFiles
                  ).toFixed(0)}% used
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {billingData.usage.storage}
                  <span className="text-sm font-normal text-gray-500">
                    /{billingData.currentPlan.limits.storage}
                  </span>
                </p>
              </div>
              <Settings className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#D4AF37] h-2 rounded-full"
                  style={{
                    width: `${getUsagePercentage(
                      parseFloat(billingData.usage.storage),
                      parseFloat(billingData.currentPlan.limits.storage)
                    )}%`,
                  }}
                ></div>
              </div>
              <p className={`text-xs mt-1 ${getUsageColor(
                getUsagePercentage(
                  parseFloat(billingData.usage.storage),
                  parseFloat(billingData.currentPlan.limits.storage)
                )
              )}`}>
                {getUsagePercentage(
                  parseFloat(billingData.usage.storage),
                  parseFloat(billingData.currentPlan.limits.storage)
                ).toFixed(0)}% used
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {billingData.usage.users}
                  <span className="text-sm font-normal text-gray-500">
                    /{billingData.currentPlan.limits.users}
                  </span>
                </p>
              </div>
              <Users className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#D4AF37] h-2 rounded-full"
                  style={{
                    width: `${getUsagePercentage(
                      billingData.usage.users,
                      billingData.currentPlan.limits.users
                    )}%`,
                  }}
                ></div>
              </div>
              <p className={`text-xs mt-1 ${getUsageColor(
                getUsagePercentage(
                  billingData.usage.users,
                  billingData.currentPlan.limits.users
                )
              )}`}>
                {getUsagePercentage(
                  billingData.usage.users,
                  billingData.currentPlan.limits.users
                ).toFixed(0)}% used
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Billing History
          </CardTitle>
          <CardDescription>
            Your recent invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingData.invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Invoice {invoice.id}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(invoice.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <Badge
                      variant={invoice.status === "paid" ? "success" : "warning"}
                      size="sm"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      {isUpgrading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.tier}
                  className={`relative ${
                    plan.popular ? "ring-2 ring-[#D4AF37]" : ""
                  } ${plan.current ? "opacity-75" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#D4AF37] text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{plan.name}</span>
                      {plan.current && (
                        <Badge variant="default">Current</Badge>
                      )}
                    </CardTitle>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(plan.price)}
                      <span className="text-lg font-normal text-gray-500">
                        /{plan.interval}
                      </span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.current ? "outline" : "default"}
                      disabled={plan.current}
                    >
                      {plan.current ? "Current Plan" : "Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setIsUpgrading(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
