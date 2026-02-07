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
import {
  Bell,
  Upload,
  CheckCircle,
  Clock,
  FileText,
  Store,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSellerListings } from "@/hooks/useListings";
import { AddListingModal } from "./AddListingModal";
import { useAuth } from "@/contexts/AuthContext";

export const SellerDashboard = () => {
  const { user } = useAuth();
  const { isDemoMode, retirementRequests, uploadProof, verifyRequest } =
    useDemoMode();
  const { listings, isLoading: listingsLoading } = useSellerListings();

  const [countdowns, setCountdowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const initialCountdowns: Record<string, number> = {};

    retirementRequests.forEach((req) => {
      if (req.status === "pending" && req.countdown) {
        initialCountdowns[req.id] = req.countdown;
      }
    });

    setCountdowns(initialCountdowns);

    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (updated[id] > 0) updated[id] -= 1;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [retirementRequests]);

  const pendingRequests = retirementRequests.filter(
    (r) => r.status === "pending"
  );

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleUploadProof = (requestId: string) => {
    uploadProof(requestId, "mock-proof.pdf");
    toast.success("Proof uploaded successfully!");

    setTimeout(() => {
      verifyRequest(requestId);
      toast.success("Retirement verified! Payment released.");
    }, 2000);
  };

  const getStatusBadge = (status: RetirementRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "proof_uploaded":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <FileText className="w-3 h-3 mr-1" />
            Proof Uploaded
          </Badge>
        );
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
    }
  };

  const totalListed = listings.reduce((sum, l) => sum + l.credits, 0);
  const soldListings = listings.filter((l) => l.status === "sold");
  const totalSold = soldListings.reduce((sum, l) => sum + l.credits, 0);
  const totalRevenue = soldListings.reduce(
    (sum, l) => sum + l.credits * Number(l.price_per_tonne),
    0
  );

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">Listed Credits</p>
          <p className="text-3xl font-bold">
            {totalListed.toLocaleString()} t
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">Sold</p>
          <p className="text-3xl font-bold">
            {totalSold.toLocaleString()} t
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="text-3xl font-bold">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add Listing */}
      <div className="flex justify-end">
        <AddListingModal />
      </div>

      {/* My Listings Table */}
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
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">
                    {listing.project_name}
                  </TableCell>
                  <TableCell>
                    {listing.credits.toLocaleString()} t
                  </TableCell>
                  <TableCell>
                    ${Number(listing.price_per_tonne).toFixed(2)}
                  </TableCell>
                  <TableCell>{listing.category}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 border-green-300 capitalize">
                      {listing.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty State */}
      {listings.length === 0 && !listingsLoading && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">
            No listings yet. Click "Add Listing" to list your first credits.
          </p>
        </div>
      )}

      {/* Demo Mode Retirement Requests */}
      {isDemoMode && retirementRequests.length > 0 && (
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
                  <TableCell>{request.projectName}</TableCell>
                  <TableCell>{request.buyerName}</TableCell>
                  <TableCell>{request.tonnes} t</TableCell>
                  <TableCell>
                    {request.status === "pending" &&
                    countdowns[request.id] !== undefined
                      ? formatCountdown(countdowns[request.id])
                      : "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleUploadProof(request.id)}
                      >
                        Upload Proof
                      </Button>
                    )}
                    {request.status === "verified" && "Payment Released"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
