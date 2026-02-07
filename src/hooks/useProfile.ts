import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export type AppRole = "buyer" | "seller";

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setRole(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/auth/profile?userId=${user.id}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setProfile(data.profile as UserProfile);
        setRole(data.role as AppRole);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Pick<UserProfile, "full_name" | "email" | "phone">>) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...updates }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setProfile(data.profile as UserProfile);
        return { data: data.profile, error: null };
      }

      return { data: null, error: new Error(data.error || "Update failed") };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  return { profile, role, isLoading, updateProfile, refetchProfile: fetchProfile };
};
