import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Zap,
  Shield,
  BarChart3,
  MessageSquare,
  Calendar,
  Bell,
  Settings,
  Database,
  Cloud,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  SortAsc,
  TrendingUp,
  Award,
  Star,
  Heart,
  ThumbsUp,
  MessageCircle,
  Share2,
  Copy,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  ArrowRight,
  Building2,
  Lock,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Mail,
  Clock,
  Target
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Client Portal - LoanFlow Pro",
  description: "Secure client access and communication platform for loan workflow management.",
};

export default function ClientPortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Client Portal
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Provide your clients with secure, branded access to their loan applications, documents, and communication tools.
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Secure Access</CardTitle>
              <CardDescription>
                Bank-level security with encrypted data transmission and secure authentication.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>
                Organized file storage, sharing, and real-time document status updates.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Direct Communication</CardTitle>
              <CardDescription>
                Built-in messaging system for seamless client-advisor communication.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Real-time visibility into loan application status and next steps.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>
                Clear task lists with deadlines and completion tracking.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Smart Notifications</CardTitle>
              <CardDescription>
                Automated alerts for important updates and deadline reminders.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#D4AF37] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Client Experience?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of advisors who trust LoanFlow Pro for their client portal needs.
          </p>
          <Button size="lg" className="bg-white text-[#D4AF37] hover:bg-gray-100" asChild>
            <Link href="/auth/signup">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
