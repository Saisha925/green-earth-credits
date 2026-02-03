import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ESGSummaryRequest {
  organizationName: string;
  reportingYear: number;
  industry: string;
  country: string;
  reportingFramework: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  overallScore: number;
  riskCategory: string;
  // Key metrics for context
  totalEmissions: number;
  renewableEnergyPercentage: number;
  genderDiversityPercentage: number;
  totalEmployees: number;
  independentDirectorsPercentage: number;
  complianceViolations: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ESGSummaryRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an ESG (Environmental, Social, and Governance) report analyst. Generate professional, investor-grade narrative sections for a sustainability report.

IMPORTANT RULES:
1. Use ONLY the provided scores and metrics - do NOT calculate or infer any numbers
2. Write in professional, clear language suitable for corporate reporting
3. Be specific and actionable in recommendations
4. Reference the industry and geography context where relevant
5. Keep each section focused and concise (2-3 paragraphs max)`;

    const userPrompt = `Generate ESG narrative sections for the following organization:

ORGANIZATION CONTEXT:
- Name: ${data.organizationName}
- Year: ${data.reportingYear}
- Industry: ${data.industry}
- Country: ${data.country}
- Framework: ${data.reportingFramework}

ESG SCORES (pre-calculated, 0-10 scale):
- Environmental Score: ${data.environmentalScore}/10
- Social Score: ${data.socialScore}/10
- Governance Score: ${data.governanceScore}/10
- Overall ESG Score: ${data.overallScore}/10
- Risk Category: ${data.riskCategory}

KEY METRICS:
- Total Carbon Emissions: ${data.totalEmissions} tonnes CO₂e
- Renewable Energy: ${data.renewableEnergyPercentage}%
- Gender Diversity: ${data.genderDiversityPercentage}%
- Total Employees: ${data.totalEmployees}
- Independent Board Directors: ${data.independentDirectorsPercentage}%
- Compliance Violations: ${data.complianceViolations}

Generate the following sections (use the exact JSON structure):`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_esg_narratives",
              description: "Generate professional ESG report narrative sections",
              parameters: {
                type: "object",
                properties: {
                  executive_summary: {
                    type: "string",
                    description: "A 2-3 paragraph executive summary of the ESG performance, highlighting key strengths and areas for improvement"
                  },
                  environmental_narrative: {
                    type: "string",
                    description: "Analysis of environmental performance including emissions, energy, and waste management"
                  },
                  social_narrative: {
                    type: "string",
                    description: "Analysis of social performance including workforce, diversity, and community impact"
                  },
                  governance_narrative: {
                    type: "string",
                    description: "Analysis of governance including board structure, policies, and compliance"
                  },
                  key_risks: {
                    type: "string",
                    description: "Top 3-5 ESG risks identified based on the data, formatted as a bulleted list"
                  },
                  recommendations: {
                    type: "string",
                    description: "Actionable recommendations for improving ESG performance, formatted as a numbered list"
                  }
                },
                required: ["executive_summary", "environmental_narrative", "social_narrative", "governance_narrative", "key_risks", "recommendations"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_esg_narratives" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    
    // Extract the tool call result
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "generate_esg_narratives") {
      throw new Error("Unexpected AI response format");
    }

    const narratives = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(narratives), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-esg-summary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
