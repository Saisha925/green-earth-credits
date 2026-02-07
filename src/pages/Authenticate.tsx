import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, XCircle, Loader2, Shield, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoModeContext";

const Authenticate = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { isDemoMode } = useDemoMode();
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "verifying" | "success" | "error">("idle");

  const isAuthenticated = user || isDemoMode;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isAuthenticated) setIsDragOver(true);
  }, [isAuthenticated]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!isAuthenticated) {
      toast.error("Please log in to upload certificates");
      return;
    }
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.type.startsWith("image/"))) {
      setFile(droppedFile);
      setStatus("idle");
    } else {
      toast.error("Please upload a PDF or image file");
    }
  }, [isAuthenticated]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      toast.error("Please log in to upload certificates");
      return;
    }
    
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus("idle");
    }
  };

  const handleAuthenticate = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to authenticate certificates");
      return;
    }
    
    if (!file) {
      toast.error("Please upload a certificate first");
      return;
    }

    setStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const request = fetch("/server/api/authenticate-certificate", {
        method: "POST",
        body: formData,
      });

      setStatus("verifying");
      const response = await request;
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        setStatus("error");
        toast.error("Certificate verification failed. Please try again.");
        return;
      }

      localStorage.setItem("authenticatedCertificate", JSON.stringify(payload.data));
      setStatus("success");
      toast.success("Certificate verified successfully!");
      setTimeout(() => {
        navigate("/sell");
      }, 1500);
    } catch (error) {
      console.error("Authentication error:", error);
      setStatus("error");
      toast.error("Certificate verification failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 glow-green-subtle">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl font-bold mb-4">Authenticate Certificate</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upload your carbon credit certificate for verification. 
              Once validated, you can list your credits on the marketplace.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 space-y-6">
            {/* Auth Warning */}
            {!isAuthenticated && !authLoading && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <Lock className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Authentication Required</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      log in
                    </Link>{" "}
                    or{" "}
                    <Link to="/register" className="text-primary hover:underline">
                      sign up
                    </Link>{" "}
                    to authenticate certificates.
                  </p>
                </div>
              </div>
            )}
            
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                !isAuthenticated
                  ? "border-muted opacity-50 cursor-not-allowed"
                  : isDragOver
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : file
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className={`absolute inset-0 w-full h-full opacity-0 ${isAuthenticated ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                disabled={!isAuthenticated}
              />

              {file ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                      setStatus("idle");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto">
                    {isAuthenticated ? (
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    ) : (
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {isAuthenticated ? "Drop your certificate here" : "Login required"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isAuthenticated ? "or click to browse (PDF or Image)" : "Please log in to upload certificates"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status Display */}
            {status !== "idle" && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                status === "success" 
                  ? "bg-primary/10 text-primary" 
                  : status === "error"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted"
              }`}>
                {status === "uploading" && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading certificate...</span>
                  </>
                )}
                {status === "verifying" && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying certificate authenticity...</span>
                  </>
                )}
                {status === "success" && (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Certificate verified! Redirecting to listing...</span>
                  </>
                )}
                {status === "error" && (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span>Verification failed. Please check your certificate and try again.</span>
                  </>
                )}
              </div>
            )}

            {/* Authenticate Button */}
            <Button
              className="w-full h-14 gradient-primary text-primary-foreground btn-glow font-semibold text-lg"
              onClick={handleAuthenticate}
              disabled={!file || status === "uploading" || status === "verifying" || status === "success" || !isAuthenticated}
            >
              {!isAuthenticated ? (
                <span className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Log in to Authenticate
                </span>
              ) : status === "uploading" || status === "verifying" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Authenticate Certificate
                </span>
              )}
            </Button>

            {/* Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                We support certificates from Verra, Gold Standard, American Carbon Registry,
                and Climate Action Reserve.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Authenticate;
