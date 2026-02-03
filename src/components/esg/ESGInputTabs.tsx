import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Leaf, Users, Building } from "lucide-react";
import { EnvironmentalInputs, SocialInputs, GovernanceInputs } from "@/lib/esgScoring";

interface ESGInputTabsProps {
  environmental: EnvironmentalInputs;
  social: SocialInputs;
  governance: GovernanceInputs;
  onEnvironmentalChange: (data: EnvironmentalInputs) => void;
  onSocialChange: (data: SocialInputs) => void;
  onGovernanceChange: (data: GovernanceInputs) => void;
}

export const ESGInputTabs = ({
  environmental,
  social,
  governance,
  onEnvironmentalChange,
  onSocialChange,
  onGovernanceChange,
}: ESGInputTabsProps) => {
  const totalEmissions = environmental.scope1Emissions + environmental.scope2Emissions + environmental.scope3Emissions;

  return (
    <Tabs defaultValue="environmental" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-14 mb-6">
        <TabsTrigger value="environmental" className="flex items-center gap-2 h-12">
          <Leaf className="w-4 h-4" />
          <span className="hidden sm:inline">Environmental</span>
          <span className="sm:hidden">E</span>
        </TabsTrigger>
        <TabsTrigger value="social" className="flex items-center gap-2 h-12">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Social</span>
          <span className="sm:hidden">S</span>
        </TabsTrigger>
        <TabsTrigger value="governance" className="flex items-center gap-2 h-12">
          <Building className="w-4 h-4" />
          <span className="hidden sm:inline">Governance</span>
          <span className="sm:hidden">G</span>
        </TabsTrigger>
      </TabsList>

      {/* Environmental Tab */}
      <TabsContent value="environmental">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Environmental Data</h3>
              <p className="text-sm text-muted-foreground">Carbon emissions, energy, water, and waste metrics</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Emissions */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Carbon Emissions (tonnes CO₂e)</h4>
              
              <div className="space-y-2">
                <Label htmlFor="scope1">Scope 1 (Direct Emissions)</Label>
                <Input
                  id="scope1"
                  type="number"
                  min={0}
                  value={environmental.scope1Emissions || ''}
                  onChange={(e) => onEnvironmentalChange({
                    ...environmental,
                    scope1Emissions: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope2">Scope 2 (Indirect - Energy)</Label>
                <Input
                  id="scope2"
                  type="number"
                  min={0}
                  value={environmental.scope2Emissions || ''}
                  onChange={(e) => onEnvironmentalChange({
                    ...environmental,
                    scope2Emissions: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope3">Scope 3 (Value Chain)</Label>
                <Input
                  id="scope3"
                  type="number"
                  min={0}
                  value={environmental.scope3Emissions || ''}
                  onChange={(e) => onEnvironmentalChange({
                    ...environmental,
                    scope3Emissions: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Total Emissions</p>
                <p className="text-2xl font-bold text-primary">{totalEmissions.toLocaleString()} t CO₂e</p>
              </div>
            </div>

            {/* Energy & Resources */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Energy & Resources</h4>
              
              <div className="space-y-2">
                <Label htmlFor="renewable">Renewable Energy (%)</Label>
                <Input
                  id="renewable"
                  type="number"
                  min={0}
                  max={100}
                  value={environmental.renewableEnergyPercentage || ''}
                  onChange={(e) => onEnvironmentalChange({
                    ...environmental,
                    renewableEnergyPercentage: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="water">Water Consumption (m³)</Label>
                <Input
                  id="water"
                  type="number"
                  min={0}
                  value={environmental.waterConsumption || ''}
                  onChange={(e) => onEnvironmentalChange({
                    ...environmental,
                    waterConsumption: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="waterStress">Located in Water Stress Area</Label>
                <Switch
                  id="waterStress"
                  checked={environmental.waterStressArea}
                  onCheckedChange={(checked) => onEnvironmentalChange({
                    ...environmental,
                    waterStressArea: checked
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hazardous">Hazardous Waste (tonnes)</Label>
                <Input
                  id="hazardous"
                  type="number"
                  min={0}
                  value={environmental.hazardousWaste || ''}
                  onChange={(e) => onEnvironmentalChange({
                    ...environmental,
                    hazardousWaste: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ewaste">Electronic Waste (tonnes)</Label>
                <Input
                  id="ewaste"
                  type="number"
                  min={0}
                  value={environmental.electronicWaste || ''}
                  onChange={(e) => onEnvironmentalChange({
                    ...environmental,
                    electronicWaste: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="climateRisk">Climate Risk Level</Label>
                <Select 
                  value={environmental.climateRiskLevel}
                  onValueChange={(value: 'low' | 'medium' | 'high') => onEnvironmentalChange({
                    ...environmental,
                    climateRiskLevel: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Social Tab */}
      <TabsContent value="social">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Social Data</h3>
              <p className="text-sm text-muted-foreground">Workforce, diversity, health & safety, and community</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Workforce */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Workforce</h4>
              
              <div className="space-y-2">
                <Label htmlFor="employees">Total Employees</Label>
                <Input
                  id="employees"
                  type="number"
                  min={0}
                  value={social.totalEmployees || ''}
                  onChange={(e) => onSocialChange({
                    ...social,
                    totalEmployees: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diversity">Gender Diversity (% Female)</Label>
                <Input
                  id="diversity"
                  type="number"
                  min={0}
                  max={100}
                  value={social.genderDiversityPercentage || ''}
                  onChange={(e) => onSocialChange({
                    ...social,
                    genderDiversityPercentage: Number(e.target.value) || 0
                  })}
                  placeholder="50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="training">Training Hours per Employee</Label>
                <Input
                  id="training"
                  type="number"
                  min={0}
                  value={social.trainingHoursPerEmployee || ''}
                  onChange={(e) => onSocialChange({
                    ...social,
                    trainingHoursPerEmployee: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="safety">Health & Safety Incidents</Label>
                <Input
                  id="safety"
                  type="number"
                  min={0}
                  value={social.healthSafetyIncidents || ''}
                  onChange={(e) => onSocialChange({
                    ...social,
                    healthSafetyIncidents: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Policies & Community */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Policies & Community</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="supplyChain">Supply Chain Labour Policy</Label>
                <Switch
                  id="supplyChain"
                  checked={social.supplyChainLabourPolicy}
                  onCheckedChange={(checked) => onSocialChange({
                    ...social,
                    supplyChainLabourPolicy: checked
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="privacy">Data Privacy Incidents</Label>
                <Input
                  id="privacy"
                  type="number"
                  min={0}
                  value={social.dataPrivacyIncidents || ''}
                  onChange={(e) => onSocialChange({
                    ...social,
                    dataPrivacyIncidents: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="community">Community Initiatives</Label>
                <Textarea
                  id="community"
                  value={social.communityInitiatives}
                  onChange={(e) => onSocialChange({
                    ...social,
                    communityInitiatives: e.target.value
                  })}
                  placeholder="Describe community programs, charitable initiatives, and social impact projects..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Governance Tab */}
      <TabsContent value="governance">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Building className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Governance Data</h3>
              <p className="text-sm text-muted-foreground">Board structure, policies, and compliance</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Board Structure */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Board Structure</h4>
              
              <div className="space-y-2">
                <Label htmlFor="boardSize">Board Size (Members)</Label>
                <Input
                  id="boardSize"
                  type="number"
                  min={0}
                  value={governance.boardSize || ''}
                  onChange={(e) => onGovernanceChange({
                    ...governance,
                    boardSize: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="independent">Independent Directors (%)</Label>
                <Input
                  id="independent"
                  type="number"
                  min={0}
                  max={100}
                  value={governance.independentDirectorsPercentage || ''}
                  onChange={(e) => onGovernanceChange({
                    ...governance,
                    independentDirectorsPercentage: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="boardDiversity">Board Diversity (%)</Label>
                <Input
                  id="boardDiversity"
                  type="number"
                  min={0}
                  max={100}
                  value={governance.boardDiversityPercentage || ''}
                  onChange={(e) => onGovernanceChange({
                    ...governance,
                    boardDiversityPercentage: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="violations">Compliance Violations</Label>
                <Input
                  id="violations"
                  type="number"
                  min={0}
                  value={governance.complianceViolations || ''}
                  onChange={(e) => onGovernanceChange({
                    ...governance,
                    complianceViolations: Number(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Policies */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Policies</h4>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <Label htmlFor="anticorruption">Anti-Corruption Policy</Label>
                <Switch
                  id="anticorruption"
                  checked={governance.antiCorruptionPolicy}
                  onCheckedChange={(checked) => onGovernanceChange({
                    ...governance,
                    antiCorruptionPolicy: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <Label htmlFor="whistleblower">Whistleblower Policy</Label>
                <Switch
                  id="whistleblower"
                  checked={governance.whistleblowerPolicy}
                  onCheckedChange={(checked) => onGovernanceChange({
                    ...governance,
                    whistleblowerPolicy: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <Label htmlFor="taxTransparency">Tax Transparency</Label>
                <Switch
                  id="taxTransparency"
                  checked={governance.taxTransparency}
                  onCheckedChange={(checked) => onGovernanceChange({
                    ...governance,
                    taxTransparency: checked
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
