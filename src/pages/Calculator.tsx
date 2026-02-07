import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calculator as CalculatorIcon } from "lucide-react";
import { ModeSelector } from "@/components/calculator/ModeSelector";
import { IndividualForm } from "@/components/calculator/IndividualForm";
import { OrganizationForm } from "@/components/calculator/OrganizationForm";
import { ResultsPanel } from "@/components/calculator/ResultsPanel";
import { ProjectRecommendations } from "@/components/calculator/ProjectRecommendations";
import { ReportGenerator } from "@/components/calculator/ReportGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import {
  IndividualInputs,
  OrganizationInputs,
  CalculationResult,
  ProjectRecommendation,
  calculateIndividualEmissions,
  calculateOrganizationEmissions,
  getProjectRecommendations,
} from "@/lib/carbonCalculations";

// Mock projects data for recommendations
const mockProjects = [
  {
    id: "1",
    title: "Amazon Rainforest Conservation Project",
    description: "Protecting 500,000 hectares of primary rainforest in the Amazon basin.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    pricePerTonne: 18.50,
    country: "Brazil",
    category: "Avoided Deforestation",
    vintage: 2023,
    verified: true,
  },
  {
    id: "2",
    title: "Mangrove Restoration Initiative",
    description: "Restoring coastal mangrove ecosystems across Southeast Asia.",
    image: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&h=400&fit=crop",
    pricePerTonne: 24.00,
    country: "Indonesia",
    category: "Blue Carbon",
    vintage: 2024,
    verified: true,
  },
  {
    id: "3",
    title: "Wind Farm Development - Kenya",
    description: "Large-scale wind energy project providing clean electricity.",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600&h=400&fit=crop",
    pricePerTonne: 12.75,
    country: "Kenya",
    category: "Renewable Energy",
    vintage: 2023,
    verified: true,
  },
  {
    id: "4",
    title: "Community Reforestation Colombia",
    description: "Planting 2 million native trees with local communities.",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&h=400&fit=crop",
    pricePerTonne: 15.25,
    country: "Colombia",
    category: "Reforestation",
    vintage: 2024,
    verified: true,
  },
  {
    id: "5",
    title: "Solar Energy Access Program",
    description: "Deploying distributed solar systems across rural Vietnam.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
    pricePerTonne: 10.50,
    country: "Vietnam",
    category: "Renewable Energy",
    vintage: 2023,
    verified: true,
  },
  {
    id: "6",
    title: "Clean Cookstoves Distribution",
    description: "Providing efficient cookstoves to 100,000 households.",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&h=400&fit=crop",
    pricePerTonne: 8.00,
    country: "Kenya",
    category: "Clean Cookstoves",
    vintage: 2024,
    verified: true,
  },
  {
    id: "7",
    title: "Peatland Restoration Borneo",
    description: "Rewetting and restoring degraded peatlands in Borneo.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
    pricePerTonne: 28.00,
    country: "Indonesia",
    category: "Avoided Deforestation",
    vintage: 2023,
    verified: true,
  },
  {
    id: "8",
    title: "Atlantic Forest Regeneration",
    description: "Regenerating native Atlantic Forest through sustainable agroforestry.",
    image: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=600&h=400&fit=crop",
    pricePerTonne: 20.00,
    country: "Brazil",
    category: "Reforestation",
    vintage: 2024,
    verified: true,
  },
  {
    id: "9",
    title: "Hydropower Expansion Peru",
    description: "Run-of-river hydropower project generating clean energy.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop",
    pricePerTonne: 14.50,
    country: "Peru",
    category: "Renewable Energy",
    vintage: 2023,
    verified: true,
  },
];

