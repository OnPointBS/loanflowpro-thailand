"use client";

import { 
  FileText, 
  Play, 
  Users, 
  BookOpen, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Clock,
  Calendar,
  Download,
  ExternalLink,
  Search,
  Filter,
  Tag,
  Award,
  Shield,
  Zap,
  Building2,
  BarChart3,
  Target,
  Lock,
  Globe,
  Mail,
  MessageSquare,
  Bell,
  Settings,
  Database,
  Cloud,
  Eye,
  Upload,
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
  Pause,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond
} from "lucide-react";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', count: 24 },
    { id: 'documentation', name: 'Documentation', count: 8 },
    { id: 'tutorials', name: 'Tutorials', count: 6 },
    { id: 'webinars', name: 'Webinars', count: 4 },
    { id: 'guides', name: 'Guides', count: 6 }
  ];

  const resources = [
    {
      id: 1,
      title: 'Getting Started Guide',
      description: 'Complete guide to setting up your LoanFlow Pro account and configuring your first workspace.',
      type: 'documentation',
      category: 'Getting Started',
      duration: '15 min read',
      difficulty: 'Beginner',
      icon: BookOpen,
      url: '/resources/getting-started-guide',
      featured: true
    },
    {
      id: 2,
      title: 'Client Portal Setup Tutorial',
      description: 'Step-by-step video tutorial on configuring your client portal and customizing the experience.',
      type: 'tutorials',
      category: 'Client Management',
      duration: '12 min video',
      difficulty: 'Intermediate',
      icon: Play,
      url: '/resources/client-portal-tutorial',
      featured: true
    },
    {
      id: 3,
      title: 'Advanced Workflow Automation',
      description: 'Learn how to create complex automated workflows to streamline your loan processing.',
      type: 'webinars',
      category: 'Automation',
      duration: '45 min webinar',
      difficulty: 'Advanced',
      icon: Users,
      url: '/resources/workflow-automation-webinar',
      featured: false
    },
    {
      id: 4,
      title: 'API Documentation',
      description: 'Complete API reference for developers looking to integrate with LoanFlow Pro.',
      type: 'documentation',
      category: 'Integration',
      duration: '30 min read',
      difficulty: 'Advanced',
      icon: FileText,
      url: '/resources/api-documentation',
      featured: false
    },
    {
      id: 5,
      title: 'Best Practices for Document Management',
      description: 'Essential tips and best practices for organizing and managing loan documents effectively.',
      type: 'guides',
      category: 'Document Management',
      duration: '8 min read',
      difficulty: 'Beginner',
      icon: FileText,
      url: '/resources/document-management-best-practices',
      featured: false
    },
    {
      id: 6,
      title: 'Analytics and Reporting Deep Dive',
      description: 'Comprehensive guide to using analytics and creating custom reports in LoanFlow Pro.',
      type: 'tutorials',
      category: 'Analytics',
      duration: '20 min video',
      difficulty: 'Intermediate',
      icon: BarChart3,
      url: '/resources/analytics-tutorial',
      featured: true
    },
    {
      id: 7,
      title: 'Security and Compliance Webinar',
      description: 'Learn about security features, compliance requirements, and data protection best practices.',
      type: 'webinars',
      category: 'Security',
      duration: '60 min webinar',
      difficulty: 'Intermediate',
      icon: Shield,
      url: '/resources/security-compliance-webinar',
      featured: false
    },
    {
      id: 8,
      title: 'Mobile App User Guide',
      description: 'Complete guide to using the LoanFlow Pro mobile app for iOS and Android.',
      type: 'documentation',
      category: 'Mobile',
      duration: '10 min read',
      difficulty: 'Beginner',
      icon: Globe,
      url: '/resources/mobile-app-guide',
      featured: false
    },
    {
      id: 9,
      title: 'Integration Setup Guide',
      description: 'How to connect LoanFlow Pro with popular CRM and accounting systems.',
      type: 'guides',
      category: 'Integration',
      duration: '12 min read',
      difficulty: 'Intermediate',
      icon: Zap,
      url: '/resources/integration-setup-guide',
      featured: false
    },
    {
      id: 10,
      title: 'Team Management Best Practices',
      description: 'Tips for managing teams, setting permissions, and optimizing collaboration in LoanFlow Pro.',
      type: 'guides',
      category: 'Team Management',
      duration: '6 min read',
      difficulty: 'Beginner',
      icon: Users,
      url: '/resources/team-management-guide',
      featured: false
    },
    {
      id: 11,
      title: 'Custom Workflow Creation',
      description: 'Advanced tutorial on creating custom workflows and automation rules.',
      type: 'tutorials',
      category: 'Automation',
      duration: '25 min video',
      difficulty: 'Advanced',
      icon: Zap,
      url: '/resources/custom-workflow-tutorial',
      featured: false
    },
    {
      id: 12,
      title: 'White-label Configuration',
      description: 'Complete guide to configuring white-label options for your brand.',
      type: 'documentation',
      category: 'Customization',
      duration: '18 min read',
      difficulty: 'Intermediate',
      icon: Building2,
      url: '/resources/white-label-configuration',
      featured: false
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredResources = resources.filter(resource => resource.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'documentation': return FileText;
      case 'tutorials': return Play;
      case 'webinars': return Users;
      case 'guides': return BookOpen;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Learning
            <span className="text-[#D4AF37]"> Resources</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Everything you need to master LoanFlow Pro. From quick start guides to advanced tutorials, 
            we've got you covered with comprehensive learning materials.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#D4AF37] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Resources
            </h2>
            <p className="text-xl text-gray-600">
              Start with these popular resources to get the most out of LoanFlow Pro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredResources.map((resource) => (
              <div key={resource.id} className="bg-white border-2 border-[#D4AF37] rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                    <resource.icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <span className="bg-[#D4AF37] text-white text-xs font-medium px-2 py-1 rounded-full">
                    Featured
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">{resource.duration}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                </div>
                
                <button className="w-full bg-[#D4AF37] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors duration-200 flex items-center justify-center space-x-2">
                  <span>View Resource</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              All Resources
            </h2>
            <p className="text-xl text-gray-600">
              Browse our complete library of learning materials
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <div key={resource.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <TypeIcon className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 uppercase">{resource.type}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500">{resource.duration}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#D4AF37] font-medium">{resource.category}</span>
                    <button className="text-[#D4AF37] hover:text-[#B8941F] transition-colors duration-200">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Learning Paths
            </h2>
            <p className="text-xl text-gray-600">
              Structured learning paths to help you master LoanFlow Pro step by step
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl p-8 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Beginner Path</h3>
              <p className="text-white/90 mb-6">Perfect for new users getting started with LoanFlow Pro</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm">Account setup and configuration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm">Basic client management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm">Document upload and organization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm">Creating your first loan file</span>
                </li>
              </ul>
              <button className="w-full bg-white text-[#D4AF37] py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
                Start Beginner Path
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Intermediate Path</h3>
              <p className="text-white/90 mb-6">For users ready to explore advanced features and automation</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm">Workflow automation setup</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm">Advanced analytics and reporting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm">Team management and permissions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm">Integration with external tools</span>
                </li>
              </ul>
              <button className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
                Start Intermediate Path
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-8 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Advanced Path</h3>
              <p className="text-white/90 mb-6">For power users and administrators mastering enterprise features</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm">Custom workflow development</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm">API integration and development</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm">White-label configuration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm">Enterprise security and compliance</span>
                </li>
              </ul>
              <button className="w-full bg-white text-purple-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
                Start Advanced Path
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#D4AF37] to-[#B8941F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who have mastered LoanFlow Pro with our comprehensive learning resources.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
              <span>Browse All Resources</span>
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
