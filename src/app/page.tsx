"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  CheckCircle, 
  Play, 
  Star, 
  Users, 
  Building2, 
  FileText, 
  BarChart3, 
  Shield, 
  Zap,
  Clock,
  Award,
  TrendingUp,
  Target,
  Lock,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";

export default function HomePage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    {
      icon: Users,
      title: "Client Portal",
      description: "Secure, branded client portal with real-time updates and document sharing",
      benefits: ["24/7 client access", "Real-time notifications", "Document sharing", "Progress tracking"]
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Organized file storage with OCR processing and automated categorization",
      benefits: ["OCR text extraction", "Smart categorization", "Version control", "Secure storage"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Comprehensive analytics and custom reports for business insights",
      benefits: ["Real-time dashboards", "Custom reports", "Performance metrics", "ROI tracking"]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Bank-level security with compliance tracking and audit trails",
      benefits: ["256-bit encryption", "SOC 2 compliance", "Audit trails", "Role-based access"]
    },
    {
      icon: Zap,
      title: "Workflow Automation",
      description: "Automated task assignment and workflow management",
      benefits: ["Task automation", "Smart routing", "Deadline tracking", "Progress monitoring"]
    },
    {
      icon: Building2,
      title: "Multi-tenant Architecture",
      description: "Scalable platform supporting multiple workspaces and teams",
      benefits: ["Unlimited workspaces", "Team management", "Custom branding", "API access"]
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "50,000+", label: "Loans Processed" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9/5", label: "Customer Rating" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Senior Mortgage Broker",
      company: "Premier Lending Group",
      content: "LoanFlow Pro has transformed our business. We've reduced processing time by 60% and our clients love the transparency.",
      rating: 5,
      avatar: "/avatars/sarah-johnson.jpg"
    },
    {
      name: "Michael Chen",
      role: "Commercial Lending Director",
      company: "Capital Finance Solutions",
      content: "The automation features are incredible. What used to take hours now takes minutes. Our team is more productive than ever.",
      rating: 5,
      avatar: "/avatars/michael-chen.jpg"
    },
    {
      name: "Emily Rodriguez",
      role: "Credit Union Manager",
      company: "Community First Credit Union",
      content: "The client portal has improved our member satisfaction significantly. Everything is organized and easy to access.",
      rating: 5,
      avatar: "/avatars/emily-rodriguez.jpg"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      description: "Perfect for solo advisors and small teams",
      features: [
        "Up to 5 users",
        "Unlimited clients",
        "Basic document management",
        "Email support",
        "Standard templates"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "per month",
      description: "Ideal for growing teams and established practices",
      features: [
        "Up to 25 users",
        "Advanced analytics",
        "Custom workflows",
        "Priority support",
        "API access",
        "White-label options"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Tailored solutions for large organizations",
      features: [
        "Unlimited users",
        "Custom integrations",
        "Dedicated support",
        "On-premise deployment",
        "Custom development",
        "SLA guarantees"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                Trusted by 10,000+ financial advisors
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Streamline Your
                <span className="text-[#D4AF37]"> Loan Workflow</span>
                Like Never Before
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The most comprehensive loan management platform for financial advisors. 
                Automate processes, delight clients, and grow your business with confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white px-8 py-4 rounded-lg font-semibold hover:from-[#B8941F] hover:to-[#D4AF37] transition-all duration-200 flex items-center justify-center space-x-2 text-lg"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2 text-lg"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Active Clients</div>
                          <div className="text-xs text-gray-500">This month</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-[#D4AF37]">247</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-xs text-green-600 font-medium">Completed</div>
                        <div className="text-lg font-bold text-green-700">23</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-xs text-blue-600 font-medium">In Progress</div>
                        <div className="text-lg font-bold text-blue-700">12</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">Live Updates</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm font-medium text-gray-900">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-[#D4AF37] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed specifically for financial advisors to streamline 
              loan processing and enhance client experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center space-x-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Loved by Financial Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers are saying about LoanFlow Pro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-xl border-2 p-8 ${
                plan.popular ? 'border-[#D4AF37] shadow-lg' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#D4AF37] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-[#D4AF37] mb-2">
                    {plan.price}
                    <span className="text-lg text-gray-500 font-normal">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={plan.cta === "Contact Sales" ? "/contact" : "/auth/signup"}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white hover:from-[#B8941F] hover:to-[#D4AF37]'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#D4AF37] to-[#B8941F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Loan Workflow?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of financial advisors who trust LoanFlow Pro to streamline their business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2 text-lg"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#D4AF37] transition-all duration-200 text-lg"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}