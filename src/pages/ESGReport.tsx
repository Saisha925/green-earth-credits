import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ESGContextForm } from "@/components/esg/ESGContextForm";
import { ESGInputTabs } from "@/components/esg/ESGInputTabs";
import { ESGDashboard } from "@/components/esg/ESGDashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  calculateESGScores, 
  EnvironmentalInputs, 
  SocialInputs, 
  GovernanceInputs,
  ESGScores 
} from "@/lib/esgScoring";

export interface ReportContext {
  organizationName: string;
  reportingYear: number;
  industry: string;
  country: string;
  reportingFramework: string;
}

export interface ESGNarratives {
  executive_summary: string;
  environmental_narrative: string;
  social_narrative: string;
  governance_narrative: string;
  key_risks: string;
  recommendations: string;
}

const ESGReport = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'context' | 'inputs' | 'report'>('context');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  
  // Form data
  const [context, setContext] = useState<ReportContext>({
    organizationName: '',
    reportingYear: new Date().getFullYear(),
    industry: '',
    country: '',
    reportingFramework: 'General ESG'
  });
  
  const [environmental, setEnvironmental] = useState<EnvironmentalInputs>({
    scope1Emissions: 0,
    scope2Emissions: 0,
    scope3Emissions: 0,
    renewableEnergyPercentage: 0,
    waterConsumption: 0,
    waterStressArea: false,
    hazardousWaste: 0,
    electronicWaste: 0,
    climateRiskLevel: 'low'
  });
  
  const [social, setSocial] = useState<SocialInputs>({
    totalEmployees: 0,
    genderDiversityPercentage: 50,
    trainingHoursPerEmployee: 0,
    healthSafetyIncidents: 0,
    supplyChainLabourPolicy: false,
    dataPrivacyIncidents: 0,
    communityInitiatives: ''
  });
  
  const [governance, setGovernance] = useState<GovernanceInputs>({
    boardSize: 0,
    independentDirectorsPercentage: 0,
    boardDiversityPercentage: 0,
    antiCorruptionPolicy: false,
    whistleblowerPolicy: false,
    complianceViolations: 0,
    taxTransparency: false
  });
  
  const [scores, setScores] = useState<ESGScores | null>(null);
  const [narratives, setNarratives] = useState<ESGNarratives | null>(null);

  const handleContextSubmit = (data: ReportContext) => {
    setContext(data);
    setStep('inputs');
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Step 1: Calculate scores deterministically (NO AI)
      const calculatedScores = calculateESGScores(environmental, social, governance);
      setScores(calculatedScores);
      
      const totalEmissions = environmental.scope1Emissions + environmental.scope2Emissions + environmental.scope3Emissions;
      
      // Step 2: Save to database
      const { data: report, error: dbError } = await supabase
        .from('esg_reports')
        .insert({
          organization_name: context.organizationName,
          reporting_year: context.reportingYear,
          industry: context.industry,
          country: context.country,
          reporting_framework: context.reportingFramework,
          scope1_emissions: environmental.scope1Emissions,
          scope2_emissions: environmental.scope2Emissions,
          scope3_emissions: environmental.scope3Emissions,
          total_emissions: totalEmissions,
          renewable_energy_percentage: environmental.renewableEnergyPercentage,
          water_consumption: environmental.waterConsumption,
          water_stress_area: environmental.waterStressArea,
          hazardous_waste: environmental.hazardousWaste,
          electronic_waste: environmental.electronicWaste,
          climate_risk_level: environmental.climateRiskLevel,
          total_employees: social.totalEmployees,
          gender_diversity_percentage: social.genderDiversityPercentage,
          training_hours_per_employee: social.trainingHoursPerEmployee,
          health_safety_incidents: social.healthSafetyIncidents,
          supply_chain_labour_policy: social.supplyChainLabourPolicy,
          data_privacy_incidents: social.dataPrivacyIncidents,
          community_initiatives: social.communityInitiatives,
          board_size: governance.boardSize,
          independent_directors_percentage: governance.independentDirectorsPercentage,
          board_diversity_percentage: governance.boardDiversityPercentage,
          anti_corruption_policy: governance.antiCorruptionPolicy,
          whistleblower_policy: governance.whistleblowerPolicy,
          compliance_violations: governance.complianceViolations,
          tax_transparency: governance.taxTransparency,
          environmental_score: calculatedScores.environmentalScore,
          social_score: calculatedScores.socialScore,
          governance_score: calculatedScores.governanceScore,
          overall_esg_score: calculatedScores.overallScore,
          risk_category: calculatedScores.riskCategory,
          status: 'processing'
        })
        .select()
        .single();
      
      if (dbError) throw dbError;
      setReportId(report.id);
      
      // Step 3: Generate AI narratives
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-esg-summary', {
        body: {
          organizationName: context.organizationName,
          reportingYear: context.reportingYear,
          industry: context.industry,
          country: context.country,
          reportingFramework: context.reportingFramework,
          environmentalScore: calculatedScores.environmentalScore,
          socialScore: calculatedScores.socialScore,
          governanceScore: calculatedScores.governanceScore,
          overallScore: calculatedScores.overallScore,
          riskCategory: calculatedScores.riskCategory,
          totalEmissions,
          renewableEnergyPercentage: environmental.renewableEnergyPercentage,
          genderDiversityPercentage: social.genderDiversityPercentage,
          totalEmployees: social.totalEmployees,
          independentDirectorsPercentage: governance.independentDirectorsPercentage,
          complianceViolations: governance.complianceViolations
        }
      });
      
      if (aiError) {
        console.error('AI generation error:', aiError);
        toast({
          title: "AI Narrative Generation Failed",
          description: "Report generated with scores only. AI narratives unavailable.",
          variant: "destructive"
        });
      } else {
        setNarratives(aiData);
        
        // Update report with narratives
        await supabase
          .from('esg_reports')
          .update({
            executive_summary: aiData.executive_summary,
            environmental_narrative: aiData.environmental_narrative,
            social_narrative: aiData.social_narrative,
            governance_narrative: aiData.governance_narrative,
            key_risks: aiData.key_risks,
            recommendations: aiData.recommendations,
            status: 'complete'
          })
          .eq('id', report.id);
      }
      
      setStep('report');
      toast({
        title: "ESG Report Generated",
        description: "Your sustainability report is ready to view and download."
      });
      
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: "Error Generating Report",
        description: error instanceof Error ? error.message : "Failed to generate ESG report",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold">ESG Report Generator</h1>
                <p className="text-muted-foreground">
                  Generate comprehensive sustainability reports with AI-powered insights
                </p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-4 mt-6">
              {['Context', 'ESG Data', 'Report'].map((label, index) => {
                const stepNames = ['context', 'inputs', 'report'] as const;
                const currentIndex = stepNames.indexOf(step);
                const isActive = index === currentIndex;
                const isComplete = index < currentIndex;
                
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isActive ? 'gradient-primary text-primary-foreground' :
                      isComplete ? 'bg-primary/20 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {isComplete ? '✓' : index + 1}
                    </div>
                    <span className={`text-sm ${isActive ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {label}
                    </span>
                    {index < 2 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Step Content */}
          {step === 'context' && (
            <ESGContextForm 
              initialData={context}
              onSubmit={handleContextSubmit}
            />
          )}
          
          {step === 'inputs' && (
            <div className="space-y-6">
              <ESGInputTabs
                environmental={environmental}
                social={social}
                governance={governance}
                onEnvironmentalChange={setEnvironmental}
                onSocialChange={setSocial}
                onGovernanceChange={setGovernance}
              />
              
              <div className="flex items-center justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('context')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Context
                </Button>
                <Button 
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="gradient-primary text-primary-foreground btn-glow"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      Generate ESG Report
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {step === 'report' && scores && (
            <ESGDashboard
              context={context}
              environmental={environmental}
              social={social}
              governance={governance}
              scores={scores}
              narratives={narratives}
              reportId={reportId}
              onBack={() => setStep('inputs')}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ESGReport;
