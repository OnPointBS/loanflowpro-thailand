import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  CheckCircle, 
  FileText,
  Users,
  Clock,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Building2
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Application Processing - LoanFlow Pro",
  description: "Streamlined loan application processing with automated workflows.",
};

export default function ApplicationProcessingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Application Processing
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your loan application process with automated workflows and intelligent processing.
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

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Automated Workflows</CardTitle>
              <CardDescription>
                Pre-configured processes that guide applications through each stage automatically.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Smart Forms</CardTitle>
              <CardDescription>
                Dynamic forms that adapt based on loan type and applicant information.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Validation Engine</CardTitle>
              <CardDescription>
                Real-time validation and error checking to ensure complete applications.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Real-time visibility into application status and processing timeline.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Comprehensive reporting on application volumes, processing times, and success rates.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Compliance Management</CardTitle>
              <CardDescription>
                Built-in compliance checks and regulatory requirement tracking.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#D4AF37] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Applications?</h2>
          <p className="text-xl mb-8 opacity-90">
            Transform your loan processing with automated workflows and intelligent validation.
          </p>
          <Button size="lg" className="bg-white text-[#D4AF37] hover:bg-gray-100" asChild>
            <Link href="/auth/signup">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
