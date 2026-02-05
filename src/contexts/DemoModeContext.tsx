import { createContext, useContext, useState, ReactNode } from "react";

export type DemoRole = "buyer" | "seller";

export interface RetirementRequest {
  id: string;
  projectName: string;
  tonnes: number;
  buyerName: string;
  status: "pending" | "proof_uploaded" | "verified";
  proofUrl?: string;
  createdAt: Date;
  countdown?: number;
}

interface DemoModeContextType {
  isDemoMode: boolean;
  setIsDemoMode: (value: boolean) => void;
  demoRole: DemoRole;
  setDemoRole: (role: DemoRole) => void;
  retirementRequests: RetirementRequest[];
  addRetirementRequest: (request: Omit<RetirementRequest, "id" | "createdAt" | "status">) => void;
  uploadProof: (requestId: string, proofUrl: string) => void;
  verifyRequest: (requestId: string) => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoRole, setDemoRole] = useState<DemoRole>("buyer");
  const [retirementRequests, setRetirementRequests] = useState<RetirementRequest[]>([]);

  const addRetirementRequest = (request: Omit<RetirementRequest, "id" | "createdAt" | "status">) => {
    const newRequest: RetirementRequest = {
      ...request,
      id: crypto.randomUUID(),
      status: "pending",
      createdAt: new Date(),
      countdown: 300 // 5 minutes countdown
    };
    setRetirementRequests(prev => [...prev, newRequest]);
  };

  const uploadProof = (requestId: string, proofUrl: string) => {
    setRetirementRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? { ...req, status: "proof_uploaded", proofUrl }
          : req
      )
    );
  };

  const verifyRequest = (requestId: string) => {
    setRetirementRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? { ...req, status: "verified" }
          : req
      )
    );
  };

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        setIsDemoMode,
        demoRole,
        setDemoRole,
        retirementRequests,
        addRetirementRequest,
        uploadProof,
        verifyRequest
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error("useDemoMode must be used within a DemoModeProvider");
  }
  return context;
};
