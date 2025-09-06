"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Building2,
  User,
  Phone,
  Mail,
  DollarSign,
  MapPin,
  Briefcase
} from "lucide-react";

interface ApplicationData {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Loan Information
  loanAmount?: string;
  propertyAddress?: string;
  employmentStatus?: string;
  annualIncome?: string;
  creditScore?: string;
  
  // Additional Information
  loanPurpose?: string;
  downPayment?: string;
  additionalNotes?: string;
}

export default function ApplicationWidgetPage() {
  const searchParams = useSearchParams();
  const workspaceSlug = searchParams.get("workspace");
  const domain = searchParams.get("domain");
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [workspace, setWorkspace] = useState<any>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ApplicationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    loanAmount: "",
    propertyAddress: "",
    employmentStatus: "",
    annualIncome: "",
    creditScore: "",
    loanPurpose: "",
    downPayment: "",
    additionalNotes: ""
  });

  const submitApplication = useMutation(api.applications.submitApplication);
  const sendThankYouEmail = useAction(api.applications.sendApplicationThankYouEmail);
  const workspaceData = useQuery(api.auth.getWorkspaceBySlug, 
    workspaceSlug ? { slug: workspaceSlug } : "skip"
  );

  useEffect(() => {
    if (workspaceData) {
      setWorkspace({
        name: workspaceData.name,
        slug: workspaceData.slug,
        _id: workspaceData._id
      });
      setWorkspaceId(workspaceData._id);
    } else if (workspaceSlug) {
      // Fallback for when workspace data is not available
      setWorkspace({
        name: workspaceSlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        slug: workspaceSlug
      });
    }
  }, [workspaceData, workspaceSlug]);

  const steps = [
    {
      title: "Basic Information",
      description: "Tell us about yourself",
      fields: ["firstName", "lastName", "email", "phone"]
    },
    {
      title: "Loan Details",
      description: "Information about your loan request",
      fields: ["loanAmount", "propertyAddress", "employmentStatus", "annualIncome"]
    },
    {
      title: "Additional Information",
      description: "Help us understand your needs better",
      fields: ["creditScore", "loanPurpose", "downPayment", "additionalNotes"]
    }
  ];

  const handleInputChange = (field: keyof ApplicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;

    setIsSubmitting(true);
    setError("");
    setStatus("idle");

    try {
      // Submit the application
      const clientId = await submitApplication({
        workspaceId: workspaceId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        source: "widget",
        additionalData: {
          loanAmount: formData.loanAmount,
          propertyAddress: formData.propertyAddress,
          employmentStatus: formData.employmentStatus,
          annualIncome: formData.annualIncome,
          creditScore: formData.creditScore,
          loanPurpose: formData.loanPurpose,
          downPayment: formData.downPayment,
          additionalNotes: formData.additionalNotes
        }
      });

      // Send thank you email
      await sendThankYouEmail({
        clientId: clientId,
        workspaceId: workspaceId
      });

      setStatus("success");
    } catch (err) {
      console.error("Application submission error:", err);
      setError("Failed to submit application. Please try again.");
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (stepIndex: number) => {
    const step = steps[stepIndex];
    return step.fields.every(field => {
      const value = formData[field as keyof ApplicationData];
      return value && value.trim() !== "";
    });
  };

  if (!workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-black font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Application Submitted!
              </h2>
              <p className="text-black font-semibold mb-4">
                Thank you for your application. We'll review your information and contact you within 24 hours.
              </p>
              <p className="text-sm text-gray-600">
                You'll receive a confirmation email shortly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-black">
              Loan Application
            </CardTitle>
            <CardDescription className="text-black font-semibold">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </CardDescription>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                    <p className="text-sm text-red-700 font-semibold">{error}</p>
                  </div>
                </div>
              )}

              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-black">First Name *</label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="John"
                        required
                        className="font-bold text-black"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-black">Last Name *</label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Doe"
                        required
                        className="font-bold text-black"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-black">Email Address *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="font-bold text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-black">Phone Number *</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                      className="font-bold text-black"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Loan Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-black">Loan Amount *</label>
                    <Input
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                      placeholder="$500,000"
                      required
                      className="font-bold text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-black">Property Address *</label>
                    <Input
                      value={formData.propertyAddress}
                      onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
                      placeholder="123 Main St, City, State 12345"
                      required
                      className="font-bold text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-black">Employment Status *</label>
                    <Input
                      value={formData.employmentStatus}
                      onChange={(e) => handleInputChange("employmentStatus", e.target.value)}
                      placeholder="Employed, Self-employed, etc."
                      required
                      className="font-bold text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-black">Annual Income *</label>
                    <Input
                      value={formData.annualIncome}
                      onChange={(e) => handleInputChange("annualIncome", e.target.value)}
                      placeholder="$75,000"
                      required
                      className="font-bold text-black"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Additional Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-black">Credit Score</label>
                    <Input
                      value={formData.creditScore}
                      onChange={(e) => handleInputChange("creditScore", e.target.value)}
                      placeholder="750"
                      className="font-bold text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-black">Loan Purpose</label>
                    <Input
                      value={formData.loanPurpose}
                      onChange={(e) => handleInputChange("loanPurpose", e.target.value)}
                      placeholder="Home purchase, Refinance, etc."
                      className="font-bold text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-black">Down Payment</label>
                    <Input
                      value={formData.downPayment}
                      onChange={(e) => handleInputChange("downPayment", e.target.value)}
                      placeholder="$50,000"
                      className="font-bold text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-black">Additional Notes</label>
                    <Textarea
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                      placeholder="Any additional information you'd like to share..."
                      rows={3}
                      className="font-bold text-black"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep - 1)}
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-bold flex items-center"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isStepValid(currentStep - 1) || isSubmitting}
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-bold flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Powered by <span className="font-bold text-black">{workspace.name}</span>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
