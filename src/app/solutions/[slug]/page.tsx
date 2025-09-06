import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Building2, Users, Shield, Zap } from "lucide-react";
import Link from "next/link";

// Define the available solution pages
const solutionPages: Record<string, { title: string; description: string; icon: any; features: string[] }> = {
  "mortgage-brokers": {
    title: "Mortgage Brokers",
    description: "Complete mortgage workflow management solution designed specifically for mortgage brokers.",
    icon: Building2,
    features: [
      "Automated pre-qualification process",
      "Real-time rate updates and comparisons",
      "Document collection and verification",
      "Client communication tools",
      "Compliance tracking and reporting",
      "Integration with major lenders"
    ]
  },
  "commercial-lenders": {
    title: "Commercial Lenders",
    description: "Commercial loan processing solutions for banks and financial institutions.",
    icon: Building2,
    features: [
      "Complex deal structuring tools",
      "Risk assessment and underwriting",
      "Regulatory compliance management",
      "Multi-party collaboration",
      "Advanced reporting and analytics",
      "Integration with core banking systems"
    ]
  },
  "credit-unions": {
    title: "Credit Unions",
    description: "Member-focused lending platforms designed for credit union operations.",
    icon: Users,
    features: [
      "Member relationship management",
      "Personalized lending experiences",
      "Community-focused features",
      "Member communication tools",
      "Compliance with NCUA regulations",
      "Integration with core systems"
    ]
  },
  "private-lenders": {
    title: "Private Lenders",
    description: "Private lending workflow automation for alternative lending solutions.",
    icon: Shield,
    features: [
      "Flexible loan structuring",
      "Alternative underwriting criteria",
      "Investor management tools",
      "Risk assessment models",
      "Custom reporting capabilities",
      "Regulatory compliance tracking"
    ]
  },
  "solo-advisors": {
    title: "Solo Advisors",
    description: "Individual advisor tools for independent loan professionals.",
    icon: Users,
    features: [
      "Personal client management",
      "Streamlined application process",
      "Document organization",
      "Client communication tools",
      "Basic reporting and analytics",
      "Affordable pricing"
    ]
  },
  "small-teams": {
    title: "Small Teams",
    description: "Collaborative tools for 2-10 person lending teams.",
    icon: Users,
    features: [
      "Team collaboration features",
      "Shared client management",
      "Task assignment and tracking",
      "Team performance metrics",
      "Centralized document storage",
      "Scalable pricing"
    ]
  },
  "growing-companies": {
    title: "Growing Companies",
    description: "Scalable solutions for 10-50 person organizations.",
    icon: Building2,
    features: [
      "Department-level organization",
      "Advanced workflow automation",
      "Comprehensive reporting suite",
      "Multi-role access controls",
      "API integrations",
      "Dedicated support"
    ]
  },
  "enterprise": {
    title: "Enterprise",
    description: "Large-scale implementations for major financial institutions.",
    icon: Building2,
    features: [
      "Custom development capabilities",
      "Enterprise-grade security",
      "Unlimited scalability",
      "Dedicated account management",
      "Custom integrations",
      "24/7 priority support"
    ]
  },
  "crm-integration": {
    title: "CRM Integration",
    description: "Connect with existing CRM systems for seamless data flow.",
    icon: Zap,
    features: [
      "Salesforce integration",
      "HubSpot connectivity",
      "Custom API endpoints",
      "Real-time data sync",
      "Bidirectional data flow",
      "Custom field mapping"
    ]
  },
  "api-access": {
    title: "API Access",
    description: "Custom integrations and automation through our comprehensive API.",
    icon: Zap,
    features: [
      "RESTful API endpoints",
      "Webhook support",
      "SDK libraries",
      "Comprehensive documentation",
      "Rate limiting and security",
      "Developer support"
    ]
  },
  "white-label": {
    title: "White Label",
    description: "Branded solutions for your business with custom theming.",
    icon: Shield,
    features: [
      "Custom branding and theming",
      "White-label client portals",
      "Custom domain support",
      "Branded email templates",
      "Custom reporting",
      "Dedicated support"
    ]
  },
  "custom-development": {
    title: "Custom Development",
    description: "Tailored feature development for unique business requirements.",
    icon: Zap,
    features: [
      "Custom feature development",
      "Workflow customization",
      "Integration development",
      "UI/UX customization",
      "Performance optimization",
      "Ongoing maintenance"
    ]
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const solution = solutionPages[params.slug];
  
  if (!solution) {
    return {
      title: "Solution Not Found - LoanFlow Pro",
      description: "The requested solution page could not be found."
    };
  }

  return {
    title: `${solution.title} - LoanFlow Pro`,
    description: solution.description,
  };
}

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const solution = solutionPages[params.slug];
  
  if (!solution) {
    notFound();
  }

  const IconComponent = solution.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-[#D4AF37] rounded-lg flex items-center justify-center mx-auto mb-6">
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {solution.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {solution.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-lg text-gray-600">Everything you need to succeed with {solution.title.toLowerCase()}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solution.features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">{feature}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#D4AF37] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who trust LoanFlow Pro for their {solution.title.toLowerCase()} needs.
          </p>
          <Button size="lg" className="bg-white text-[#D4AF37] hover:bg-gray-100" asChild>
            <Link href="/auth/signup">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}