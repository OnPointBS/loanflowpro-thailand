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
  Edit
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Widgets
          </h1>
          <p className="text-black font-semibold">
            Embeddable widgets for your website to collect applications and enable client sign-ins
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Sign-In Widget
            </TabsTrigger>
            <TabsTrigger value="application" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Application Widget
            </TabsTrigger>
          </TabsList>

          {/* Sign-In Widget Tab */}
          <TabsContent value="signin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Sign-In Widget
                </CardTitle>
                <CardDescription className="text-black font-semibold">
                  Allow clients to sign in to their portal directly from your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Widget Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-black">Widget Preview</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white">
                    <div className="max-w-md mx-auto">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-2">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-black">Client Portal Sign-In</h4>
                        <p className="text-sm text-black font-semibold">Sign in to access your loan information</p>
                      </div>
                      <div className="space-y-3">
                        <Input
                          placeholder="Enter your email"
                          className="font-bold text-black"
                        />
                        <Button className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white font-bold">
                          Send Magic Link
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Powered by {workspace?.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Embed Code */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-black">Embed Code</h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCode(!showCode)}
                      >
                        {showCode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showCode ? "Hide" : "Show"} Code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(signInWidgetCode)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  {showCode && (
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{signInWidgetCode}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Domain Authorization */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-black">Authorized Domains</h3>
                  <p className="text-sm text-black font-semibold">
                    Only these domains can embed your sign-in widget
                  </p>
                  
                  <div className="space-y-3">
                    {authorizedDomains.map((domain) => (
                      <div key={domain} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="font-bold text-black">{domain}</span>
                          <Badge variant="success" className="ml-2">Active</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeDomain(domain)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Add domain (e.g., example.com)"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        className="font-bold text-black"
                      />
                      <Button onClick={addDomain} disabled={!newDomain}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-black">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-black">Magic Link Authentication</h4>
                        <p className="text-sm text-black font-semibold">Secure, passwordless sign-in</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-black">Domain Authorization</h4>
                        <p className="text-sm text-black font-semibold">Control which sites can embed</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-black">Workspace Branding</h4>
                        <p className="text-sm text-black font-semibold">Shows your company name</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-black">Responsive Design</h4>
                        <p className="text-sm text-black font-semibold">Works on all devices</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Application Widget Tab */}
          <TabsContent value="application" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Application Widget
                </CardTitle>
                <CardDescription className="text-black font-semibold">
                  Collect loan applications with a customizable wizard-style form
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Widget Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-black">Widget Preview</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white">
                    <div className="max-w-lg mx-auto">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-2">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-black">Loan Application</h4>
                        <p className="text-sm text-black font-semibold">Step 1 of 3</p>
                      </div>
                      <div className="space-y-4">
                        <Input
                          placeholder="Full Name"
                          className="font-bold text-black"
                        />
                        <Input
                          placeholder="Email Address"
                          className="font-bold text-black"
                        />
                        <Input
                          placeholder="Phone Number"
                          className="font-bold text-black"
                        />
                        <Button className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white font-bold">
                          Next Step
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Powered by {workspace?.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Embed Code */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-black">Embed Code</h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCode(!showCode)}
                      >
                        {showCode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showCode ? "Hide" : "Show"} Code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(applicationWidgetCode)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  {showCode && (
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{applicationWidgetCode}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Form Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-black">Form Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-black">Basic Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-bold text-black">Full Name</span>
                          <Badge variant="success">Required</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-bold text-black">Email Address</span>
                          <Badge variant="success">Required</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-bold text-black">Phone Number</span>
                          <Badge variant="success">Required</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-bold text-black">Custom Questions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-bold text-black">Loan Amount</span>
                          <Badge variant="warning">Optional</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-bold text-black">Property Address</span>
                          <Badge variant="warning">Optional</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-bold text-black">Employment Status</span>
                          <Badge variant="warning">Optional</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Custom Questions
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-black">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-black">Wizard-Style Form</h4>
                        <p className="text-sm text-black font-semibold">Step-by-step process</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-black">Custom Questions</h4>
                        <p className="text-sm text-black font-semibold">Add your own fields</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-black">Auto Client Creation</h4>
                        <p className="text-sm text-black font-semibold">Creates client profile</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-black">Progress Tracking</h4>
                        <p className="text-sm text-black font-semibold">Visual progress indicator</p>
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
