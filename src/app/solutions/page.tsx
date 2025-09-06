"use client";

import { 
  Building2, 
  Users, 
  FileText, 
  BarChart3, 
  Shield, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Award,
  Clock,
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
  Diamond
} from "lucide-react";

export default function SolutionsPage() {
  const solutions = [
    {
      id: 'mortgage-brokers',
      title: 'Mortgage Brokers',
      description: 'Streamline your mortgage brokerage with automated workflows, client portals, and comprehensive loan management tools.',
      icon: Building2,
      features: [
        'Automated loan application processing',
        'Client portal with real-time updates',
        'Document management and OCR',
        'Compliance tracking and reporting',
        'CRM integration and lead management',
        'Custom loan product configurations'
      ],
      benefits: [
        'Reduce processing time by 60%',
        'Improve client satisfaction scores',
        'Increase loan volume capacity',
        'Ensure regulatory compliance'
      ],
      stats: {
        users: '5,000+',
        loans: '50,000+',
        satisfaction: '4.9/5'
      },
      cta: 'Get Started for Mortgage Brokers'
    },
    {
      id: 'commercial-lenders',
      title: 'Commercial Lenders',
      description: 'Powerful tools for commercial lending operations with advanced analytics, risk assessment, and portfolio management.',
      icon: BarChart3,
      features: [
        'Advanced risk assessment tools',
        'Portfolio management dashboard',
        'Automated underwriting workflows',
        'Custom reporting and analytics',
        'Integration with credit bureaus',
        'Multi-borrower loan structures'
      ],
      benefits: [
        'Faster loan decisions',
        'Improved risk management',
        'Better portfolio visibility',
        'Enhanced regulatory compliance'
      ],
      stats: {
        users: '2,500+',
        loans: '25,000+',
        satisfaction: '4.8/5'
      },
      cta: 'Explore Commercial Solutions'
    },
    {
      id: 'credit-unions',
      title: 'Credit Unions',
      description: 'Member-focused lending solutions that enhance the member experience while streamlining internal operations.',
      icon: Users,
      features: [
        'Member portal and self-service',
        'Integrated account management',
        'Automated member communications',
        'Compliance with NCUA regulations',
        'Cross-selling and upselling tools',
        'Member satisfaction tracking'
      ],
      benefits: [
        'Enhanced member experience',
        'Increased loan origination',
        'Improved operational efficiency',
        'Better member retention'
      ],
      stats: {
        users: '3,000+',
        loans: '40,000+',
        satisfaction: '4.9/5'
      },
      cta: 'Learn About Credit Union Solutions'
    },
    {
      id: 'private-lenders',
      title: 'Private Lenders',
      description: 'Flexible lending platform for private lenders with custom workflows, investor management, and advanced reporting.',
      icon: Shield,
      features: [
        'Custom loan product creation',
        'Investor portal and reporting',
        'Automated payment processing',
        'Risk assessment and scoring',
        'Regulatory compliance tools',
        'Multi-entity management'
      ],
      benefits: [
        'Faster loan origination',
        'Better investor relations',
        'Improved risk management',
        'Streamlined operations'
      ],
      stats: {
        users: '1,500+',
        loans: '15,000+',
        satisfaction: '4.7/5'
      },
      cta: 'Discover Private Lending Tools'
    },
    {
      id: 'solo-advisors',
      title: 'Solo Advisors',
      description: 'Perfect for individual financial advisors who need powerful tools without the complexity of enterprise solutions.',
      icon: Target,
      features: [
        'Simple client management',
        'Basic document storage',
        'Email integration',
        'Mobile app access',
        'Standard reporting',
        'Affordable pricing'
      ],
      benefits: [
        'Easy to get started',
        'Cost-effective solution',
        'Professional client experience',
        'Time-saving automation'
      ],
      stats: {
        users: '8,000+',
        loans: '100,000+',
        satisfaction: '4.8/5'
      },
      cta: 'Start Your Solo Practice'
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      description: 'Comprehensive enterprise solutions with custom development, dedicated support, and advanced security features.',
      icon: Globe,
      features: [
        'Unlimited users and workspaces',
        'Custom integrations and APIs',
        'Dedicated account management',
        'On-premise deployment options',
        'Advanced security and compliance',
        'Custom development services'
      ],
      benefits: [
        'Scalable to any size',
        'Complete customization',
        'Enterprise-grade security',
        'Dedicated support team'
      ],
      stats: {
        users: '500+',
        loans: '1M+',
        satisfaction: '4.9/5'
      },
      cta: 'Contact Enterprise Sales'
    }
  ];

  const industries = [
    {
      name: 'Real Estate',
      description: 'Specialized tools for real estate lending and property management',
      icon: Building2,
      features: ['Property valuation tools', 'Real estate document management', 'Agent collaboration', 'Market analysis']
    },
    {
      name: 'Automotive',
      description: 'Auto loan processing and dealer management solutions',
      icon: Smartphone,
      features: ['Dealer portal', 'Vehicle information integration', 'Credit scoring', 'Inventory management']
    },
    {
      name: 'Small Business',
      description: 'SBA and small business loan management tools',
      icon: Users,
      features: ['SBA compliance', 'Business plan analysis', 'Cash flow projections', 'Government reporting']
    },
    {
      name: 'Personal Loans',
      description: 'Consumer lending and personal loan management',
      icon: Heart,
      features: ['Credit assessment', 'Income verification', 'Payment processing', 'Customer service tools']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Mortgage Broker',
      company: 'Premier Lending Group',
      content: 'LoanFlow Pro has transformed our mortgage brokerage. We process 3x more loans with the same team size.',
      rating: 5,
      solution: 'Mortgage Brokers'
    },
    {
      name: 'Michael Chen',
      role: 'Commercial Lending Director',
      company: 'Capital Finance Solutions',
      content: 'The risk assessment tools and portfolio management features have revolutionized our commercial lending operations.',
      rating: 5,
      solution: 'Commercial Lenders'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Credit Union Manager',
      company: 'Community First Credit Union',
      content: 'Our members love the self-service portal. It has significantly improved their experience and our efficiency.',
      rating: 5,
      solution: 'Credit Unions'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Solutions for Every
            <span className="text-[#D4AF37]"> Lending Business</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you're a solo advisor or a large enterprise, we have the perfect solution 
            to streamline your lending operations and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white px-8 py-4 rounded-lg font-semibold hover:from-[#B8941F] hover:to-[#D4AF37] transition-all duration-200 flex items-center justify-center space-x-2">
              <span>Find Your Solution</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-shadow duration-200">
                <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6">
                  <solution.icon className="w-8 h-8 text-[#D4AF37]" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {solution.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {solution.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h4>
                  <ul className="space-y-2">
                    {solution.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#D4AF37]">{solution.stats.users}</div>
                    <div className="text-xs text-gray-500">Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#D4AF37]">{solution.stats.loans}</div>
                    <div className="text-xs text-gray-500">Loans</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#D4AF37]">{solution.stats.satisfaction}</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
                
                <button className="w-full bg-[#D4AF37] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors duration-200">
                  {solution.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Focus */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Industry-Specific Solutions
            </h2>
            <p className="text-xl text-gray-600">
              Tailored features and workflows for different lending verticals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-4">
                  <industry.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{industry.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{industry.description}</p>
                
                <ul className="space-y-2">
                  {industry.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how different types of lending businesses are succeeding with LoanFlow Pro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                  <div className="text-xs text-[#D4AF37] font-medium mt-1">{testimonial.solution}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#D4AF37] to-[#B8941F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Solution?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Let our experts help you choose the right solution for your business needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
              <span>Schedule Consultation</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#D4AF37] transition-all duration-200">
              Start Free Trial
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
