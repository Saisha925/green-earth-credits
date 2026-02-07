import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Leaf, AlertTriangle, CheckCircle, Shield, Info, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { calculateRetirementFees, PLATFORM_FEE_PERCENTAGE } from "@/lib/platformFees";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";

const projectData = {
  id: "1",
  title: "Amazon Rainforest Conservation Project",
  image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
  pricePerTonne: 18.50,
  country: "Brazil",
  category: "Avoided Deforestation",
  vintage: 2023,
};

const Retire = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { profile } = useProfile();
  const { isDemoMode, addRetirementRequest, demoRole } = useDemoMode();

  const [isLoading, setIsLoading] = useState(false);
  const [tonnes, setTonnes] = useState(1);
  const [beneficiary, setBeneficiary] = useState("");
  const [message, setMessage] = useState("");

  const fees = calculateRetirementFees(projectData.pricePerTonne, tonnes);

  const handleRetire = async () => {
    if (!user && !isDemoMode) {
      toast.error("Please log in to retire carbon credits");
      return;
    }

    if (!beneficiary) {
      toast.error("Please enter a beneficiary name");
      return;
    }

    setIsLoading(true);

    if (isDemoMode) {
      // Demo mode — add to demo context
      setTimeout(() => {
        addRetirementRequest({
          projectName: projectData.title,
          tonnes,
          buyerName: beneficiary,
        });
        setIsLoading(false);
        toast.success("Retirement requested. Payment held securely.", {
          description: "Switch to Seller role to process verification.",
        });
        navigate("/profile");
      }, 2000);
      return;
    }

    // Real mode — save to database
    if (!user) {
      setIsLoading(false);
      return;
    }

    const certificateId = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { error } = await supabase.from("retirement_records").insert({
      buyer_id: user.id,
      project_name: projectData.title,
      seller_name: "Marketplace Seller",
      tonnes,
      price_per_tonne: projectData.pricePerTonne,
      credit_subtotal: fees.creditSubtotal,
      platform_fee_percentage: PLATFORM_FEE_PERCENTAGE,
      platform_fee_amount: fees.platformFeeAmount,
      total_amount_paid: fees.totalAmountPaid,
      seller_amount: fees.sellerAmount,
      beneficiary_name: beneficiary,
      message,
      certificate_id: certificateId,
      status: "retired",
    });

    setIsLoading(false);

    if (error) {
      toast.error("Failed to retire credits. Please try again.");
      console.error("Retirement error:", error);
      return;
    }

    toast.success("Carbon credits retired successfully!");
    navigate("/profile");
  };

  const isAuthenticated = user || isDemoMode;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back Button */}
          <Link
            to={`/marketplace/${id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </Link>

          <h1 className="font-display text-3xl font-bold mb-8">Retire Carbon Credits</h1>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-3 space-y-6">
              <div className="glass-card rounded-2xl p-6 space-y-6">
                {/* Auth Warning */}
                {!isAuthenticated && !authLoading && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <Lock className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Authentication Required</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Please{" "}
                        <Link to="/login" className="text-primary hover:underline">log in</Link>{" "}
                        or{" "}
                        <Link to="/register" className="text-primary hover:underline">sign up</Link>{" "}
                        to retire carbon credits.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tonnes Input */}
                <div className="space-y-3">
                  <Label htmlFor="tonnes" className="text-base font-medium">
                    How many tonnes would you like to retire?
                  </Label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTonnes(Math.max(1, tonnes - 1))}
                      disabled={tonnes <= 1 || !isAuthenticated}
                    >
                      -
                    </Button>
                    <Input
                      id="tonnes"
                      type="number"
                      min={1}
                      value={tonnes}
                      onChange={(e) => setTonnes(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 h-12 text-center text-lg font-semibold"
                      disabled={!isAuthenticated}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTonnes(tonnes + 1)}
                      disabled={!isAuthenticated}
                    >
                      +
                    </Button>
                    <span className="text-muted-foreground">tonnes</span>
                  </div>
                </div>

                <Separator />

                {/* Beneficiary */}
                <div className="space-y-3">
                  <Label htmlFor="beneficiary" className="text-base font-medium">
                    Beneficiary Name
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    The name of the person or organization retiring these credits
                  </p>
                  <Input
                    id="beneficiary"
                    placeholder="Enter beneficiary name"
                    value={beneficiary}
                    onChange={(e) => setBeneficiary(e.target.value)}
                    className="h-12"
                    disabled={!isAuthenticated}
                  />
                </div>

                {/* Public Message */}
                <div className="space-y-3">
                  <Label htmlFor="message" className="text-base font-medium">
                    Public Message (Optional)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Add a message to be displayed on your retirement certificate
                  </p>
                  <Textarea
                    id="message"
                    placeholder="Why are you retiring these credits?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    disabled={!isAuthenticated}
                  />
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      Do not include personally identifiable information in your message.
                      This will be publicly visible on the blockchain.
                    </span>
                  </div>
                </div>

                <Separator />

                {/* FAQ Accordions */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="payment">
                    <AccordionTrigger>Payment & Privacy Information</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      <ul className="list-disc pl-4 space-y-2">
                        <li>Payment is processed securely via our payment provider</li>
                        <li>Your payment details are never stored on our servers</li>
                        <li>Transactions are recorded on the blockchain for transparency</li>
                        <li>You'll receive a receipt via email after successful retirement</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="after">
                    <AccordionTrigger>What happens after retirement?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      <ul className="list-disc pl-4 space-y-2">
                        <li>Credits are permanently removed from circulation</li>
                        <li>A retirement certificate is generated with your details</li>
                        <li>The retirement is recorded on the carbon registry</li>
                        <li>You can view and download your certificate from your profile</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6 space-y-6 glow-green-subtle sticky top-28">
                {/* Project Preview */}
                <div className="flex gap-4">
                  <img
                    src={projectData.image}
                    alt={projectData.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                      {projectData.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {projectData.country} • {projectData.vintage}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown with Platform Fee */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per tonne</span>
                    <span>${projectData.pricePerTonne.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity</span>
                    <span>{tonnes} tonnes</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credits cost</span>
                    <span>${fees.creditSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      Platform fee ({PLATFORM_FEE_PERCENTAGE}%)
                      <Info className="w-3 h-3" />
                    </span>
                    <span>${fees.platformFeeAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium">Total payable</span>
                    <span className="text-2xl font-bold text-gradient">
                      ${fees.totalAmountPaid.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Platform Fee Info */}
                <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <p>
                    Platform fee covers verification, escrow handling, and marketplace operations.
                  </p>
                </div>

                {/* Verification Badge */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Verified & Certified Project</span>
                </div>

                {/* CTA */}
                <Button
                  className="w-full h-14 gradient-primary text-primary-foreground btn-glow font-semibold text-lg"
                  onClick={handleRetire}
                  disabled={isLoading || !isAuthenticated}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : !isAuthenticated ? (
                    <span className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Log in to Retire
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Leaf className="w-5 h-5" />
                      Retire Carbon
                    </span>
                  )}
                </Button>

                {!isAuthenticated && (
                  <p className="text-xs text-center text-muted-foreground">
                    <Link to="/login" className="text-primary hover:underline">Log in</Link> or{" "}
                    <Link to="/register" className="text-primary hover:underline">sign up</Link> to continue
                  </p>
                )}

                {isAuthenticated && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <span>
                      By retiring, you're permanently removing these carbon credits from
                      circulation and contributing to climate action.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Retire;
