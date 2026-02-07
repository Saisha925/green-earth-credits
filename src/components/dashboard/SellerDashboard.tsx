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
import { Bell, Upload, CheckCircle, Clock, FileText, Store, TrendingUp, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSellerListings } from "@/hooks/useListings";
import { AddListingModal } from "./AddListingModal";
import { useAuth } from "@/contexts/AuthContext";

export const SellerDashboard = () => {
  const { user } = useAuth();
  const { isDemoMode, retirementRequests, uploadProof, verifyRequest } = useDemoMode();
  const { listings, isLoading: listingsLoading } = useSellerListings();
  const [countdowns, setCountdowns] = useState<Record<string, number>>({});

  // Initialize and update countdowns for demo mode
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
    uploadProof(requestId, "mock-proof.pdf");
    toast.success("Proof uploaded successfully!");

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

  // Calculate seller stats from real listings
  const totalListed = listings.reduce((sum, l) => sum + l.credits, 0);
  const soldListings = listings.filter(l => l.status === "sold");
  const totalSold = soldListings.reduce((sum, l) => sum + l.credits, 0);
  const totalRevenue = soldListings.reduce((sum, l) => sum + l.credits * Number(l.price_per_tonne), 0);

  return (
  <>
    <div className="space-y-6">
      {/* Seller Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Listed Credits</p>
              <p className="text-3xl font-bold text-gradient">{totalListed.toLocaleString()} t</p>
            </div>
            <div className="flex-1">
  <p className="font-medium text-foreground">
    {pendingRequests.length} New Retirement Request{pendingRequests.length > 1 ? "s" : ""}
  </p>
  <p className="text-sm text-muted-foreground">
    Upload proof to release payment
  </p>
</div>

<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
  <Store className="w-6 h-6 text-primary" />
</div>

            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sold</p>
              <p className="text-3xl font-bold text-gradient">{totalSold.toLocaleString()} t</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-3xl font-bold text-gradient">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Listing Button */}
      <div className="flex justify-end">
        <AddListingModal />
      </div>

      {/* My Listings */}
      {listings.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">My Listings</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Price/t</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retirementRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.projectName}
                  </TableCell>
                  <TableCell>{request.buyerName}</TableCell>
                  <TableCell>{request.tonnes} t</TableCell>

                  <TableCell>
                    {request.status === "pending" &&
                    countdowns[request.id] !== undefined ? (
                      <span className="text-accent-foreground font-mono">
                        {formatCountdown(countdowns[request.id])}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {getStatusBadge(request.status)}
                  </TableCell>

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
                      <span className="text-sm text-primary">
                        Payment Released
                      </span>
                    )}
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.project_name}</TableCell>
                  <TableCell>{listing.credits.toLocaleString()} t</TableCell>
                  <TableCell>${Number(listing.price_per_tonne).toFixed(2)}</TableCell>
                  <TableCell>{listing.category}</TableCell>
                  <TableCell>
                    <Badge className="bg-primary/10 text-primary border-primary/20 capitalize">
                      {listing.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {listings.length === 0 && !listingsLoading && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-muted-foreground mb-4">
            No listings yet. Click "Add Listing" to list your first credits.
          </p>
        </div>
      )}

      {/* Demo Mode Retirement Requests */}
      {isDemoMode && (
        <>
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
          {retirementRequests.length > 0 && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">Retirement Requests (Demo)</h3>
              </div>
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
          )}
        </>
      )}
    </div>

    
  </>
);

};
