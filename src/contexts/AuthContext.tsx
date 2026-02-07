import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface MongoUser {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: "buyer" | "seller";
  avatar_url: string;
  created_at: string;
}

interface AuthContextType {
  user: MongoUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: "buyer" | "seller";
  }) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "green_earth_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MongoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as MongoUser;
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Login failed" };
      }

      const mongoUser: MongoUser = data.user;
      setUser(mongoUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mongoUser));
      return {};
    } catch (err: any) {
      return { error: "Network error. Please try again." };
    }
  };

  const signUp = async (params: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: "buyer" | "seller";
  }): Promise<{ error?: string; needsConfirmation?: boolean }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Registration failed" };
      }

      const mongoUser: MongoUser = data.user;
      setUser(mongoUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mongoUser));
      return {};
    } catch (err: any) {
      return { error: "Network error. Please try again." };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
