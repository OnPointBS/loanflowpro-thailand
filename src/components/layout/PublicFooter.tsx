"use client";

import Link from "next/link";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight,
  CheckCircle,
  Shield,
  Award,
  Users,
  Zap
} from "lucide-react";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    product: {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Integrations", href: "/integrations" },
        { name: "API Documentation", href: "/docs" },
        { name: "Changelog", href: "/changelog" },
        { name: "Roadmap", href: "/roadmap" }
      ]
    },
    solutions: {
      title: "Solutions",
      links: [
        { name: "Mortgage Brokers", href: "/solutions/mortgage-brokers" },
        { name: "Commercial Lenders", href: "/solutions/commercial-lenders" },
        { name: "Credit Unions", href: "/solutions/credit-unions" },
        { name: "Private Lenders", href: "/solutions/private-lenders" },
        { name: "Solo Advisors", href: "/solutions/solo-advisors" },
        { name: "Enterprise", href: "/solutions/enterprise" }
      ]
    },
    resources: {
      title: "Resources",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Documentation", href: "/docs" },
        { name: "Video Tutorials", href: "/tutorials" },
        { name: "Webinars", href: "/webinars" },
        { name: "Blog", href: "/blog" },
        { name: "Case Studies", href: "/case-studies" }
      ]
    },
    company: {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Partners", href: "/partners" },
        { name: "Contact", href: "/contact" },
        { name: "Legal", href: "/legal" }
      ]
    }
  };

  const features = [
    { icon: Shield, text: "Bank-level security" },
    { icon: Award, text: "Industry certified" },
    { icon: Users, text: "24/7 support" },
    { icon: Zap, text: "99.9% uptime" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">LoanFlow Pro</span>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              The most comprehensive loan workflow management platform for financial advisors. 
              Streamline your processes, delight your clients, and grow your business.
            </p>

            {/* Trust Indicators */}
            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <feature.icon className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span className="text-sm text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>support@loanflowpro.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>1-800-LOANFLOW</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-300 mb-4">
              Get the latest updates, tips, and industry insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
              <button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white px-6 py-2 rounded-lg font-medium hover:from-[#B8941F] hover:to-[#D4AF37] transition-all duration-200 flex items-center justify-center space-x-2">
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © {currentYear} LoanFlow Pro. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#D4AF37] transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-[#D4AF37] transition-colors duration-200">
                Cookie Policy
              </Link>
              <Link href="/security" className="hover:text-[#D4AF37] transition-colors duration-200">
                Security
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://facebook.com/loanflowpro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/loanflowpro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/loanflowpro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/loanflowpro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
