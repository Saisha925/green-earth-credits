import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Calculator as CalculatorIcon, Leaf, TreePine, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CalculationResult } from "@/lib/carbonCalculations";

const COLORS = ["#0B5D3B", "#1DBF73", "#10B981", "#34D399"];

interface ResultsPanelProps {
  result: CalculationResult | null;
  mode: 'individual' | 'organization';
}

export const ResultsPanel = ({ result, mode }: ResultsPanelProps) => {
  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <CalculatorIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          Enter your data and click calculate to see your carbon footprint.
        </p>
      </div>
    );
  }

  const chartData = result.breakdown.map(item => ({
    ...item,
    value: Math.round(item.value * 100) / 100,
  }));

  // Get top 2 contributors
  const sortedBreakdown = [...result.breakdown].sort((a, b) => b.value - a.value);
  const topContributors = sortedBreakdown.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Total Emissions */}
      <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/20 glow-green-subtle">
        <p className="text-sm text-muted-foreground mb-2">Total Carbon Footprint</p>
        <p className="text-5xl font-bold text-gradient">{result.totalEmissions}</p>
        <p className="text-lg text-muted-foreground">tonnes CO₂e / year</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <TreePine className="w-4 h-4 text-primary" />
          <span>Equivalent to planting <strong className="text-foreground">{result.treeEquivalent}</strong> trees</span>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((_, index) => (
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

      {/* Breakdown Bars */}
      <div className="space-y-3">
        {result.breakdown.map((item, index) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">{item.value.toFixed(2)} t ({item.percentage.toFixed(0)}%)</span>
            </div>
            <Progress 
              value={item.percentage} 
              className="h-2"
              style={{ 
                ['--progress-background' as string]: COLORS[index % COLORS.length]
              }}
            />
          </div>
        ))}
      </div>

      {/* Key Drivers */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-primary" />
          <span className="font-medium">Key Emission Drivers</span>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {topContributors.map((item, index) => (
            <li key={item.name} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <span>
                <strong className="text-foreground">{item.name}</strong> accounts for {item.percentage.toFixed(0)}% of your emissions
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Offset Progress */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
        <div className="flex items-center gap-3 mb-3">
          <Leaf className="w-5 h-5 text-primary" />
          <span className="font-medium">Path to Carbon Neutrality</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          To offset 100% of your emissions, you need to retire{" "}
          <span className="font-bold text-foreground">{result.suggestedCredits} carbon credits</span>.
        </p>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full w-0" />
          </div>
          <span className="text-muted-foreground">0%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Purchase credits below to start your offset journey
        </p>
      </div>
    </div>
  );
};
