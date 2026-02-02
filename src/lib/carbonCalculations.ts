// Emission factors (kg CO2 per unit)
export const emissionFactors = {
  // Energy
  electricity: 0.42, // kg CO2 per kWh (global average)
  
  // Transport (kg CO2 per km)
  transport: {
    car_petrol: 0.21,
    car_diesel: 0.19,
    public_transport: 0.089,
    two_wheeler: 0.08,
    electric_vehicle: 0.05,
    truck: 0.15,
    rail: 0.041,
    sea: 0.016,
    air_cargo: 0.5,
    pipeline: 0.005,
  },
  
  // Diet (annual kg CO2)
  diet: {
    vegan: 1500,
    vegetarian: 1700,
    mixed: 2500,
  },
  
  // Flights (kg CO2 per flight)
  flights: {
    short_haul: 255, // <3 hours
    medium_haul: 510, // 3-6 hours
    long_haul: 1020, // >6 hours
  },
  
  // Materials (kg CO2 per kg)
  materials: {
    steel: 1.85,
    aluminum: 11.5,
    plastic: 6.0,
    paper: 1.09,
    glass: 0.85,
    textiles: 15.0,
    electronics: 20.0,
    wood: 0.72,
  },
};

export interface IndividualInputs {
  electricityUsage: number; // kWh/month
  commuteDistance: number; // km/day
  transportMode: keyof typeof emissionFactors.transport;
  dietType: keyof typeof emissionFactors.diet;
  shortHaulFlights: number;
  mediumHaulFlights: number;
  longHaulFlights: number;
}

export interface OrganizationInputs {
  operationHours: number;
  energyUsage: number; // kWh/hour
  materialType: keyof typeof emissionFactors.materials;
  materialWeight: number; // kg
  sector: string;
  productionOutput: number;
  transportDistance: number; // km
  transportMode: keyof typeof emissionFactors.transport;
}

export interface EmissionBreakdown {
  name: string;
  value: number;
  percentage: number;
}

export interface CalculationResult {
  totalEmissions: number; // tonnes CO2
  breakdown: EmissionBreakdown[];
  dominantSector: 'energy' | 'transport' | 'lifestyle' | 'material';
  suggestedCredits: number;
  treeEquivalent: number;
}

export function calculateIndividualEmissions(inputs: IndividualInputs): CalculationResult {
  // Energy emissions (annual)
  const energyEmissions = inputs.electricityUsage * 12 * emissionFactors.electricity;
  
  // Transport emissions (annual, assuming 250 working days)
  const transportRate = emissionFactors.transport[inputs.transportMode] || 0.21;
  const transportEmissions = inputs.commuteDistance * 2 * 250 * transportRate;
  
  // Diet emissions
  const dietEmissions = emissionFactors.diet[inputs.dietType] || 2500;
  
  // Flight emissions
  const flightEmissions = 
    (inputs.shortHaulFlights * emissionFactors.flights.short_haul) +
    (inputs.mediumHaulFlights * emissionFactors.flights.medium_haul) +
    (inputs.longHaulFlights * emissionFactors.flights.long_haul);
  
  // Total lifestyle = diet + flights
  const lifestyleEmissions = dietEmissions + flightEmissions;
  
  const totalKg = energyEmissions + transportEmissions + lifestyleEmissions;
  const totalTonnes = totalKg / 1000;
  
  const breakdown: EmissionBreakdown[] = [
    { name: 'Energy', value: Math.round(energyEmissions) / 1000, percentage: (energyEmissions / totalKg) * 100 },
    { name: 'Transport', value: Math.round(transportEmissions) / 1000, percentage: (transportEmissions / totalKg) * 100 },
    { name: 'Lifestyle', value: Math.round(lifestyleEmissions) / 1000, percentage: (lifestyleEmissions / totalKg) * 100 },
  ];
  
  // Determine dominant sector
  const maxEmission = Math.max(energyEmissions, transportEmissions, lifestyleEmissions);
  let dominantSector: 'energy' | 'transport' | 'lifestyle' = 'lifestyle';
  if (maxEmission === energyEmissions) dominantSector = 'energy';
  else if (maxEmission === transportEmissions) dominantSector = 'transport';
  
  return {
    totalEmissions: Math.round(totalTonnes * 100) / 100,
    breakdown,
    dominantSector,
    suggestedCredits: Math.ceil(totalTonnes),
    treeEquivalent: Math.round(totalTonnes * 45), // ~45 trees per tonne
  };
}

