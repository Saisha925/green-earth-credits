import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Leaf, 
  Users, 
  Building, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { ReportContext, ESGNarratives } from "@/pages/ESGReport";
import { EnvironmentalInputs, SocialInputs, GovernanceInputs, ESGScores } from "@/lib/esgScoring";
import { ESGPDFGenerator } from "./ESGPDFGenerator";

interface ESGDashboardProps {
  context: ReportContext;
  environmental: EnvironmentalInputs;
  social: SocialInputs;
  governance: GovernanceInputs;
  scores: ESGScores;
  narratives: ESGNarratives | null;
  reportId: string | null;
  onBack: () => void;
}

const PILLAR_COLORS = {
  environmental: '#10B981',
  social: '#3B82F6',
  governance: '#8B5CF6'
};

export const ESGDashboard = ({
  context,
  environmental,
  social,
  governance,
  scores,
  narratives,
  reportId,
  onBack
}: ESGDashboardProps) => {
  const [showPDF, setShowPDF] = useState(false);
  
  const totalEmissions = environmental.scope1Emissions + environmental.scope2Emissions + environmental.scope3Emissions;
  
  const pillarData = [
    { name: 'Environmental', score: scores.environmentalScore, color: PILLAR_COLORS.environmental },
    { name: 'Social', score: scores.socialScore, color: PILLAR_COLORS.social },
    { name: 'Governance', score: scores.governanceScore, color: PILLAR_COLORS.governance },
  ];
  
  const emissionsData = [
    { name: 'Scope 1', value: environmental.scope1Emissions },
    { name: 'Scope 2', value: environmental.scope2Emissions },
    { name: 'Scope 3', value: environmental.scope3Emissions },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low Risk': return 'text-green-500 bg-green-500/10';
      case 'Medium Risk': return 'text-yellow-500 bg-yellow-500/10';
      case 'Severe Risk': return 'text-red-500 bg-red-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-500';
    if (score >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Edit Data
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowPDF(true)}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Report Header */}
      <div className="glass-card rounded-2xl p-6 glow-green-subtle">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Sustainability Report</p>
            <h1 className="text-2xl font-bold">{context.organizationName}</h1>
            <p className="text-muted-foreground">
              {context.industry} | {context.country} | FY {context.reportingYear}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Framework</p>
            <p className="font-medium">{context.reportingFramework}</p>
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="glass-card rounded-2xl p-6 md:col-span-1">
          <p className="text-sm text-muted-foreground mb-2">Overall ESG Score</p>
          <div className="flex items-end gap-2">
            <span className={`text-5xl font-bold ${getScoreColor(scores.overallScore)}`}>
              {scores.overallScore}
            </span>
            <span className="text-xl text-muted-foreground mb-1">/ 10</span>
          </div>
          <div className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(scores.riskCategory)}`}>
            {scores.riskCategory === 'Low Risk' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {scores.riskCategory}
          </div>
        </div>

        {/* Pillar Scores */}
        {pillarData.map((pillar) => {
          const Icon = pillar.name === 'Environmental' ? Leaf : pillar.name === 'Social' ? Users : Building;
          return (
            <div key={pillar.name} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${pillar.color}20` }}>
                  <Icon className="w-4 h-4" style={{ color: pillar.color }} />
                </div>
                <p className="text-sm text-muted-foreground">{pillar.name}</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold" style={{ color: pillar.color }}>
                  {pillar.score}
                </span>
                <span className="text-sm text-muted-foreground mb-1">/ 10</span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all" 
                  style={{ 
                    width: `${pillar.score * 10}%`,
                    backgroundColor: pillar.color 
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ESG Pillar Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-4">ESG Pillar Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pillarData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="score"
                  nameKey="name"
                >
                  {pillarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}/10`, 'Score']}
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
        </div>

        {/* Emissions Breakdown */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Carbon Emissions Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emissionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} t CO₂e`, 'Emissions']}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/30 text-center">
            <p className="text-sm text-muted-foreground">Total Emissions</p>
            <p className="text-xl font-bold text-primary">{totalEmissions.toLocaleString()} t CO₂e</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Renewable Energy</p>
          <p className="text-2xl font-bold text-primary">{environmental.renewableEnergyPercentage}%</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Employees</p>
          <p className="text-2xl font-bold text-primary">{social.totalEmployees.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Gender Diversity</p>
          <p className="text-2xl font-bold text-primary">{social.genderDiversityPercentage}%</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Independent Directors</p>
          <p className="text-2xl font-bold text-primary">{governance.independentDirectorsPercentage}%</p>
        </div>
      </div>

      {/* AI Narratives */}
      {narratives && (
        <Tabs defaultValue="summary" className="glass-card rounded-2xl p-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-1">
            <TabsTrigger value="summary" className="text-xs sm:text-sm">Summary</TabsTrigger>
            <TabsTrigger value="environmental" className="text-xs sm:text-sm">Environment</TabsTrigger>
            <TabsTrigger value="social" className="text-xs sm:text-sm">Social</TabsTrigger>
            <TabsTrigger value="governance" className="text-xs sm:text-sm">Governance</TabsTrigger>
            <TabsTrigger value="risks" className="text-xs sm:text-sm">Risks</TabsTrigger>
            <TabsTrigger value="recommendations" className="text-xs sm:text-sm">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Executive Summary</h3>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{narratives.executive_summary}</p>
            </div>
          </TabsContent>

          <TabsContent value="environmental" className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Environmental Performance</h3>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{narratives.environmental_narrative}</p>
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Social Performance</h3>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{narratives.social_narrative}</p>
            </div>
          </TabsContent>

          <TabsContent value="governance" className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">Governance Performance</h3>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{narratives.governance_narrative}</p>
            </div>
          </TabsContent>

          <TabsContent value="risks" className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold">Key ESG Risks</h3>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{narratives.key_risks}</p>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Recommendations</h3>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{narratives.recommendations}</p>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border">
        <p className="text-xs text-muted-foreground text-center">
          <strong>Disclaimer:</strong> This ESG report is generated using user-provided data and automated analysis. 
          It does not constitute official certification or regulatory filing.
        </p>
      </div>

      {/* PDF Generator Modal */}
      {showPDF && (
        <ESGPDFGenerator
          context={context}
          environmental={environmental}
          social={social}
          governance={governance}
          scores={scores}
          narratives={narratives}
          onClose={() => setShowPDF(false)}
        />
      )}
    </div>
  );
};
