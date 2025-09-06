import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  FileText, 
  Upload,
  Download,
  Search,
  Filter,
  Shield,
  Eye,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Settings,
  Database,
  Cloud,
  ArrowRight,
  Building2
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Document Management - LoanFlow Pro",
  description: "Organized file storage and sharing system for loan workflow management.",
};

export default function DocumentManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Document Management
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your document workflow with intelligent organization, secure storage, and automated processing.
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
                <Upload className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Easy Upload</CardTitle>
              <CardDescription>
                Drag-and-drop interface with support for all document types and formats.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Smart Search</CardTitle>
              <CardDescription>
                Find documents instantly with OCR-powered search and intelligent tagging.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Secure Storage</CardTitle>
              <CardDescription>
                Bank-level encryption and secure cloud storage for all your documents.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <Filter className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Auto-Organization</CardTitle>
              <CardDescription>
                Automatic categorization and filing based on document type and content.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Version Control</CardTitle>
              <CardDescription>
                Track document versions and maintain complete audit trails.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Collaborative Access</CardTitle>
              <CardDescription>
                Share documents securely with team members and clients.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#D4AF37] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Organize Your Documents?</h2>
          <p className="text-xl mb-8 opacity-90">
            Transform your document workflow with intelligent organization and secure storage.
          </p>
          <Button size="lg" className="bg-white text-[#D4AF37] hover:bg-gray-100" asChild>
            <Link href="/auth/signup">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
