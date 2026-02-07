import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { LocationPicker } from "@/components/map/LocationPicker";
import { Store, MapPin, DollarSign, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  "Reforestation",
  "Avoided Deforestation",
  "Blue Carbon",
  "Renewable Energy",
  "Clean Cookstoves",
  "Energy Efficiency",
];

const registries = [
  "Verra VCS",
  "Gold Standard",
  "American Carbon Registry",
  "Climate Action Reserve",
];

const Sell = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    ownerName: "",
    category: "",
    registry: "",
    credits: "",
    vintageYear: "",
    pricePerTonne: "",
    latitude: "",
    longitude: "",
    country: "",
  });

  // Pre-fill from authenticated certificate when user arrives from Authenticate page
  useEffect(() => {
    const stored = localStorage.getItem("authenticatedCertificate");
    if (!stored) return;
    try {
      const data = JSON.parse(stored) as { certificate?: Record<string, string> };
      const cert = data?.certificate;
      if (!cert) return;
      setFormData((prev) => ({
        ...prev,
        ...(cert.project_name && { projectName: cert.project_name }),
        ...(cert.vintage && { vintageYear: cert.vintage }),
        ...(cert.country && { country: cert.country }),
      }));
    } catch {
      // ignore invalid stored data
    }
  }, []);

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat.toFixed(4),
      longitude: lng.toFixed(4),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.projectName || !formData.ownerName || !formData.category ||
        !formData.registry || !formData.credits || !formData.vintageYear ||
        !formData.pricePerTonne) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user) {
      toast.error("Please log in to list credits");
      return;
    }

    setIsLoading(true);

    const storedCertificate = localStorage.getItem("authenticatedCertificate");
    let authenticationData: Record<string, unknown> | null = null;

    if (storedCertificate) {
      try {
        authenticationData = JSON.parse(storedCertificate) as Record<string, unknown>;
      } catch (error) {
        console.error("Failed to parse stored certificate data:", error);
      }
    }

    const response = await fetch("/server/api/list-certificate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listing: {
          projectName: formData.projectName,
          ownerName: formData.ownerName,
          category: formData.category,
          registry: formData.registry,
          credits: formData.credits,
          vintageYear: formData.vintageYear,
          pricePerTonne: formData.pricePerTonne,
          latitude: formData.latitude,
          longitude: formData.longitude,
          country: formData.country,
          sellerId: user.id,
          sellerEmail: user.email,
        },
        authentication: authenticationData,
      }),
    });

    setIsLoading(false);

    if (!response.ok) {
      toast.error("Failed to list credits. Please try again.");
      console.error("Listing error:", await response.text());
      return;
    }

    toast.success("Your credits have been listed successfully!");
    localStorage.removeItem("authenticatedCertificate");
    navigate("/marketplace");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 glow-green-subtle">
              <Store className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl font-bold mb-4">List Your Carbon Credits</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your certificate has been verified. Complete the listing details below
              to start selling on the marketplace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-8">
            {/* Project Information */}
            <div className="space-y-6">
              <h2 className="font-semibold text-lg">Project Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., Amazon Rainforest Conservation"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    placeholder="e.g., Conservation International"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registry">Registry *</Label>
                  <Select
                    value={formData.registry}
                    onValueChange={(value) => setFormData({ ...formData, registry: value })}
                  >
                    <SelectTrigger id="registry">
                      <SelectValue placeholder="Select registry" />
                    </SelectTrigger>
                    <SelectContent>
                      {registries.map((reg) => (
                        <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Credit Details */}
            <div className="space-y-6">
              <h2 className="font-semibold text-lg">Credit Details</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="credits">Number of Credits *</Label>
                  <Input
                    id="credits"
                    type="number"
                    placeholder="e.g., 5000"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">1 credit = 1 tonne CO₂e</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vintageYear">Vintage Year *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="vintageYear"
                      type="number"
                      placeholder="e.g., 2024"
                      className="pl-10"
                      value={formData.vintageYear}
                      onChange={(e) => setFormData({ ...formData, vintageYear: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerTonne">Price per Tonne (USD) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="pricePerTonne"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 18.50"
                      className="pl-10"
                      value={formData.pricePerTonne}
                      onChange={(e) => setFormData({ ...formData, pricePerTonne: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="e.g., Brazil"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>

            <Separator />

            {/* Location */}
            <div className="space-y-6">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Project Location
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.0001"
                    placeholder="e.g., -3.4653"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.0001"
                    placeholder="e.g., -62.2159"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  />
                </div>
              </div>

              {/* Interactive Map */}
              <LocationPicker
                latitude={formData.latitude ? parseFloat(formData.latitude) : undefined}
                longitude={formData.longitude ? parseFloat(formData.longitude) : undefined}
                onLocationChange={handleLocationChange}
                className="h-64"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-14 gradient-primary text-primary-foreground btn-glow font-semibold text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Listing credits...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  List Credits
                </span>
              )}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;
