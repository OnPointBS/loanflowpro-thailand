"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { 
  Code, 
  Copy, 
  ExternalLink, 
  Globe, 
  Mail, 
  Settings, 
  Shield, 
  Users,
  FileText,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Building2,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
  UserCheck,
  TrendingUp,
  Clock,
  Calendar,
  Zap,
  Sparkles,
  Target,
  Lock,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";

export default function WidgetsPage() {
  const { user, hasPermission } = useAuth();
  const { workspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState("signin");
  const [showCode, setShowCode] = useState(false);
  const [authorizedDomains, setAuthorizedDomains] = useState<string[]>([
    "example.com",
    "mycompany.com"
  ]);
  const [newDomain, setNewDomain] = useState("");

  if (!hasPermission("widgets:manage")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Access Denied</h1>
          <p className="text-black font-semibold">You don't have permission to manage widgets.</p>
        </div>
      </div>
    );
  }

  const signInWidgetCode = `<iframe 
  src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/widgets/signin?workspace=${workspace?.slug}&domain=${encodeURIComponent(window.location.hostname)}"
  width="400" 
  height="500" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
  title="LoanFlow Pro Sign In">
</iframe>`;

  const applicationWidgetCode = `<iframe 
  src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/widgets/application?workspace=${workspace?.slug}&domain=${encodeURIComponent(window.location.hostname)}"
  width="500" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
  title="LoanFlow Pro Application">
</iframe>`;

  const addDomain = () => {
    if (newDomain && !authorizedDomains.includes(newDomain)) {
      setAuthorizedDomains([...authorizedDomains, newDomain]);
      setNewDomain("");
    }
  };

  const removeDomain = (domain: string) => {
    setAuthorizedDomains(authorizedDomains.filter(d => d !== domain));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Premium Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-2xl shadow-lg">
                <Code className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Widgets
                </h1>
                <p className="text-slate-600 font-medium text-lg">
                  Embeddable widgets for your website to collect applications and enable client sign-ins
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Widget Status</p>
                <p className="text-lg font-bold text-slate-900">Active</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-1 shadow-lg">
            <TabsTrigger 
              value="signin" 
              className="flex items-center justify-center space-x-2 py-3 px-6 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#D4AF37] data-[state=active]:to-[#B8941F] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Sign-In Widget</span>
            </TabsTrigger>
            <TabsTrigger 
              value="application" 
              className="flex items-center justify-center space-x-2 py-3 px-6 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#D4AF37] data-[state=active]:to-[#B8941F] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <FileText className="w-5 h-5" />
              <span className="font-semibold">Application Widget</span>
            </TabsTrigger>
          </TabsList>

          {/* Sign-In Widget Tab */}
          <TabsContent value="signin" className="space-y-8">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      Sign-In Widget
                    </CardTitle>
                    <CardDescription className="text-slate-600 font-medium text-lg">
                      Allow clients to sign in to their portal directly from your website
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Premium Widget Preview */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg">
                      <Eye className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Widget Preview</h3>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-gradient-to-br from-slate-50 to-slate-100/50">
                    <div className="max-w-md mx-auto">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Client Portal Sign-In</h4>
                        <p className="text-slate-600 font-medium">Sign in to access your loan information</p>
                      </div>
                      <div className="space-y-4">
                        <Input
                          placeholder="Enter your email"
                          className="h-12 text-slate-900 font-medium border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl"
                        />
                        <Button className="w-full h-12 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white font-semibold rounded-xl shadow-lg">
                          Send Magic Link
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-4 text-center font-medium">
                        Powered by {workspace?.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Embed Code */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg">
                        <Code className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Embed Code</h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCode(!showCode)}
                        className="border-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-slate-600 hover:text-[#D4AF37] px-4 py-2 rounded-lg transition-all duration-300"
                      >
                        {showCode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showCode ? "Hide" : "Show"} Code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(signInWidgetCode)}
                        className="border-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-slate-600 hover:text-[#D4AF37] px-4 py-2 rounded-lg transition-all duration-300"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  {showCode && (
                    <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto shadow-lg">
                      <pre className="text-emerald-400 text-sm font-mono">
                        <code>{signInWidgetCode}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Premium Domain Authorization */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg">
                      <Globe className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Authorized Domains</h3>
                      <p className="text-slate-600 font-medium">
                        Only these domains can embed your sign-in widget
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {authorizedDomains.map((domain) => (
                      <div key={domain} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg">
                            <Globe className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">{domain}</span>
                            <Badge className="ml-3 bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeDomain(domain)}
                          className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <Input
                        placeholder="Add domain (e.g., example.com)"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        className="flex-1 h-12 text-slate-900 font-medium border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-lg"
                      />
                      <Button 
                        onClick={addDomain} 
                        disabled={!newDomain}
                        className="h-12 px-6 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Premium Features */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg">
                      <Star className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Features</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group flex items-start space-x-4 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Lock className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Magic Link Authentication</h4>
                        <p className="text-slate-600 font-medium">Secure, passwordless sign-in</p>
                      </div>
                    </div>
                    <div className="group flex items-start space-x-4 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Domain Authorization</h4>
                        <p className="text-slate-600 font-medium">Control which sites can embed</p>
                      </div>
                    </div>
                    <div className="group flex items-start space-x-4 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Building2 className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Workspace Branding</h4>
                        <p className="text-slate-600 font-medium">Shows your company name</p>
                      </div>
                    </div>
                    <div className="group flex items-start space-x-4 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Smartphone className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Responsive Design</h4>
                        <p className="text-slate-600 font-medium">Works on all devices</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Application Widget Tab */}
          <TabsContent value="application" className="space-y-8">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      Application Widget
                    </CardTitle>
                    <CardDescription className="text-slate-600 font-medium text-lg">
                      Collect loan applications with a customizable wizard-style form
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Premium Widget Preview */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg">
                      <Eye className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Widget Preview</h3>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-gradient-to-br from-slate-50 to-slate-100/50">
                    <div className="max-w-lg mx-auto">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Loan Application</h4>
                        <p className="text-slate-600 font-medium">Step 1 of 3</p>
                      </div>
                      <div className="space-y-4">
                        <Input
                          placeholder="Full Name"
                          className="h-12 text-slate-900 font-medium border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl"
                        />
                        <Input
                          placeholder="Email Address"
                          className="h-12 text-slate-900 font-medium border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl"
                        />
                        <Input
                          placeholder="Phone Number"
                          className="h-12 text-slate-900 font-medium border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl"
                        />
                        <Button className="w-full h-12 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white font-semibold rounded-xl shadow-lg">
                          Next Step
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-4 text-center font-medium">
                        Powered by {workspace?.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Embed Code */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg">
                        <Code className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Embed Code</h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCode(!showCode)}
                        className="border-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-slate-600 hover:text-[#D4AF37] px-4 py-2 rounded-lg transition-all duration-300"
                      >
                        {showCode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showCode ? "Hide" : "Show"} Code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(applicationWidgetCode)}
                        className="border-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-slate-600 hover:text-[#D4AF37] px-4 py-2 rounded-lg transition-all duration-300"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  {showCode && (
                    <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto shadow-lg">
                      <pre className="text-emerald-400 text-sm font-mono">
                        <code>{applicationWidgetCode}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Premium Form Configuration */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg">
                      <Settings className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Form Configuration</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
                        <h4 className="font-bold text-slate-900 text-lg mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                          Basic Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-200">
                            <span className="font-semibold text-slate-900">Full Name</span>
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Required</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-200">
                            <span className="font-semibold text-slate-900">Email Address</span>
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Required</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-200">
                            <span className="font-semibold text-slate-900">Phone Number</span>
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Required</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200">
                        <h4 className="font-bold text-slate-900 text-lg mb-4 flex items-center">
                          <Plus className="w-5 h-5 text-amber-600 mr-2" />
                          Custom Questions
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                            <span className="font-semibold text-slate-900">Loan Amount</span>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Optional</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                            <span className="font-semibold text-slate-900">Property Address</span>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Optional</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                            <span className="font-semibold text-slate-900">Employment Status</span>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Optional</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-2 border-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-slate-700 hover:text-[#D4AF37] font-semibold rounded-xl transition-all duration-300"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Configure Custom Questions
                  </Button>
                </div>

                {/* Premium Features */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg">
                      <Star className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Features</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group flex items-start space-x-4 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Wizard-Style Form</h4>
                        <p className="text-slate-600 font-medium">Step-by-step process</p>
                      </div>
                    </div>
                    <div className="group flex items-start space-x-4 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Settings className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Custom Questions</h4>
                        <p className="text-slate-600 font-medium">Add your own fields</p>
                      </div>
                    </div>
                    <div className="group flex items-start space-x-4 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <UserCheck className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Auto Client Creation</h4>
                        <p className="text-slate-600 font-medium">Creates client profile</p>
                      </div>
                    </div>
                    <div className="group flex items-start space-x-4 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Progress Tracking</h4>
                        <p className="text-slate-600 font-medium">Visual progress indicator</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
