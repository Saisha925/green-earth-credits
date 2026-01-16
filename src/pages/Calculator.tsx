import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Calculator as CalculatorIcon, Zap, Factory, Truck, Leaf, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const materialTypes = [
  "Steel",
  "Aluminum",
  "Plastic",
  "Paper",
  "Glass",
  "Textiles",
  "Electronics",
  "Wood",
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
  "Road (Truck)",
  "Rail",
  "Sea (Ship)",
  "Air (Cargo)",
  "Pipeline",
];

const COLORS = ["#0B5D3B", "#1DBF73", "#10B981", "#34D399"];

const Calculator = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{
    total: number;
    breakdown: { name: string; value: number }[];
    suggestedCredits: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    operationHours: "",
    energyUsage: "",
    materialType: "",
    materialWeight: "",
    sector: "",
    productionOutput: "",
    transportDistance: "",
    transportMode: "",
  });

  const handleCalculate = async () => {
    setIsCalculating(true);

    // Simulate ML calculation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock result based on inputs
    const energyEmissions = (parseFloat(formData.energyUsage) || 0) * (parseFloat(formData.operationHours) || 0) * 0.0004;
    const materialEmissions = (parseFloat(formData.materialWeight) || 0) * 0.002;
    const transportEmissions = (parseFloat(formData.transportDistance) || 0) * 0.0001;
    const productionEmissions = (parseFloat(formData.productionOutput) || 0) * 0.001;

    const total = energyEmissions + materialEmissions + transportEmissions + productionEmissions;

    setResult({
      total: Math.round(total * 100) / 100,
      breakdown: [
        { name: "Energy", value: Math.round(energyEmissions * 100) / 100 },
        { name: "Materials", value: Math.round(materialEmissions * 100) / 100 },
        { name: "Transport", value: Math.round(transportEmissions * 100) / 100 },
        { name: "Production", value: Math.round(productionEmissions * 100) / 100 },
      ],
      suggestedCredits: Math.ceil(total),
    });

    setIsCalculating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 glow-green-subtle">
              <CalculatorIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl font-bold mb-4">Carbon Footprint Calculator</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Calculate your carbon footprint using our ML-powered model and discover
              how many credits you need to offset your emissions.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left: Inputs */}
            <div className="glass-card rounded-2xl p-8 space-y-6">
              <h2 className="font-semibold text-lg flex items-center gap-2">
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
                    value={formData.operationHours}
                    onChange={(e) => setFormData({ ...formData, operationHours: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="energyUsage">Energy Usage (kWh/hour)</Label>
                  <Input
                    id="energyUsage"
                    type="number"
                    placeholder="e.g., 150"
                    value={formData.energyUsage}
                    onChange={(e) => setFormData({ ...formData, energyUsage: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Factory className="w-5 h-5 text-primary" />
                Materials & Production
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="materialType">Material Type</Label>
                  <Select
                    value={formData.materialType}
                    onValueChange={(value) => setFormData({ ...formData, materialType: value })}
                  >
                    <SelectTrigger id="materialType">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialTypes.map((mat) => (
                        <SelectItem key={mat} value={mat}>{mat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materialWeight">Material Weight (kg)</Label>
                  <Input
                    id="materialWeight"
                    type="number"
                    placeholder="e.g., 5000"
                    value={formData.materialWeight}
                    onChange={(e) => setFormData({ ...formData, materialWeight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Business Sector</Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) => setFormData({ ...formData, sector: value })}
                  >
                    <SelectTrigger id="sector">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sec) => (
                        <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productionOutput">Production Output (units)</Label>
                  <Input
                    id="productionOutput"
                    type="number"
                    placeholder="e.g., 10000"
                    value={formData.productionOutput}
                    onChange={(e) => setFormData({ ...formData, productionOutput: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Transportation
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transportDistance">Distance (km)</Label>
                  <Input
                    id="transportDistance"
                    type="number"
                    placeholder="e.g., 1000"
                    value={formData.transportDistance}
                    onChange={(e) => setFormData({ ...formData, transportDistance: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transportMode">Transport Mode</Label>
                  <Select
                    value={formData.transportMode}
                    onValueChange={(value) => setFormData({ ...formData, transportMode: value })}
                  >
                    <SelectTrigger id="transportMode">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {transportModes.map((mode) => (
                        <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="w-full h-12 gradient-primary text-primary-foreground btn-glow font-semibold"
                onClick={handleCalculate}
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Calculating...
                  </span>
                ) : (
                  "Calculate Footprint"
                )}
              </Button>
            </div>

            {/* Right: Results */}
            <div className="glass-card rounded-2xl p-8 space-y-6">
              <h2 className="font-semibold text-lg">Results</h2>

              {result ? (
                <>
                  {/* Total */}
                  <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/20 glow-green-subtle">
                    <p className="text-sm text-muted-foreground mb-2">Total Carbon Footprint</p>
                    <p className="text-5xl font-bold text-gradient">{result.total}</p>
                    <p className="text-lg text-muted-foreground">tonnes CO₂e / year</p>
                  </div>

                  {/* Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={result.breakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {result.breakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${value} t CO₂e`, ""]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3">
                    {result.breakdown.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value} t</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Offset Suggestion */}
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Leaf className="w-5 h-5 text-primary" />
                      <span className="font-medium">Offset Recommendation</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      To become carbon neutral, you need to retire approximately{" "}
                      <span className="font-bold text-foreground">{result.suggestedCredits} credits</span>.
                    </p>
                    <Link to="/marketplace">
                      <Button className="w-full gradient-primary text-primary-foreground btn-glow">
                        Go to Marketplace
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <CalculatorIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Enter your data and click calculate to see your carbon footprint.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Calculator;