export function calculateOrganizationEmissions(inputs: OrganizationInputs): CalculationResult {
  // Energy emissions
  const energyEmissions = inputs.operationHours * inputs.energyUsage * emissionFactors.electricity;
  
  // Material emissions
  const materialRate = emissionFactors.materials[inputs.materialType] || 1.0;
  const materialEmissions = inputs.materialWeight * materialRate;
  
  // Transport emissions
  const transportRate = emissionFactors.transport[inputs.transportMode] || 0.15;
  const transportEmissions = inputs.transportDistance * transportRate;
  
  // Production emissions (simplified)
  const productionEmissions = inputs.productionOutput * 0.5; // 0.5 kg per unit
  
  const totalKg = energyEmissions + materialEmissions + transportEmissions + productionEmissions;
  const totalTonnes = totalKg / 1000;
  
  const breakdown: EmissionBreakdown[] = [
    { name: 'Energy', value: Math.round(energyEmissions) / 1000, percentage: (energyEmissions / totalKg) * 100 },
    { name: 'Materials', value: Math.round(materialEmissions) / 1000, percentage: (materialEmissions / totalKg) * 100 },
    { name: 'Transport', value: Math.round(transportEmissions) / 1000, percentage: (transportEmissions / totalKg) * 100 },
    { name: 'Production', value: Math.round(productionEmissions) / 1000, percentage: (productionEmissions / totalKg) * 100 },
  ];
  
  // Determine dominant sector
  const emissions = { energy: energyEmissions, material: materialEmissions, transport: transportEmissions };
  const maxKey = Object.entries(emissions).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  
  return {
    totalEmissions: Math.round(totalTonnes * 100) / 100,
    breakdown,
    dominantSector: maxKey as 'energy' | 'transport' | 'material',
    suggestedCredits: Math.ceil(totalTonnes),
    treeEquivalent: Math.round(totalTonnes * 45),
  };
}

// Project matching for recommendations
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  pricePerTonne: number;
  country: string;
  category: string;
  vintage: number;
  verified: boolean;
}

export interface ProjectRecommendation extends Project {
  suggestedTonnes: number;
  reason: string;
  matchScore: number;
}

export function getProjectRecommendations(
  projects: Project[],
  totalEmissions: number,
  dominantSector: string,
  userCountry?: string
): ProjectRecommendation[] {
  // Category mapping based on emission sector
  const sectorToCategory: Record<string, string[]> = {
    energy: ['Renewable Energy'],
    transport: ['Reforestation', 'Avoided Deforestation'],
    lifestyle: ['Blue Carbon', 'Reforestation', 'Clean Cookstoves'],
    material: ['Clean Cookstoves', 'Avoided Deforestation'],
  };
  
  const preferredCategories = sectorToCategory[dominantSector] || ['Reforestation'];
  
  // Score and rank projects
  const scoredProjects = projects.map(project => {
    let score = 0;
    let reasons: string[] = [];
    
    // Category match (highest weight)
    if (preferredCategories.includes(project.category)) {
      score += 50;
      reasons.push(`Addresses your ${dominantSector} emissions`);
    }
    
    // Geographic preference
    if (userCountry && project.country === userCountry) {
      score += 20;
      reasons.push('Located in your region');
    }
    
    // Budget sensitivity
    if (totalEmissions < 10 && project.pricePerTonne < 15) {
      score += 15;
      reasons.push('Budget-friendly option');
    } else if (totalEmissions >= 10 && project.pricePerTonne <= 20) {
      score += 15;
      reasons.push('Good value for bulk offset');
    }
    
    // Verified bonus
    if (project.verified) {
      score += 10;
      reasons.push('Verified by international standards');
    }
    
    // Recent vintage bonus
    if (project.vintage >= 2023) {
      score += 5;
    }
    
    const suggestedTonnes = Math.min(Math.ceil(totalEmissions / 3), Math.ceil(totalEmissions));
    
    return {
      ...project,
      matchScore: score,
      suggestedTonnes,
      reason: reasons[0] || 'High-impact climate project',
    };
  });
  
  // Sort by score and return top 3
  return scoredProjects
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}
