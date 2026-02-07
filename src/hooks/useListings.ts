import { useState, useEffect, useCallback } from "react";
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

  const fetchListings = useCallback(async () => {
    if (!user) {
      setListings([]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/seller-listings?sellerId=${user.id}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setListings(data.listings as CreditListing[]);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const addListing = async (
    listing: Omit<CreditListing, "id" | "seller_id" | "status" | "created_at" | "updated_at">
  ) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const res = await fetch("/api/seller-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: user.id,
          projectName: listing.project_name,
          description: listing.description,
          category: listing.category,
          registry: listing.registry,
          credits: listing.credits,
          vintageYear: listing.vintage_year,
          pricePerTonne: listing.price_per_tonne,
          latitude: listing.latitude,
          longitude: listing.longitude,
          country: listing.country,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Refetch after adding
        await fetchListings();
        return { data: data.listing, error: null };
      }

      return { data: null, error: new Error(data.error || "Failed to add listing") };
    } catch (error: any) {
      return { data: null, error };
    }
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

      try {
        const res = await fetch(`/api/retirement-records?buyerId=${user.id}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setRecords(data.records);
        }
      } catch (error) {
        console.error("Error fetching retirement records:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  return { records, isLoading };
};
