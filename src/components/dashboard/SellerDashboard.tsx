import { useDemoMode, RetirementRequest } from "@/contexts/DemoModeContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bell, Upload, CheckCircle, Clock, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const SellerDashboard = () => {
  const { retirementRequests, uploadProof, verifyRequest } = useDemoMode();
  const [countdowns, setCountdowns] = useState<Record<string, number>>({});

  // Initialize and update countdowns
  useEffect(() => {
    const initialCountdowns: Record<string, number> = {};
    retirementRequests.forEach(req => {
      if (req.status === "pending" && req.countdown) {
        initialCountdowns[req.id] = req.countdown;
      }
    });
    setCountdowns(initialCountdowns);

    const interval = setInterval(() => {
      setCountdowns(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          if (updated[id] > 0) {
            updated[id] -= 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [retirementRequests]);

  const pendingRequests = retirementRequests.filter(r => r.status === "pending");

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUploadProof = (requestId: string) => {
    // Simulate file upload
    uploadProof(requestId, "mock-proof.pdf");
    toast.success("Proof uploaded successfully!");
    
    // Auto-verify after a short delay for demo
    setTimeout(() => {
      verifyRequest(requestId);
      toast.success("Retirement verified! Payment released to seller.");
    }, 2000);
  };

  const getStatusBadge = (status: RetirementRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-accent text-accent-foreground">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "proof_uploaded":
        return (
          <Badge variant="outline" className="bg-secondary text-secondary-foreground">
            <FileText className="w-3 h-3 mr-1" />
            Proof Uploaded
          </Badge>
        );
      case "verified":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications Banner */}
      {pendingRequests.length > 0 && (
        <div className="glass-card rounded-xl p-4 border-accent bg-accent/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">
                {pendingRequests.length} New Retirement Request{pendingRequests.length > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-muted-foreground">
                Upload proof to release payment
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Retirement Requests Table */}
      {retirementRequests.length > 0 ? (
        <div className="glass-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Tonnes</TableHead>
                <TableHead>Countdown</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retirementRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.projectName}</TableCell>
                  <TableCell>{request.buyerName}</TableCell>
                  <TableCell>{request.tonnes} t</TableCell>
                  <TableCell>
                    {request.status === "pending" && countdowns[request.id] !== undefined ? (
                      <span className="text-accent-foreground font-mono">
                        {formatCountdown(countdowns[request.id])}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleUploadProof(request.id)}
                        className="gradient-primary text-primary-foreground"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload Proof
                      </Button>
                    )}
                    {request.status === "verified" && (
                      <span className="text-sm text-primary">Payment Released</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">
            No retirement requests yet. When buyers retire credits, they'll appear here.
          </p>
        </div>
      )}
    </div>
  );
};
