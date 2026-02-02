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
import { Zap, Car, Utensils, Plane } from "lucide-react";
import { IndividualInputs } from "@/lib/carbonCalculations";

const transportModes = [
  { value: "car_petrol", label: "Car (Petrol)" },
  { value: "car_diesel", label: "Car (Diesel)" },
  { value: "public_transport", label: "Public Transport" },
  { value: "two_wheeler", label: "Two-wheeler" },
  { value: "electric_vehicle", label: "Electric Vehicle" },
];

const dietTypes = [
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "mixed", label: "Mixed (includes meat)" },
];

interface IndividualFormProps {
  formData: IndividualInputs;
  onChange: (data: IndividualInputs) => void;
}

export const IndividualForm = ({ formData, onChange }: IndividualFormProps) => {
  const updateField = <K extends keyof IndividualInputs>(field: K, value: IndividualInputs[K]) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Energy Section */}
      <div>
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          Energy Consumption
        </h2>
        <div className="space-y-2">
          <Label htmlFor="electricityUsage">Monthly Electricity Usage (kWh)</Label>
          <Input
            id="electricityUsage"
            type="number"
            placeholder="e.g., 300"
            value={formData.electricityUsage || ""}
            onChange={(e) => updateField("electricityUsage", parseFloat(e.target.value) || 0)}
          />
          <p className="text-xs text-muted-foreground">Average household uses 250-400 kWh/month</p>
        </div>
      </div>

      <Separator />

      {/* Transport Section */}
      <div>
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Car className="w-5 h-5 text-primary" />
          Daily Commute
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="commuteDistance">Daily Commute Distance (km)</Label>
            <Input
              id="commuteDistance"
              type="number"
              placeholder="e.g., 20"
              value={formData.commuteDistance || ""}
              onChange={(e) => updateField("commuteDistance", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transportMode">Primary Transport Mode</Label>
            <Select
              value={formData.transportMode}
              onValueChange={(value) => updateField("transportMode", value as IndividualInputs["transportMode"])}
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

      <Separator />

      {/* Lifestyle Section */}
      <div>
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Utensils className="w-5 h-5 text-primary" />
          Lifestyle
        </h2>
        <div className="space-y-2">
          <Label htmlFor="dietType">Diet Type</Label>
          <Select
            value={formData.dietType}
            onValueChange={(value) => updateField("dietType", value as IndividualInputs["dietType"])}
          >
            <SelectTrigger id="dietType">
              <SelectValue placeholder="Select diet" />
            </SelectTrigger>
            <SelectContent>
              {dietTypes.map((diet) => (
                <SelectItem key={diet.value} value={diet.value}>
                  {diet.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Flights Section */}
      <div>
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Plane className="w-5 h-5 text-primary" />
          Annual Flights
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shortHaulFlights">Short-haul (&lt;3 hrs)</Label>
            <Input
              id="shortHaulFlights"
              type="number"
              min="0"
              placeholder="0"
              value={formData.shortHaulFlights || ""}
              onChange={(e) => updateField("shortHaulFlights", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mediumHaulFlights">Medium-haul (3-6 hrs)</Label>
            <Input
              id="mediumHaulFlights"
              type="number"
              min="0"
              placeholder="0"
              value={formData.mediumHaulFlights || ""}
              onChange={(e) => updateField("mediumHaulFlights", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longHaulFlights">Long-haul (&gt;6 hrs)</Label>
            <Input
              id="longHaulFlights"
              type="number"
              min="0"
              placeholder="0"
              value={formData.longHaulFlights || ""}
              onChange={(e) => updateField("longHaulFlights", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
