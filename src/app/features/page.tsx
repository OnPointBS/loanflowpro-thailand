"use client";

import { 
  Users, 
  FileText, 
  BarChart3, 
  Shield, 
  Zap, 
  Building2, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Target,
  Lock,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Mail,
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
  Square as SquareIcon,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Hexagon as HexagonIcon,
  Octagon as OctagonIcon,
  Diamond as DiamondIcon
} from "lucide-react";

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Users,
      title: "Client Portal",
      description: "Provide your clients with a secure, branded portal where they can access their loan information, upload documents, and communicate with your team in real-time.",
      features: [
        "Real-time loan status updates",
        "Secure document sharing",
        "Two-way messaging system",
        "Mobile-responsive design",
        "Custom branding options",
        "Multi-language support"
      ],
      image: "/features/client-portal.jpg",
      benefits: [
        "Improve client satisfaction",
        "Reduce phone calls and emails",
        "Increase transparency",
        "Build trust and loyalty"
      ]
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Organize, store, and manage all loan-related documents with our advanced document management system featuring OCR processing and smart categorization.",
      features: [
        "OCR text extraction",
        "Smart document categorization",
        "Version control and history",
        "Bulk upload capabilities",
        "Advanced search functionality",
        "Automated compliance checks"
      ],
      image: "/features/document-management.jpg",
      benefits: [
        "Save time on document processing",
        "Reduce human errors",
        "Improve compliance",
        "Easy document retrieval"
      ]
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Get comprehensive insights into your business performance with real-time dashboards, custom reports, and detailed analytics.",
      features: [
        "Real-time performance dashboards",
        "Custom report builder",
        "Client engagement metrics",
        "Staff productivity tracking",
        "Revenue analytics",
        "Trend analysis and forecasting"
      ],
      image: "/features/analytics.jpg",
      benefits: [
        "Make data-driven decisions",
        "Identify growth opportunities",
        "Track team performance",
        "Improve operational efficiency"
      ]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Bank-level security with comprehensive compliance tracking, audit trails, and role-based access controls to protect your data and meet regulatory requirements.",
      features: [
        "256-bit encryption",
        "SOC 2 Type II compliance",
        "GDPR compliance",
        "Role-based access controls",
        "Audit trail logging",
        "Data backup and recovery"
      ],
      image: "/features/security.jpg",
      benefits: [
        "Protect sensitive client data",
        "Meet regulatory requirements",
        "Build client trust",
        "Avoid costly compliance issues"
      ]
    },
    {
      icon: Zap,
      title: "Workflow Automation",
      description: "Automate repetitive tasks and streamline your loan processing workflow with intelligent automation rules and smart task assignment.",
      features: [
        "Automated task assignment",
        "Smart workflow routing",
        "Deadline tracking and alerts",
        "Conditional logic rules",
        "Integration with external systems",
        "Custom automation triggers"
      ],
      image: "/features/automation.jpg",
      benefits: [
        "Reduce manual work",
        "Improve consistency",
        "Faster loan processing",
        "Better team coordination"
      ]
    },
    {
      icon: Building2,
      title: "Multi-tenant Architecture",
      description: "Scalable platform that supports multiple workspaces, teams, and custom configurations to grow with your business.",
      features: [
        "Unlimited workspaces",
        "Team and user management",
        "Custom branding options",
        "API access and webhooks",
        "White-label solutions",
        "Custom integrations"
      ],
      image: "/features/multi-tenant.jpg",
      benefits: [
        "Scale with your business",
        "Customize for your needs",
        "Integrate with existing tools",
        "Maintain brand consistency"
      ]
    }
  ];

  const additionalFeatures = [
    {
      category: "Communication",
      features: [
        { name: "In-app messaging", description: "Secure communication between team members and clients" },
        { name: "Email integration", description: "Seamless email management and tracking" },
        { name: "SMS notifications", description: "Real-time SMS alerts and updates" },
        { name: "Video conferencing", description: "Built-in video calls for client meetings" },
        { name: "Chat support", description: "Live chat support for clients" },
        { name: "Announcements", description: "Broadcast important updates to clients" }
      ]
    },
    {
      category: "Integration",
      features: [
        { name: "CRM integration", description: "Connect with popular CRM systems" },
        { name: "Accounting software", description: "Sync with QuickBooks, Xero, and more" },
        { name: "Credit bureaus", description: "Direct integration with credit reporting agencies" },
        { name: "Banking APIs", description: "Real-time bank account verification" },
        { name: "Third-party apps", description: "Connect with 100+ business applications" },
        { name: "Custom webhooks", description: "Build custom integrations with webhooks" }
      ]
    },
    {
      category: "Mobile & Accessibility",
      features: [
        { name: "Mobile app", description: "Native iOS and Android applications" },
        { name: "Responsive design", description: "Works perfectly on all devices" },
        { name: "Offline access", description: "Continue working without internet connection" },
        { name: "Accessibility compliance", description: "WCAG 2.1 AA compliant interface" },
        { name: "Multi-language", description: "Support for 20+ languages" },
        { name: "Dark mode", description: "Easy on the eyes with dark theme option" }
      ]
    },
    {
      category: "Advanced Tools",
      features: [
        { name: "AI-powered insights", description: "Machine learning for better decision making" },
        { name: "Predictive analytics", description: "Forecast trends and opportunities" },
        { name: "Risk assessment", description: "Automated risk scoring and analysis" },
        { name: "Compliance monitoring", description: "Real-time compliance checking" },
        { name: "Performance optimization", description: "AI-driven workflow optimization" },
        { name: "Smart recommendations", description: "Intelligent suggestions for improvement" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="text-[#D4AF37]"> Modern Lending</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover the comprehensive suite of tools designed to streamline your loan workflow, 
              enhance client experience, and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white px-8 py-4 rounded-lg font-semibold hover:from-[#B8941F] hover:to-[#D4AF37] transition-all duration-200 flex items-center justify-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {mainFeatures.map((feature, index) => (
            <div key={index} className={`mb-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h2>
                  
                  <p className="text-xl text-gray-600 mb-8">
                    {feature.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                      <ul className="space-y-2">
                        {feature.features.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                            <span className="text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <button className="bg-[#D4AF37] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors duration-200 flex items-center space-x-2">
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <feature.icon className="w-16 h-16 mx-auto mb-4 text-[#D4AF37]" />
                      <p className="text-lg font-medium">{feature.title} Preview</p>
                      <p className="text-sm">Interactive demo coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Even More Features
            </h2>
            <p className="text-xl text-gray-600">
              Discover additional tools and capabilities that make LoanFlow Pro the complete solution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{category.category}</h3>
                <ul className="space-y-4">
                  {category.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <div className="font-medium text-gray-900 mb-1">{feature.name}</div>
                      <div className="text-sm text-gray-600">{feature.description}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#D4AF37] to-[#B8941F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start your free trial today and see how LoanFlow Pro can transform your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#D4AF37] transition-all duration-200">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
