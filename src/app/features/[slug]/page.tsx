import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";

// Define the available feature pages
const featurePages: Record<string, { title: string; description: string }> = {
  "client-portal": {
    title: "Client Portal",
    description: "Secure client access and communication platform for loan workflow management."
  },
  "document-management": {
    title: "Document Management", 
    description: "Organized file storage and sharing system for loan workflow management."
  },
  "application-processing": {
    title: "Application Processing",
    description: "Streamlined loan application processing with automated workflows."
  },
  "communication-hub": {
    title: "Communication Hub",
    description: "Built-in messaging and notifications system for seamless collaboration."
  },
  "task-management": {
    title: "Task Management",
    description: "Automated task assignment and tracking for efficient workflow management."
  },
  "loan-types": {
    title: "Loan Types",
    description: "Pre-configured loan workflows for different lending scenarios."
  },
  "document-processing": {
    title: "Document Processing",
    description: "OCR and automated document handling for streamlined operations."
  },
  "compliance-tracking": {
    title: "Compliance Tracking",
    description: "Regulatory compliance monitoring and reporting system."
  },
  "real-time-dashboard": {
    title: "Real-time Dashboard",
    description: "Live performance metrics and analytics for informed decision making."
  },
  "custom-reports": {
    title: "Custom Reports",
    description: "Detailed analytics and insights tailored to your business needs."
  },
  "staff-performance": {
    title: "Staff Performance",
    description: "Team productivity tracking and performance analytics."
  },
  "client-analytics": {
    title: "Client Analytics",
    description: "Client engagement metrics and relationship management insights."
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const feature = featurePages[params.slug];
  
  if (!feature) {
    return {
      title: "Feature Not Found - LoanFlow Pro",
      description: "The requested feature page could not be found."
    };
  }

  return {
    title: `${feature.title} - LoanFlow Pro`,
    description: feature.description,
  };
}

export default function FeaturePage({ params }: { params: { slug: string } }) {
  const feature = featurePages[params.slug];
  
  if (!feature) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {feature.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {feature.description}
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

      {/* Coming Soon Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-[#D4AF37] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
            <CardDescription className="text-lg">
              We're working hard to bring you detailed information about this feature. 
              In the meantime, explore our other features or get started with a free trial.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
                <Link href="/features">Explore All Features</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="bg-[#D4AF37] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of advisors who trust LoanFlow Pro for their workflow management needs.
          </p>
          <Button size="lg" className="bg-white text-[#D4AF37] hover:bg-gray-100" asChild>
            <Link href="/auth/signup">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
