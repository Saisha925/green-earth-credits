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
import { Zap, Factory, Truck } from "lucide-react";
import { OrganizationInputs } from "@/lib/carbonCalculations";

const materialTypes = [
  { value: "steel", label: "Steel" },
  { value: "aluminum", label: "Aluminum" },
  { value: "plastic", label: "Plastic" },
  { value: "paper", label: "Paper" },
  { value: "glass", label: "Glass" },
  { value: "textiles", label: "Textiles" },
  { value: "electronics", label: "Electronics" },
  { value: "wood", label: "Wood" },
];

const sectors = [
  "Manufacturing",
  "Technology",
  "Agriculture",
  "Transportation",
  "Construction",
  "Retail",
  "Healthcare",
  "Hospitality",
];

const transportModes = [
  { value: "truck", label: "Road (Truck)" },
  { value: "rail", label: "Rail" },
  { value: "sea", label: "Sea (Ship)" },
  { value: "air_cargo", label: "Air (Cargo)" },
  { value: "pipeline", label: "Pipeline" },
];

interface OrganizationFormProps {
  formData: OrganizationInputs;
  onChange: (data: OrganizationInputs) => void;
}

export const OrganizationForm = ({ formData, onChange }: OrganizationFormProps) => {
  const updateField = <K extends keyof OrganizationInputs>(field: K, value: OrganizationInputs[K]) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Energy Section */}
      <div>
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          Energy & Operations
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="operationHours">Operation Hours (per year)</Label>
            <Input
              id="operationHours"
              type="number"
              placeholder="e.g., 2000"
              value={formData.operationHours || ""}
              onChange={(e) => updateField("operationHours", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="energyUsage">Energy Usage (kWh/hour)</Label>
            <Input
              id="energyUsage"
              type="number"
              placeholder="e.g., 150"
              value={formData.energyUsage || ""}
              onChange={(e) => updateField("energyUsage", parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Materials & Production Section */}
      <div>
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Factory className="w-5 h-5 text-primary" />
          Materials & Production
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="materialType">Primary Material Type</Label>
            <Select
              value={formData.materialType}
              onValueChange={(value) => updateField("materialType", value as OrganizationInputs["materialType"])}
            >
              <SelectTrigger id="materialType">
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {materialTypes.map((mat) => (
                  <SelectItem key={mat.value} value={mat.value}>
                    {mat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="materialWeight">Material Weight (kg/year)</Label>
            <Input
              id="materialWeight"
              type="number"
              placeholder="e.g., 5000"
              value={formData.materialWeight || ""}
              onChange={(e) => updateField("materialWeight", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sector">Business Sector</Label>
            <Select
              value={formData.sector}
              onValueChange={(value) => updateField("sector", value)}
            >
              <SelectTrigger id="sector">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sec) => (
                  <SelectItem key={sec} value={sec}>
                    {sec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="productionOutput">Production Output (units/year)</Label>
            <Input
              id="productionOutput"
              type="number"
              placeholder="e.g., 10000"
              value={formData.productionOutput || ""}
              onChange={(e) => updateField("productionOutput", parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Transportation Section */}
      <div>
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-primary" />
          Logistics & Transportation
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transportDistance">Annual Transport Distance (km)</Label>
            <Input
              id="transportDistance"
              type="number"
              placeholder="e.g., 50000"
              value={formData.transportDistance || ""}
              onChange={(e) => updateField("transportDistance", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transportMode">Primary Transport Mode</Label>
            <Select
              value={formData.transportMode}
              onValueChange={(value) => updateField("transportMode", value as OrganizationInputs["transportMode"])}
            >
              <SelectTrigger id="transportMode">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {transportModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
