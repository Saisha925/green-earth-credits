import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  extractCertificateFields,
  authenticateCarbonCredit,
  validateCertificateData,
  CertificateFields,
  AuthenticationResult,
} from "@/lib/carbonApi";

interface CertificateAuthenticatorProps {
  onSuccess?: (result: AuthenticationResult) => void;
  onError?: (error: Error) => void;
}

export const CertificateAuthenticator = ({
  onSuccess,
  onError,
}: CertificateAuthenticatorProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"input" | "extracting" | "authenticating" | "result">("input");
  const [certificateData, setCertificateData] = useState<CertificateFields>({});
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");

  const handleExtractFields = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter certificate text or details");
      return;
    }

    setIsLoading(true);
    setStep("extracting");
    setError(null);

    try {
      const fields = await extractCertificateFields(inputText);
      setCertificateData(fields);

      // Validate extracted data
      const validation = validateCertificateData(fields);
      if (!validation.valid) {
        setError(
          `Missing required fields: ${validation.errors.join(", ")}`
        );
        setStep("input");
        setIsLoading(false);
        return;
      }

      // Proceed to authentication
      setStep("authenticating");
      authenticateFields(fields);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to extract fields";
      setError(errorMsg);
      toast.error(errorMsg);
      setStep("input");
      setIsLoading(false);

      if (onError) {
        onError(new Error(errorMsg));
      }
    }
  };

  const authenticateFields = async (fields: CertificateFields) => {
    try {
      const result = await authenticateCarbonCredit(fields);
      setAuthResult(result);
      setStep("result");
      setIsLoading(false);

      if (result.authenticated) {
        toast.success(
          `Certificate authenticated! Confidence: ${(result.confidence * 100).toFixed(1)}%`
        );
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        toast.warning(
          `Certificate confidence low (${(result.confidence * 100).toFixed(1)}%). Manual review recommended.`
        );
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to authenticate";
      setError(errorMsg);
      toast.error(errorMsg);
      setStep("input");
      setIsLoading(false);

      if (onError) {
        onError(new Error(errorMsg));
      }
    }
  };

  const handleReset = () => {
    setStep("input");
    setCertificateData({});
    setAuthResult(null);
    setError(null);
    setInputText("");
  };

  const handleManualInput = async () => {
    setError(null);

    // Manual input validation
    const validation = validateCertificateData(certificateData);
    if (!validation.valid) {
      setError(`Missing required fields: ${validation.errors.join(", ")}`);
      return;
    }

    setIsLoading(true);
    setStep("authenticating");
    authenticateFields(certificateData);
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant="outline"
        className="gap-2"
      >
        <Shield className="w-4 h-4" />
        Verify Carbon Certificate
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Carbon Certificate Authentication
            </AlertDialogTitle>
            <AlertDialogDescription>
              Verify your carbon credit certificate against Carbonmark API data
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            {step === "input" && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Certificate Text or PDF Content</Label>
                  <Textarea
                    placeholder="Paste certificate text here (Project Name, Vintage Year, Country, Methodology)"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="h-32"
                  />
                  <Button
                    onClick={handleExtractFields}
                    disabled={isLoading || !inputText.trim()}
                    className="mt-2 w-full"
                  >
                    {isLoading ? "Extracting..." : "Extract & Authenticate"}
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-2 block font-semibold">Or Enter Manually</Label>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="project" className="text-sm">
                        Project Name
                      </Label>
                      <Input
                        id="project"
                        placeholder="e.g., Solar Farm Alpha"
                        value={certificateData.project_name || ""}
                        onChange={(e) =>
                          setCertificateData({
                            ...certificateData,
                            project_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="vintage" className="text-sm">
                        Vintage Year
                      </Label>
                      <Input
                        id="vintage"
                        placeholder="e.g., 2023"
                        value={certificateData.vintage || ""}
                        onChange={(e) =>
                          setCertificateData({
                            ...certificateData,
                            vintage: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-sm">
                        Country
                      </Label>
                      <Input
                        id="country"
                        placeholder="e.g., India"
                        value={certificateData.country || ""}
                        onChange={(e) =>
                          setCertificateData({
                            ...certificateData,
                            country: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="methodology" className="text-sm">
                        Methodology
                      </Label>
                      <Input
                        id="methodology"
                        placeholder="e.g., VCS"
                        value={certificateData.methodology || ""}
                        onChange={(e) =>
                          setCertificateData({
                            ...certificateData,
                            methodology: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button
                      onClick={handleManualInput}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Authenticating..." : "Authenticate"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === "extracting" && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Extracting certificate fields...</p>
              </div>
            )}

            {step === "authenticating" && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Authenticating against Carbonmark...</p>
              </div>
            )}

            {step === "result" && authResult && (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg flex items-start gap-3 ${
                    authResult.authenticated
                      ? "bg-green-50 border border-green-200"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  {authResult.authenticated ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {authResult.authenticated ? "Certificate Verified" : "Low Confidence"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Confidence: {(authResult.confidence * 100).toFixed(1)}%
                    </p>
                    {authResult.matched_credit_id && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Matched Credit ID: {authResult.matched_credit_id}
                      </p>
                    )}
                  </div>
                </div>

                {authResult.matched_project && (
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-semibold mb-2">Matched Project Details</p>
                    <div className="space-y-1">
                      <p>
                        <strong>Name:</strong> {authResult.matched_project.name}
                      </p>
                      <p>
                        <strong>Country:</strong> {authResult.matched_project.country}
                      </p>
                      <p>
                        <strong>Vintage:</strong> {authResult.matched_project.vintage}
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <AlertDialogCancel onClick={handleReset}>Close</AlertDialogCancel>
            {step === "result" && (
              <AlertDialogAction onClick={handleReset}>Authenticate Another</AlertDialogAction>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
