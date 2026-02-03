// ESG Scoring Logic - Deterministic, rule-based scoring (NO AI)

export interface EnvironmentalInputs {
  scope1Emissions: number;
  scope2Emissions: number;
  scope3Emissions: number;
  renewableEnergyPercentage: number;
  waterConsumption: number;
  waterStressArea: boolean;
  hazardousWaste: number;
  electronicWaste: number;
  climateRiskLevel: 'low' | 'medium' | 'high';
}

export interface SocialInputs {
  totalEmployees: number;
  genderDiversityPercentage: number;
  trainingHoursPerEmployee: number;
  healthSafetyIncidents: number;
  supplyChainLabourPolicy: boolean;
  dataPrivacyIncidents: number;
  communityInitiatives: string;
}

export interface GovernanceInputs {
  boardSize: number;
  independentDirectorsPercentage: number;
  boardDiversityPercentage: number;
  antiCorruptionPolicy: boolean;
  whistleblowerPolicy: boolean;
  complianceViolations: number;
  taxTransparency: boolean;
}

export interface ESGScores {
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  overallScore: number;
  riskCategory: 'Low Risk' | 'Medium Risk' | 'Severe Risk';
}

// Calculate Environmental Score (0-10)
export function calculateEnvironmentalScore(inputs: EnvironmentalInputs): number {
  let score = 10;
  
  // Total emissions impact (higher emissions = lower score)
  const totalEmissions = inputs.scope1Emissions + inputs.scope2Emissions + inputs.scope3Emissions;
  if (totalEmissions > 100000) score -= 3;
  else if (totalEmissions > 50000) score -= 2;
  else if (totalEmissions > 10000) score -= 1;
  
  // Renewable energy (higher = better)
  if (inputs.renewableEnergyPercentage >= 80) score += 0;
  else if (inputs.renewableEnergyPercentage >= 50) score -= 0.5;
  else if (inputs.renewableEnergyPercentage >= 20) score -= 1;
  else score -= 2;
  
  // Water consumption in stress area
  if (inputs.waterStressArea && inputs.waterConsumption > 10000) score -= 1.5;
  else if (inputs.waterStressArea) score -= 0.5;
  
  // Waste management
  if (inputs.hazardousWaste > 1000) score -= 1;
  if (inputs.electronicWaste > 500) score -= 0.5;
  
  // Climate risk
  if (inputs.climateRiskLevel === 'high') score -= 2;
  else if (inputs.climateRiskLevel === 'medium') score -= 1;
  
  return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
}

// Calculate Social Score (0-10)
export function calculateSocialScore(inputs: SocialInputs): number {
  let score = 10;
  
  // Gender diversity (ideal is 40-60%)
  if (inputs.genderDiversityPercentage >= 40 && inputs.genderDiversityPercentage <= 60) {
    score += 0;
  } else if (inputs.genderDiversityPercentage >= 30 || inputs.genderDiversityPercentage <= 70) {
    score -= 0.5;
  } else {
    score -= 1.5;
  }
  
  // Training hours (higher = better)
  if (inputs.trainingHoursPerEmployee >= 40) score += 0;
  else if (inputs.trainingHoursPerEmployee >= 20) score -= 0.5;
  else if (inputs.trainingHoursPerEmployee >= 10) score -= 1;
  else score -= 2;
  
  // Health & safety incidents (lower = better)
  if (inputs.healthSafetyIncidents === 0) score += 0;
  else if (inputs.healthSafetyIncidents <= 5) score -= 1;
  else if (inputs.healthSafetyIncidents <= 10) score -= 2;
  else score -= 3;
  
  // Supply chain policy
  if (!inputs.supplyChainLabourPolicy) score -= 1;
  
  // Data privacy incidents
  if (inputs.dataPrivacyIncidents > 0) score -= inputs.dataPrivacyIncidents * 0.5;
  
  // Community initiatives
  if (inputs.communityInitiatives && inputs.communityInitiatives.length > 50) score += 0.5;
  
  return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
}

