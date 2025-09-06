import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, FileText, Users, CheckCircle, Zap, Building2 } from "lucide-react";
import Link from "next/link";

// Define the available resource pages
const resourcePages: Record<string, { title: string; description: string; icon: any; content: string[] }> = {
  "documentation": {
    title: "Documentation",
    description: "Complete setup and usage guides for LoanFlow Pro.",
    icon: FileText,
    content: [
      "Getting Started Guide",
      "User Manual",
      "API Documentation",
      "Integration Guides",
      "Troubleshooting",
      "Best Practices"
    ]
  },
  "video-tutorials": {
    title: "Video Tutorials",
    description: "Step-by-step training videos to help you master LoanFlow Pro.",
    icon: FileText,
    content: [
      "Platform Overview",
      "Setting Up Your Workspace",
      "Managing Clients",
      "Document Workflow",
      "Reporting and Analytics",
      "Advanced Features"
    ]
  },
  "webinars": {
    title: "Webinars",
    description: "Live training sessions with our experts and community.",
    icon: Users,
    content: [
      "Weekly Product Updates",
      "Industry Best Practices",
      "Advanced Workflow Tips",
      "Q&A Sessions",
      "Guest Expert Talks",
      "Community Showcases"
    ]
  },
  "best-practices": {
    title: "Best Practices",
    description: "Industry best practices guide for loan workflow management.",
    icon: CheckCircle,
    content: [
      "Client Onboarding Process",
      "Document Management",
      "Communication Strategies",
      "Compliance Guidelines",
      "Performance Optimization",
      "Security Best Practices"
    ]
  },
  "help-center": {
    title: "Help Center",
    description: "Self-service support portal with answers to common questions.",
    icon: FileText,
    content: [
      "Frequently Asked Questions",
      "Knowledge Base Articles",
      "Troubleshooting Guides",
      "Feature Explanations",
      "Integration Help",
      "Account Management"
    ]
  },
  "live-chat": {
    title: "Live Chat",
    description: "Real-time support assistance from our expert team.",
    icon: Users,
    content: [
      "Instant Technical Support",
      "Feature Guidance",
      "Integration Help",
      "Account Questions",
      "Billing Support",
      "General Inquiries"
    ]
  },
  "phone-support": {
    title: "Phone Support",
    description: "Direct phone support for urgent issues and complex questions.",
    icon: Users,
    content: [
      "Priority Technical Support",
      "Complex Issue Resolution",
      "Account Management",
      "Integration Assistance",
      "Training Consultations",
      "Emergency Support"
    ]
  },
  "priority-support": {
    title: "Priority Support",
    description: "Dedicated support for enterprise customers with guaranteed response times.",
    icon: Building2,
    content: [
      "Dedicated Account Manager",
      "Guaranteed Response Times",
      "Priority Feature Requests",
      "Custom Training Sessions",
      "Direct Developer Access",
      "SLA Guarantees"
    ]
  },
  "user-forum": {
    title: "User Forum",
    description: "Connect with other users and share experiences and tips.",
    icon: Users,
    content: [
      "Community Discussions",
      "Feature Requests",
      "User Tips and Tricks",
      "Integration Examples",
      "Success Stories",
      "Peer Support"
    ]
  },
  "feature-requests": {
    title: "Feature Requests",
    description: "Suggest new features and vote on upcoming developments.",
    icon: Zap,
    content: [
      "Submit Feature Ideas",
      "Vote on Proposals",
      "Track Development Status",
      "Provide Feedback",
      "Collaborate with Team",
      "See Roadmap Updates"
    ]
  },
  "success-stories": {
    title: "Success Stories",
    description: "Customer success case studies and testimonials.",
    icon: CheckCircle,
    content: [
      "Customer Case Studies",
      "ROI Success Stories",
      "Implementation Examples",
      "Industry Spotlights",
      "Video Testimonials",
      "Award Recognition"
    ]
  },
  "partner-program": {
    title: "Partner Program",
    description: "Become a certified partner and grow your business with us.",
    icon: Building2,
    content: [
      "Partner Certification",
      "Revenue Sharing",
      "Marketing Support",
      "Technical Training",
      "Co-marketing Opportunities",
      "Dedicated Resources"
    ]
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resource = resourcePages[params.slug];
  
  if (!resource) {
    return {
      title: "Resource Not Found - LoanFlow Pro",
      description: "The requested resource page could not be found."
    };
  }

  return {
    title: `${resource.title} - LoanFlow Pro`,
    description: resource.description,
  };
}

export default function ResourcePage({ params }: { params: { slug: string } }) {
  const resource = resourcePages[params.slug];
  
  if (!resource) {
    notFound();
  }

  const IconComponent = resource.icon;

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
              {resource.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {resource.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What's Included</h2>
          <p className="text-lg text-gray-600">Everything you need to succeed with {resource.title.toLowerCase()}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resource.content.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">{item}</p>
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
            Access all our resources and start your journey with LoanFlow Pro today.
          </p>
          <Button size="lg" className="bg-white text-[#D4AF37] hover:bg-gray-100" asChild>
            <Link href="/auth/signup">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
