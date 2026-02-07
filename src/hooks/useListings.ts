import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CreditListing {
  id: string;
  seller_id: string;
  project_name: string;
  description: string;
  category: string;
  registry: string;
  credits: number;
  vintage_year: number;
  price_per_tonne: number;
  latitude: number | null;
  longitude: number | null;
  country: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useSellerListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<CreditListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = async () => {
    if (!user) {
      setListings([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("credit_listings")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setListings(data as CreditListing[]);
    }
    if (error) {
      console.error("Error fetching listings:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchListings();

    // Subscribe to realtime changes
    if (!user) return;

    const channel = supabase
      .channel("seller-listings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "credit_listings",
          filter: `seller_id=eq.${user.id}`,
        },
        () => {
          // Refetch on any change
          fetchListings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addListing = async (listing: Omit<CreditListing, "id" | "seller_id" | "status" | "created_at" | "updated_at">) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("credit_listings")
      .insert({
        ...listing,
        seller_id: user.id,
      })
      .select()
      .single();

    return { data, error };
  };

  return { listings, isLoading, addListing, refetchListings: fetchListings };
};

export const useRetirementRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) {
        setRecords([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("retirement_records")
        .select("*")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setRecords(data);
      if (error) console.error("Error fetching retirement records:", error);
      setIsLoading(false);
    };

    fetchRecords();
  }, [user]);

  return { records, isLoading };
};