// Calculate Governance Score (0-10)
export function calculateGovernanceScore(inputs: GovernanceInputs): number {
  let score = 10;
  
  // Board size (ideal 7-15 members)
  if (inputs.boardSize >= 7 && inputs.boardSize <= 15) score += 0;
  else if (inputs.boardSize >= 5) score -= 0.5;
  else score -= 1.5;
  
  // Independent directors (higher = better)
  if (inputs.independentDirectorsPercentage >= 50) score += 0;
  else if (inputs.independentDirectorsPercentage >= 30) score -= 1;
  else score -= 2;
  
  // Board diversity
  if (inputs.boardDiversityPercentage >= 30) score += 0;
  else if (inputs.boardDiversityPercentage >= 20) score -= 0.5;
  else score -= 1.5;
  
  // Policies
  if (!inputs.antiCorruptionPolicy) score -= 2;
  if (!inputs.whistleblowerPolicy) score -= 1.5;
  if (!inputs.taxTransparency) score -= 1;
  
  // Compliance violations
  if (inputs.complianceViolations === 0) score += 0;
  else if (inputs.complianceViolations <= 2) score -= 1;
  else if (inputs.complianceViolations <= 5) score -= 2;
  else score -= 3;
  
  return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
}

// Calculate Overall ESG Score and Risk Category
export function calculateESGScores(
  environmental: EnvironmentalInputs,
  social: SocialInputs,
  governance: GovernanceInputs
): ESGScores {
  const environmentalScore = calculateEnvironmentalScore(environmental);
  const socialScore = calculateSocialScore(social);
  const governanceScore = calculateGovernanceScore(governance);
  
  // Weighted average (E: 35%, S: 30%, G: 35%)
  const overallScore = Math.round((environmentalScore * 0.35 + socialScore * 0.30 + governanceScore * 0.35) * 10) / 10;
  
  // Determine risk category
  let riskCategory: 'Low Risk' | 'Medium Risk' | 'Severe Risk';
  if (overallScore >= 7) {
    riskCategory = 'Low Risk';
  } else if (overallScore >= 4) {
    riskCategory = 'Medium Risk';
  } else {
    riskCategory = 'Severe Risk';
  }
  
  return {
    environmentalScore,
    socialScore,
    governanceScore,
    overallScore,
    riskCategory
  };
}

// Industry list for dropdown
export const INDUSTRIES = [
  'Energy & Utilities',
  'Financial Services',
  'Healthcare & Pharmaceuticals',
  'Information Technology',
  'Manufacturing',
  'Mining & Materials',
  'Oil & Gas',
  'Real Estate',
  'Retail & Consumer Goods',
  'Telecommunications',
  'Transportation & Logistics',
  'Agriculture & Food',
  'Construction',
  'Education',
  'Other'
];

// Reporting frameworks
export const REPORTING_FRAMEWORKS = [
  'General ESG',
  'GRI (Global Reporting Initiative)',
  'BRSR (Business Responsibility & Sustainability Reporting)',
  'ESRS (European Sustainability Reporting Standards)',
  'TCFD (Task Force on Climate-related Financial Disclosures)',
  'SASB (Sustainability Accounting Standards Board)'
];

// Countries list (top 50 by GDP)
export const COUNTRIES = [
  'United States', 'China', 'Japan', 'Germany', 'United Kingdom',
  'India', 'France', 'Italy', 'Brazil', 'Canada',
  'Russia', 'South Korea', 'Australia', 'Spain', 'Mexico',
  'Indonesia', 'Netherlands', 'Saudi Arabia', 'Turkey', 'Switzerland',
  'Poland', 'Taiwan', 'Belgium', 'Sweden', 'Argentina',
  'Norway', 'Austria', 'United Arab Emirates', 'Nigeria', 'Ireland',
  'Israel', 'South Africa', 'Thailand', 'Singapore', 'Malaysia',
  'Philippines', 'Denmark', 'Colombia', 'Pakistan', 'Chile',
  'Finland', 'Egypt', 'Vietnam', 'Bangladesh', 'Portugal',
  'Czech Republic', 'Romania', 'New Zealand', 'Greece', 'Other'
];
