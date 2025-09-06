"use client";

import { useState } from "react";
import { 
  CheckCircle, 
  X, 
  ArrowRight, 
  Star, 
  Shield, 
  Zap, 
  Users, 
  Building2, 
  FileText, 
  BarChart3,
  Clock,
  Award,
  Target,
  Lock,
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

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for solo advisors and small teams getting started',
      monthlyPrice: 29,
      yearlyPrice: 290,
      yearlyDiscount: 17,
      features: [
        'Up to 5 users',
        'Unlimited clients',
        'Basic document management',
        'Email support',
        'Standard templates',
        'Mobile app access',
        'Basic reporting',
        'SSL encryption'
      ],
      limitations: [
        'No API access',
        'Limited integrations',
        'Basic analytics only',
        'No white-labeling'
      ],
      cta: 'Start Free Trial',
      popular: false,
      color: 'gray'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing teams and established practices',
      monthlyPrice: 79,
      yearlyPrice: 790,
      yearlyDiscount: 17,
      features: [
        'Up to 25 users',
        'Advanced analytics',
        'Custom workflows',
        'Priority support',
        'API access',
        'White-label options',
        'Advanced reporting',
        'Custom integrations',
        'Team collaboration tools',
        'Advanced security features',
        'Automated workflows',
        'Custom branding'
      ],
      limitations: [
        'Limited custom development',
        'Standard SLA',
        'Community support only'
      ],
      cta: 'Start Free Trial',
      popular: true,
      color: 'gold'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Tailored solutions for large organizations',
      monthlyPrice: null,
      yearlyPrice: null,
      yearlyDiscount: 0,
      features: [
        'Unlimited users',
        'Custom integrations',
        'Dedicated support',
        'On-premise deployment',
        'Custom development',
        'SLA guarantees',
        'Advanced security',
        'Custom reporting',
        'Dedicated account manager',
        'Training and onboarding',
        'Custom workflows',
        'Priority feature requests'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      color: 'purple'
    }
  ];

  const addOns = [
    {
      name: 'Additional Users',
      description: 'Add more team members to your plan',
      monthlyPrice: 15,
      yearlyPrice: 150,
      icon: Users
    },
    {
      name: 'Advanced Analytics',
      description: 'Enhanced reporting and business intelligence',
      monthlyPrice: 25,
      yearlyPrice: 250,
      icon: BarChart3
    },
    {
      name: 'Custom Integrations',
      description: 'Connect with your existing business tools',
      monthlyPrice: 50,
      yearlyPrice: 500,
      icon: Zap
    },
    {
      name: 'White-label Solution',
      description: 'Fully branded experience for your clients',
      monthlyPrice: 100,
      yearlyPrice: 1000,
      icon: Building2
    }
  ];

  const faqs = [
    {
      question: 'What\'s included in the free trial?',
      answer: 'The free trial includes full access to all features of the Professional plan for 14 days. No credit card required to start.'
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we\'ll prorate any billing differences.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your data is safe with us. You can export all your data before canceling, and we\'ll keep it available for 30 days after cancellation.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Annual billing saves you 17% compared to monthly billing. This discount is automatically applied when you choose yearly billing.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees for Starter and Professional plans. Enterprise plans may include setup fees depending on custom requirements.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, ACH transfers, and can accommodate wire transfers for Enterprise customers.'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === null) return 'Custom';
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getPeriod = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === null) return '';
    return billingCycle === 'monthly' ? '/month' : '/year';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="text-[#D4AF37]"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your business needs. All plans include a 14-day free trial with no credit card required.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                billingCycle === 'yearly' ? 'bg-[#D4AF37]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                Save 17%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl border-2 p-8 ${
                  plan.popular 
                    ? 'border-[#D4AF37] shadow-xl scale-105' 
                    : 'border-gray-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#D4AF37] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    {plan.monthlyPrice !== null ? (
                      <div>
                        <span className="text-4xl font-bold text-[#D4AF37]">
                          ${getPrice(plan)}
                        </span>
                        <span className="text-gray-500">{getPeriod(plan)}</span>
                        {billingCycle === 'yearly' && plan.yearlyDiscount > 0 && (
                          <div className="text-sm text-green-600 font-medium mt-1">
                            Save ${plan.yearlyDiscount} per month
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-[#D4AF37]">Custom</div>
                    )}
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Limitations</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white hover:from-[#B8941F] hover:to-[#D4AF37]'
                      : plan.id === 'enterprise'
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Add-ons & Extensions
            </h2>
            <p className="text-xl text-gray-600">
              Enhance your plan with additional features and capabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-4">
                  <addon.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{addon.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
                
                <div className="text-2xl font-bold text-[#D4AF37] mb-4">
                  ${billingCycle === 'monthly' ? addon.monthlyPrice : addon.yearlyPrice}
                  <span className="text-sm text-gray-500 font-normal">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                
                <button className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200">
                  Add to Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#D4AF37] to-[#B8941F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of financial advisors who trust LoanFlow Pro to streamline their business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#D4AF37] transition-all duration-200">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
