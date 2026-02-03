export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      esg_reports: {
        Row: {
          anti_corruption_policy: boolean | null
          board_diversity_percentage: number | null
          board_size: number | null
          climate_risk_level: string | null
          community_initiatives: string | null
          compliance_violations: number | null
          country: string
          created_at: string
          data_privacy_incidents: number | null
          electronic_waste: number | null
          environmental_narrative: string | null
          environmental_score: number | null
          executive_summary: string | null
          gender_diversity_percentage: number | null
          governance_narrative: string | null
          governance_score: number | null
          hazardous_waste: number | null
          health_safety_incidents: number | null
          id: string
          independent_directors_percentage: number | null
          industry: string
          key_risks: string | null
          organization_name: string
          overall_esg_score: number | null
          recommendations: string | null
          renewable_energy_percentage: number | null
          reporting_framework: string
          reporting_year: number
          risk_category: string | null
          scope1_emissions: number | null
          scope2_emissions: number | null
          scope3_emissions: number | null
          social_narrative: string | null
          social_score: number | null
          status: string | null
          supply_chain_labour_policy: boolean | null
          tax_transparency: boolean | null
          total_emissions: number | null
          total_employees: number | null
          training_hours_per_employee: number | null
          updated_at: string
          water_consumption: number | null
          water_stress_area: boolean | null
          whistleblower_policy: boolean | null
        }
        Insert: {
          anti_corruption_policy?: boolean | null
          board_diversity_percentage?: number | null
          board_size?: number | null
          climate_risk_level?: string | null
          community_initiatives?: string | null
          compliance_violations?: number | null
          country: string
          created_at?: string
          data_privacy_incidents?: number | null
          electronic_waste?: number | null
          environmental_narrative?: string | null
          environmental_score?: number | null
          executive_summary?: string | null
          gender_diversity_percentage?: number | null
          governance_narrative?: string | null
          governance_score?: number | null
          hazardous_waste?: number | null
          health_safety_incidents?: number | null
          id?: string
          independent_directors_percentage?: number | null
          industry: string
          key_risks?: string | null
          organization_name: string
          overall_esg_score?: number | null
          recommendations?: string | null
          renewable_energy_percentage?: number | null
          reporting_framework?: string
          reporting_year: number
          risk_category?: string | null
          scope1_emissions?: number | null
          scope2_emissions?: number | null
          scope3_emissions?: number | null
          social_narrative?: string | null
          social_score?: number | null
          status?: string | null
          supply_chain_labour_policy?: boolean | null
          tax_transparency?: boolean | null
          total_emissions?: number | null
          total_employees?: number | null
          training_hours_per_employee?: number | null
          updated_at?: string
          water_consumption?: number | null
          water_stress_area?: boolean | null
          whistleblower_policy?: boolean | null
        }
        Update: {
          anti_corruption_policy?: boolean | null
          board_diversity_percentage?: number | null
          board_size?: number | null
          climate_risk_level?: string | null
          community_initiatives?: string | null
          compliance_violations?: number | null
          country?: string
          created_at?: string
          data_privacy_incidents?: number | null
          electronic_waste?: number | null
          environmental_narrative?: string | null
          environmental_score?: number | null
          executive_summary?: string | null
          gender_diversity_percentage?: number | null
          governance_narrative?: string | null
          governance_score?: number | null
          hazardous_waste?: number | null
          health_safety_incidents?: number | null
          id?: string
          independent_directors_percentage?: number | null
          industry?: string
          key_risks?: string | null
          organization_name?: string
          overall_esg_score?: number | null
          recommendations?: string | null
          renewable_energy_percentage?: number | null
          reporting_framework?: string
          reporting_year?: number
          risk_category?: string | null
          scope1_emissions?: number | null
          scope2_emissions?: number | null
          scope3_emissions?: number | null
          social_narrative?: string | null
          social_score?: number | null
          status?: string | null
          supply_chain_labour_policy?: boolean | null
          tax_transparency?: boolean | null
          total_emissions?: number | null
          total_employees?: number | null
          training_hours_per_employee?: number | null
          updated_at?: string
          water_consumption?: number | null
          water_stress_area?: boolean | null
          whistleblower_policy?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
