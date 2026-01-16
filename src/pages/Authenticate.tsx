import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, XCircle, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

const Authenticate = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "verifying" | "success" | "error">("idle");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.type.startsWith("image/"))) {
      setFile(droppedFile);
      setStatus("idle");
    } else {
      toast.error("Please upload a PDF or image file");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus("idle");
    }
  };

  const handleAuthenticate = async () => {
    if (!file) {
      toast.error("Please upload a certificate first");
      return;
    }

    setStatus("uploading");

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("verifying");

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Randomly succeed or fail for demo
    const isValid = Math.random() > 0.3;
    setStatus(isValid ? "success" : "error");

    if (isValid) {
      toast.success("Certificate verified successfully!");
      setTimeout(() => {
        navigate("/sell");
      }, 1500);
    } else {
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
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                isDragOver
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Drop your certificate here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (PDF or Image)
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
              disabled={!file || status === "uploading" || status === "verifying" || status === "success"}
            >
              {status === "uploading" || status === "verifying" ? (
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
