"use client";

import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Building2, 
  Shield, 
  Zap,
  Globe,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
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

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "Client-First Approach",
      description: "We believe that every decision should be made with the client's best interest in mind. Our platform is designed to enhance the client experience and build lasting relationships.",
      benefits: [
        "Intuitive client portal",
        "Real-time communication",
        "Transparent processes",
        "Personalized experience"
      ]
    },
    {
      icon: Shield,
      title: "Security & Trust",
      description: "We understand the sensitive nature of financial data. That's why we've built bank-level security into every aspect of our platform.",
      benefits: [
        "256-bit encryption",
        "SOC 2 compliance",
        "Regular security audits",
        "Data privacy protection"
      ]
    },
    {
      icon: Zap,
      title: "Innovation & Efficiency",
      description: "We're constantly innovating to help you work smarter, not harder. Our platform automates routine tasks so you can focus on what matters most.",
      benefits: [
        "Automated workflows",
        "Smart task assignment",
        "AI-powered insights",
        "Continuous improvements"
      ]
    },
    {
      icon: Globe,
      title: "Accessibility & Inclusion",
      description: "Financial services should be accessible to everyone. We're committed to building inclusive technology that works for all users.",
      benefits: [
        "Multi-language support",
        "Accessibility compliance",
        "Mobile-first design",
        "Universal usability"
      ]
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former VP of Technology at Wells Fargo with 15+ years in fintech. Passionate about democratizing access to financial services.",
      image: "/team/sarah-johnson.jpg",
      linkedin: "https://linkedin.com/in/sarahjohnson"
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      bio: "Ex-Google engineer with expertise in scalable systems and AI. Led the development of several successful fintech products.",
      image: "/team/michael-chen.jpg",
      linkedin: "https://linkedin.com/in/michaelchen"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      bio: "Former product manager at Intuit with deep understanding of financial workflows. Focused on creating intuitive user experiences.",
      image: "/team/emily-rodriguez.jpg",
      linkedin: "https://linkedin.com/in/emilyrodriguez"
    },
    {
      name: "David Kim",
      role: "Head of Engineering",
      bio: "Full-stack engineer with 10+ years building enterprise software. Expert in security, scalability, and performance optimization.",
      image: "/team/david-kim.jpg",
      linkedin: "https://linkedin.com/in/davidkim"
    },
    {
      name: "Lisa Thompson",
      role: "Head of Customer Success",
      bio: "Former financial advisor with 12+ years experience. Understands the challenges advisors face and ensures our platform solves real problems.",
      image: "/team/lisa-thompson.jpg",
      linkedin: "https://linkedin.com/in/lisathompson"
    },
    {
      name: "James Wilson",
      role: "Head of Security",
      bio: "Cybersecurity expert with certifications in cloud security and compliance. Former security consultant for Fortune 500 companies.",
      image: "/team/james-wilson.jpg",
      linkedin: "https://linkedin.com/in/jameswilson"
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Started with a vision to revolutionize loan workflow management for financial advisors."
    },
    {
      year: "2021",
      title: "First Product Launch",
      description: "Launched our MVP with core document management and client portal features."
    },
    {
      year: "2022",
      title: "Series A Funding",
      description: "Raised $5M to accelerate product development and expand our team."
    },
    {
      year: "2023",
      title: "10,000+ Users",
      description: "Reached a major milestone with over 10,000 active users across 50+ countries."
    },
    {
      year: "2024",
      title: "Enterprise Features",
      description: "Launched advanced analytics, white-labeling, and enterprise-grade security features."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "50+", label: "Countries" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9/5", label: "Customer Rating" },
    { number: "24/7", label: "Support" },
    { number: "SOC 2", label: "Compliant" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                About
                <span className="text-[#D4AF37]"> LoanFlow Pro</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We're on a mission to revolutionize how financial advisors manage their loan workflows. 
                Founded by industry veterans who understand the challenges of modern lending, we've built 
                the most comprehensive platform to streamline processes and delight clients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white px-8 py-4 rounded-lg font-semibold hover:from-[#B8941F] hover:to-[#D4AF37] transition-all duration-200 flex items-center justify-center space-x-2">
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Our Story</span>
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600 mb-6">
                    To empower financial advisors with technology that makes their work more efficient, 
                    their clients happier, and their businesses more successful.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Client-focused design</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Industry expertise</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Continuous innovation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
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

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape how we build products for our customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-200">
                <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-[#D4AF37]" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {value.description}
                </p>
                
                <ul className="space-y-2">
                  {value.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a diverse team of industry experts, engineers, and designers who are passionate about 
              solving real problems for financial advisors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-[#D4AF37] font-medium">{member.role}</p>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] transition-colors duration-200"
                >
                  <span className="text-sm font-medium">Connect on LinkedIn</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              From startup to industry leader, here's how we've grown and evolved.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#D4AF37]"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                      <div className="text-2xl font-bold text-[#D4AF37] mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 bg-[#D4AF37] rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#D4AF37] to-[#B8941F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Be part of the future of loan workflow management. Start your free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#D4AF37] transition-all duration-200">
              View Open Positions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
