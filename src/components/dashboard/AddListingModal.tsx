import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSellerListings } from "@/hooks/useListings";

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

export const AddListingModal = () => {
  const { addListing } = useSellerListings();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    category: "",
    registry: "",
    credits: "",
    vintage_year: "",
    price_per_tonne: "",
    country: "",
  });

  const resetForm = () => {
    setFormData({
      project_name: "",
      description: "",
      category: "",
      registry: "",
      credits: "",
      vintage_year: "",
      price_per_tonne: "",
      country: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.project_name || !formData.category || !formData.registry ||
      !formData.credits || !formData.vintage_year || !formData.price_per_tonne) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const { error } = await addListing({
      project_name: formData.project_name,
      description: formData.description,
      category: formData.category,
      registry: formData.registry,
      credits: parseInt(formData.credits),
      vintage_year: parseInt(formData.vintage_year),
      price_per_tonne: parseFloat(formData.price_per_tonne),
      country: formData.country,
      latitude: null,
      longitude: null,
    });

    setIsLoading(false);

    if (error) {
      toast.error("Failed to create listing. Please try again.");
      console.error("Listing error:", error);
      return;
    }

    toast.success("Listing created successfully!");
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground btn-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Listing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Credit Listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_name">Project Name *</Label>
            <Input
              id="project_name"
              placeholder="e.g., Amazon Rainforest Conservation"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the project..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Registry *</Label>
              <Select
                value={formData.registry}
                onValueChange={(v) => setFormData({ ...formData, registry: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {registries.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credits">Credits *</Label>
              <Input
                id="credits"
                type="number"
                placeholder="5000"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vintage_year">Vintage *</Label>
              <Input
                id="vintage_year"
                type="number"
                placeholder="2024"
                value={formData.vintage_year}
                onChange={(e) => setFormData({ ...formData, vintage_year: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">$/tonne *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="18.50"
                value={formData.price_per_tonne}
                onChange={(e) => setFormData({ ...formData, price_per_tonne: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="e.g., Brazil"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary text-primary-foreground btn-glow"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Listing"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
