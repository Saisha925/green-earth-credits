-- Create ESG reports table with all inputs, scores, and AI narrative
CREATE TABLE public.esg_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Report Context
  organization_name TEXT NOT NULL,
  reporting_year INTEGER NOT NULL,
  industry TEXT NOT NULL,
  country TEXT NOT NULL,
  reporting_framework TEXT NOT NULL DEFAULT 'General ESG',
  
  -- Environmental Inputs
  scope1_emissions NUMERIC,
  scope2_emissions NUMERIC,
  scope3_emissions NUMERIC,
  total_emissions NUMERIC,
  renewable_energy_percentage NUMERIC,
  water_consumption NUMERIC,
  water_stress_area BOOLEAN DEFAULT false,
  hazardous_waste NUMERIC,
  electronic_waste NUMERIC,
  climate_risk_level TEXT DEFAULT 'low',
  
  -- Social Inputs
  total_employees INTEGER,
  gender_diversity_percentage NUMERIC,
  training_hours_per_employee NUMERIC,
  health_safety_incidents INTEGER,
  supply_chain_labour_policy BOOLEAN DEFAULT false,
  data_privacy_incidents INTEGER,
  community_initiatives TEXT,
  
  -- Governance Inputs
  board_size INTEGER,
  independent_directors_percentage NUMERIC,
  board_diversity_percentage NUMERIC,
  anti_corruption_policy BOOLEAN DEFAULT false,
  whistleblower_policy BOOLEAN DEFAULT false,
  compliance_violations INTEGER,
  tax_transparency BOOLEAN DEFAULT false,
  
  -- Calculated Scores (0-10)
  environmental_score NUMERIC,
  social_score NUMERIC,
  governance_score NUMERIC,
  overall_esg_score NUMERIC,
  risk_category TEXT,
  
  -- AI Generated Narratives
  executive_summary TEXT,
  environmental_narrative TEXT,
  social_narrative TEXT,
  governance_narrative TEXT,
  key_risks TEXT,
  recommendations TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft'
);

-- Enable Row Level Security (public access for demo/hackathon purposes)
ALTER TABLE public.esg_reports ENABLE ROW LEVEL SECURITY;

-- Create policy for public read/write access (hackathon demo)
CREATE POLICY "Allow public access to ESG reports" 
ON public.esg_reports 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_esg_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_esg_reports_updated_at
BEFORE UPDATE ON public.esg_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_esg_reports_updated_at();