const Calculator = () => {
  const [mode, setMode] = useState<'individual' | 'organization'>('individual');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [recommendations, setRecommendations] = useState<ProjectRecommendation[]>([]);
  const [previousFootprints, setPreviousFootprints] = useState<any[]>([]);
  const { user } = useAuth();

  const [individualData, setIndividualData] = useState<IndividualInputs>({
    electricityUsage: 0,
    commuteDistance: 0,
    transportMode: 'car_petrol',
    dietType: 'mixed',
    shortHaulFlights: 0,
    mediumHaulFlights: 0,
    longHaulFlights: 0,
  });

  const [organizationData, setOrganizationData] = useState<OrganizationInputs>({
    operationHours: 0,
    energyUsage: 0,
    materialType: 'steel',
    materialWeight: 0,
    sector: '',
    productionOutput: 0,
    transportDistance: 0,
    transportMode: 'truck',
  });

  // Fetch previous footprints when component loads
  useEffect(() => {
    if (user) {
      fetchPreviousFootprints();
    }
  }, [user]);

  // Fetch previous footprints
  const fetchPreviousFootprints = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/footprint/get/${user.id}`);
      const data = await response.json();
      if (data.status === 'success' && data.data) {
        setPreviousFootprints([data.data]);
      }
    } catch (error) {
      console.error('Error fetching footprints:', error);
    }
  };

  const saveFootprintToDatabase = async (calcResult: CalculationResult) => {
    if (!user) return;

    try {
      await fetch('http://127.0.0.1:8000/footprint/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          footprint_data: {
            totalEmissions: calcResult.totalEmissions,
            breakdown: calcResult.breakdown,
            dominantSector: calcResult.dominantSector,
            suggestedCredits: calcResult.suggestedCredits,
            treeEquivalent: calcResult.treeEquivalent,
            mode: mode,
            inputs: mode === 'individual' ? individualData : organizationData,
          }
        })
      });
      // Refresh history after saving
      fetchPreviousFootprints();
    } catch (error) {
      console.error('Error saving footprint:', error);
    }
  };

  const handleModeChange = (newMode: 'individual' | 'organization') => {
    setMode(newMode);
    setResult(null);
    setRecommendations([]);
  };

  const handleCalculate = async () => {
    setIsCalculating(true);

    // Simulate calculation time
    await new Promise((resolve) => setTimeout(resolve, 1200));

    let calcResult: CalculationResult;

    if (mode === 'individual') {
      calcResult = calculateIndividualEmissions(individualData);
    } else {
      calcResult = calculateOrganizationEmissions(organizationData);
    }

    setResult(calcResult);

    // Get recommendations
    const recs = getProjectRecommendations(
      mockProjects,
      calcResult.totalEmissions,
      calcResult.dominantSector
    );
    setRecommendations(recs);

    // Auto-save to database
    await saveFootprintToDatabase(calcResult);

    setIsCalculating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 glow-green-subtle">
              <CalculatorIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl font-bold mb-4">Carbon Footprint Calculator</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Calculate your carbon footprint and discover personalized offset recommendations
              to start your journey to carbon neutrality.
            </p>
          </div>

          {/* Mode Selector */}
          <ModeSelector mode={mode} onModeChange={handleModeChange} />

          {/* Calculator Grid */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left: Input Form */}
            <div className="glass-card rounded-2xl p-8">
              {mode === 'individual' ? (
                <IndividualForm formData={individualData} onChange={setIndividualData} />
              ) : (
                <OrganizationForm formData={organizationData} onChange={setOrganizationData} />
              )}

              <Button
                className="w-full h-12 gradient-primary text-primary-foreground btn-glow font-semibold mt-6"
                onClick={handleCalculate}
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Calculating...
                  </span>
                ) : (
                  "Calculate My Footprint"
                )}
              </Button>
            </div>

            {/* Right: Results */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="font-semibold text-lg mb-4">Your Results</h2>
              <ResultsPanel result={result} mode={mode} />
              
              {result && user && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium text-center">
                    ✓ Footprint saved automatically and available in chatbot
                  </p>
                </div>
              )}
              
              {result && !user && (
                <p className="text-sm text-amber-600 mt-4 text-center">
                  Sign in to save your footprint for chatbot access
                </p>
              )}
            </div>
          </div>

          {/* Previous Calculations */}
          {user && previousFootprints.length > 0 && (
            <div className="max-w-6xl mx-auto mt-12">
              <div className="glass-card rounded-2xl p-8">
                <h2 className="font-semibold text-lg mb-6">📊 Previous Calculations</h2>
                <div className="space-y-4">
                  {previousFootprints.map((fp, idx) => (
                    <div key={idx} className="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-emerald-900">
                            {fp.mode === 'individual' ? '👤 Individual' : '🏢 Organization'} Footprint
                          </p>
                          <p className="text-2xl font-bold text-emerald-700 mt-2">
                            {fp.totalEmissions?.toFixed(2) || 0} tonnes CO₂
                          </p>
                          <p className="text-sm text-emerald-600 mt-1">
                            Dominant: {fp.dominantSector || 'N/A'} | Credits needed: {fp.suggestedCredits?.toFixed(0) || 0}
                          </p>
                          {fp.timestamp && (
                            <p className="text-xs text-gray-500 mt-2">
                              Saved: {new Date(fp.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                          onClick={() => {
                            // Load this calculation again
                            if (fp.mode === 'individual' && fp.inputs) {
                              setMode('individual');
                              setIndividualData(fp.inputs);
                            } else if (fp.inputs) {
                              setMode('organization');
                              setOrganizationData(fp.inputs);
                            }
                          }}
                        >
                          Load
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Report Generator */}
          {result && (
            <div className="max-w-6xl mx-auto">
              <ReportGenerator result={result} mode={mode} recommendations={recommendations} />
            </div>
          )}

          {/* Project Recommendations */}
          {result && recommendations.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <ProjectRecommendations
                recommendations={recommendations}
                totalEmissions={result.totalEmissions}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Calculator;
