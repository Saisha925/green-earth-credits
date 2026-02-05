import { useDemoMode } from "@/contexts/DemoModeContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Store } from "lucide-react";

export const DemoModeToggle = () => {
  const { isDemoMode, setIsDemoMode, demoRole, setDemoRole } = useDemoMode();

  return (
    <div className="flex items-center gap-4 px-4 py-2 glass-card rounded-lg">
      <div className="flex items-center gap-2">
        <Switch
          id="demo-mode"
          checked={isDemoMode}
          onCheckedChange={setIsDemoMode}
        />
        <Label htmlFor="demo-mode" className="text-sm font-medium cursor-pointer">
          Demo Mode
        </Label>
      </div>
      
      {isDemoMode && (
        <div className="flex items-center gap-3 border-l border-border pl-4">
          <span className="text-xs text-muted-foreground">Role:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setDemoRole("buyer")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                demoRole === "buyer"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Buyer
            </button>
            <button
              onClick={() => setDemoRole("seller")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                demoRole === "seller"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Seller
            </button>
          </div>
        </div>
      )}
      
      {isDemoMode && (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-accent text-accent-foreground">
          Hackathon Only
        </span>
      )}
    </div>
  );
};
