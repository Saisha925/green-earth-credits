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
import { User, Mail, Phone, Edit2, Leaf, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

// Mock user data
const userData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  role: "buyer",
  totalRetired: 142,
  totalListed: 0,
};

// Mock listed credits
const listedCredits = [
  {
    id: "1",
    projectName: "Amazon Rainforest Conservation",
    credits: 5000,
    pricePerTonne: 18.50,
    status: "active",
  },
  {
    id: "2",
    projectName: "Wind Farm Development Kenya",
    credits: 2500,
    pricePerTonne: 12.75,
    status: "active",
  },
];

// Mock retired credits
const retiredCredits = [
  {
    id: "1",
    projectName: "Amazon Rainforest Conservation",
    tonnes: 50,
    date: "2025-01-10",
    certificateId: "CERT-2025-001",
    status: "retired",
  },
  {
    id: "2",
    projectName: "Mangrove Restoration Initiative",
    tonnes: 25,
    date: "2025-01-05",
    certificateId: "CERT-2025-002",
    status: "retired",
  },
  {
    id: "3",
    projectName: "Wind Farm Development Kenya",
    tonnes: 67,
    date: "2024-12-20",
    certificateId: "CERT-2024-089",
    status: "retired",
  },
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

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
                      <h2 className="font-semibold text-xl">{userData.name}</h2>
                      <Badge className="mt-1 capitalize">{userData.role}</Badge>
                      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {userData.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {userData.phone}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Edit Button & Stats */}
              <div className="flex flex-col items-end gap-4">
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gradient">{userData.totalRetired}</p>
                    <p className="text-sm text-muted-foreground">Tonnes Retired</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gradient">{userData.totalListed}</p>
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
              <div className="glass-card rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Tonnes</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Certificate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {retiredCredits.map((credit) => (
                      <TableRow key={credit.id}>
                        <TableCell className="font-medium">{credit.projectName}</TableCell>
                        <TableCell>{credit.tonnes} t</TableCell>
                        <TableCell>{credit.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-primary">
                            {credit.certificateId}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Retired
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="listed">
              {listedCredits.length > 0 ? (
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
                      {listedCredits.map((credit) => (
                        <TableRow key={credit.id}>
                          <TableCell className="font-medium">{credit.projectName}</TableCell>
                          <TableCell>{credit.credits.toLocaleString()} t</TableCell>
                          <TableCell>${credit.pricePerTonne.toFixed(2)}</TableCell>
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

          {/* Success Message */}
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
