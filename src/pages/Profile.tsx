import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Mail, Phone, Edit2, Leaf, CheckCircle, ExternalLink, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { useSellerListings, useRetirementRecords } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";
import { generateCertificatePDF } from "@/lib/certificateGenerator";

const Profile = () => {
  const { user } = useAuth();
  const { profile, role, isLoading: profileLoading, updateProfile } = useProfile();
  const { listings } = useSellerListings();
  const { records: retiredCredits, isLoading: recordsLoading } = useRetirementRecords();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Sync form data with profile when profile loads or editing starts
  const startEditing = () => {
    setFormData({
      name: profile?.full_name || "",
      email: profile?.email || user?.email || "",
      phone: profile?.phone || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    const { error } = await updateProfile({
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });

    if (error) {
      toast.error("Failed to update profile");
      return;
    }

    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleGenerateCertificate = (record: any) => {
    generateCertificatePDF({
      certificateId: record.certificate_id,
      buyerName: profile?.full_name || "User",
      buyerId: user?.id || "",
      sellerName: record.seller_name || "Marketplace Seller",
      projectName: record.project_name,
      tonnes: record.tonnes,
      pricePerTonne: Number(record.price_per_tonne),
      totalAmount: Number(record.total_amount_paid),
      platformFee: Number(record.platform_fee_amount),
      beneficiaryName: record.beneficiary_name,
      date: new Date(record.created_at).toLocaleDateString(),
      status: record.status,
    });
    toast.success("Certificate PDF downloaded!");
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || user?.email || "";
  const displayPhone = profile?.phone || "";
  const totalRetired = retiredCredits.reduce((sum, r) => sum + r.tonnes, 0);
  const totalListed = listings.reduce((sum, l) => sum + l.credits, 0);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-4xl font-bold mb-8">Profile</h1>

          {/* Profile Card */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              {/* User Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave}>Save</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="font-semibold text-xl">{displayName}</h2>
                      <Badge className="mt-1 capitalize">{role || "buyer"}</Badge>
                      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {displayEmail}
                        </div>
                        {displayPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {displayPhone}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Edit Button & Stats */}
              <div className="flex flex-col items-end gap-4">
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={startEditing}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gradient">{totalRetired}</p>
                    <p className="text-sm text-muted-foreground">Tonnes Retired</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gradient">{totalListed}</p>
                    <p className="text-sm text-muted-foreground">Credits Listed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credits Tabs */}
          <Tabs defaultValue="retired" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
              <TabsTrigger value="retired" className="h-10">
                <Leaf className="w-4 h-4 mr-2" />
                Retired Credits
              </TabsTrigger>
              <TabsTrigger value="listed" className="h-10">
                Listed Credits
              </TabsTrigger>
            </TabsList>

            <TabsContent value="retired">
              {retiredCredits.length > 0 ? (
                <div className="glass-card rounded-2xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Tonnes</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Certificate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {retiredCredits.map((credit: any) => (
                        <TableRow key={credit.id}>
                          <TableCell className="font-medium">{credit.project_name}</TableCell>
                          <TableCell>{credit.tonnes} t</TableCell>
                          <TableCell>{new Date(credit.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className="text-sm text-primary">{credit.certificate_id}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-primary/10 text-primary border-primary/20 capitalize">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {credit.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGenerateCertificate(credit)}
                              className="text-primary"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              PDF
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <p className="text-muted-foreground">No retired credits yet. Visit the marketplace to retire credits.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="listed">
              {listings.length > 0 ? (
                <div className="glass-card rounded-2xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Price/t</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings.map((credit) => (
                        <TableRow key={credit.id}>
                          <TableCell className="font-medium">{credit.project_name}</TableCell>
                          <TableCell>{credit.credits.toLocaleString()} t</TableCell>
                          <TableCell>${Number(credit.price_per_tonne).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className="bg-primary/10 text-primary border-primary/20 capitalize">
                              {credit.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <p className="text-muted-foreground mb-4">You haven't listed any credits yet.</p>
                  <Button className="gradient-primary text-primary-foreground">
                    List Your First Credits
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Info Message */}
          <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <p className="text-sm text-primary">
              <Leaf className="w-4 h-4 inline mr-2" />
              Your credits have been retired/listed. View your transaction history above.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
