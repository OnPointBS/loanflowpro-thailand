"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Building2, 
  Users, 
  FileText, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const megaMenuItems = {
    features: {
      title: "Features",
      description: "Comprehensive loan workflow management tools",
      columns: [
        {
          title: "Client Management",
          items: [
            { name: "Client Portal", description: "Secure client access and communication", icon: Users },
            { name: "Document Management", description: "Organized file storage and sharing", icon: FileText },
            { name: "Application Processing", description: "Streamlined loan applications", icon: CheckCircle },
            { name: "Communication Hub", description: "Built-in messaging and notifications", icon: Zap }
          ]
        },
        {
          title: "Workflow Automation",
          items: [
            { name: "Task Management", description: "Automated task assignment and tracking", icon: CheckCircle },
            { name: "Loan Types", description: "Pre-configured loan workflows", icon: Building2 },
            { name: "Document Processing", description: "OCR and automated document handling", icon: FileText },
            { name: "Compliance Tracking", description: "Regulatory compliance monitoring", icon: Shield }
          ]
        },
        {
          title: "Analytics & Reporting",
          items: [
            { name: "Real-time Dashboard", description: "Live performance metrics", icon: BarChart3 },
            { name: "Custom Reports", description: "Detailed analytics and insights", icon: FileText },
            { name: "Staff Performance", description: "Team productivity tracking", icon: Users },
            { name: "Client Analytics", description: "Client engagement metrics", icon: BarChart3 }
          ]
        }
      ]
    },
    solutions: {
      title: "Solutions",
      description: "Tailored solutions for different business needs",
      columns: [
        {
          title: "By Industry",
          items: [
            { name: "Mortgage Brokers", description: "Complete mortgage workflow management", icon: Building2 },
            { name: "Commercial Lenders", description: "Commercial loan processing solutions", icon: Building2 },
            { name: "Credit Unions", description: "Member-focused lending platforms", icon: Users },
            { name: "Private Lenders", description: "Private lending workflow automation", icon: Shield }
          ]
        },
        {
          title: "By Size",
          items: [
            { name: "Solo Advisors", description: "Individual advisor tools", icon: Users },
            { name: "Small Teams", description: "2-10 person teams", icon: Users },
            { name: "Growing Companies", description: "10-50 person organizations", icon: Building2 },
            { name: "Enterprise", description: "Large-scale implementations", icon: Building2 }
          ]
        },
        {
          title: "Integration",
          items: [
            { name: "CRM Integration", description: "Connect with existing CRM systems", icon: Zap },
            { name: "API Access", description: "Custom integrations and automation", icon: Zap },
            { name: "White Label", description: "Branded solutions for your business", icon: Shield },
            { name: "Custom Development", description: "Tailored feature development", icon: Zap }
          ]
        }
      ]
    },
    resources: {
      title: "Resources",
      description: "Everything you need to succeed",
      columns: [
        {
          title: "Learning",
          items: [
            { name: "Documentation", description: "Complete setup and usage guides", icon: FileText },
            { name: "Video Tutorials", description: "Step-by-step training videos", icon: FileText },
            { name: "Webinars", description: "Live training sessions", icon: Users },
            { name: "Best Practices", description: "Industry best practices guide", icon: CheckCircle }
          ]
        },
        {
          title: "Support",
          items: [
            { name: "Help Center", description: "Self-service support portal", icon: FileText },
            { name: "Live Chat", description: "Real-time support assistance", icon: Users },
            { name: "Phone Support", description: "Direct phone support", icon: Users },
            { name: "Priority Support", description: "Dedicated support for enterprise", icon: Shield }
          ]
        },
        {
          title: "Community",
          items: [
            { name: "User Forum", description: "Connect with other users", icon: Users },
            { name: "Feature Requests", description: "Suggest new features", icon: Zap },
            { name: "Success Stories", description: "Customer success case studies", icon: CheckCircle },
            { name: "Partner Program", description: "Become a certified partner", icon: Building2 }
          ]
        }
      ]
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LoanFlow Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {Object.entries(megaMenuItems).map(([key, menu]) => (
              <div
                key={key}
                className="relative group"
                onMouseEnter={() => setActiveMegaMenu(key)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button className="flex items-center space-x-1 text-gray-700 hover:text-[#D4AF37] transition-colors duration-200 font-medium">
                  <span>{menu.title}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Mega Menu Dropdown */}
                {activeMegaMenu === key && (
                  <div className="absolute left-0 mt-2 w-screen max-w-4xl bg-white rounded-lg shadow-xl border border-gray-200 py-6">
                    <div className="px-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{menu.title}</h3>
                      <p className="text-gray-600 mb-6">{menu.description}</p>
                      
                      <div className="grid grid-cols-3 gap-8">
                        {menu.columns.map((column, columnIndex) => (
                          <div key={columnIndex}>
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">{column.title}</h4>
                            <ul className="space-y-3">
                              {column.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <Link
                                    href={`/${key}/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="flex items-start space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                                    onClick={closeMenu}
                                  >
                                    <item.icon className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#D4AF37]">
                                        {item.name}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {item.description}
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <Link href="/pricing" className="text-gray-700 hover:text-[#D4AF37] transition-colors duration-200 font-medium">
              Pricing
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#D4AF37] transition-colors duration-200 font-medium">
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/auth/signin"
              className="text-gray-700 hover:text-[#D4AF37] transition-colors duration-200 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white px-6 py-2 rounded-lg font-medium hover:from-[#B8941F] hover:to-[#D4AF37] transition-all duration-200 flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-[#D4AF37] transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {Object.entries(megaMenuItems).map(([key, menu]) => (
                <div key={key} className="space-y-1">
                  <button
                    onClick={() => setActiveMegaMenu(activeMegaMenu === key ? null : key)}
                    className="flex items-center justify-between w-full text-left px-3 py-2 text-gray-700 hover:text-[#D4AF37] transition-colors duration-200 font-medium"
                  >
                    <span>{menu.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMegaMenu === key ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeMegaMenu === key && (
                    <div className="pl-6 space-y-2">
                      {menu.columns.map((column, columnIndex) => (
                        <div key={columnIndex}>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">{column.title}</h4>
                          <ul className="space-y-1">
                            {column.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <Link
                                  href={`/${key}/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-[#D4AF37] transition-colors duration-200"
                                  onClick={closeMenu}
                                >
                                  <item.icon className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                                  <span>{item.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <Link
                href="/pricing"
                className="block px-3 py-2 text-gray-700 hover:text-[#D4AF37] transition-colors duration-200 font-medium"
                onClick={closeMenu}
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-[#D4AF37] transition-colors duration-200 font-medium"
                onClick={closeMenu}
              >
                Contact
              </Link>
              
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 text-gray-700 hover:text-[#D4AF37] transition-colors duration-200 font-medium"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block mx-3 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white px-6 py-2 rounded-lg font-medium hover:from-[#B8941F] hover:to-[#D4AF37] transition-all duration-200 text-center"
                  onClick={closeMenu}
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
