import { User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  mode: 'individual' | 'organization';
  onModeChange: (mode: 'individual' | 'organization') => void;
}

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <p className="text-sm text-muted-foreground mb-4">Calculate footprint for:</p>
      <div className="flex gap-4">
        <button
          onClick={() => onModeChange('individual')}
          className={cn(
            "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 min-w-[140px]",
            mode === 'individual'
              ? "border-primary bg-primary/10 glow-green-subtle"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
            mode === 'individual' ? "gradient-primary" : "bg-muted"
          )}>
            <User className={cn(
              "w-7 h-7",
              mode === 'individual' ? "text-primary-foreground" : "text-muted-foreground"
            )} />
          </div>
          <span className={cn(
            "font-semibold",
            mode === 'individual' ? "text-primary" : "text-muted-foreground"
          )}>
            Individual
          </span>
        </button>
        
        <button
          onClick={() => onModeChange('organization')}
          className={cn(
            "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 min-w-[140px]",
            mode === 'organization'
              ? "border-primary bg-primary/10 glow-green-subtle"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
            mode === 'organization' ? "gradient-primary" : "bg-muted"
          )}>
            <Building2 className={cn(
              "w-7 h-7",
              mode === 'organization' ? "text-primary-foreground" : "text-muted-foreground"
            )} />
          </div>
          <span className={cn(
            "font-semibold",
            mode === 'organization' ? "text-primary" : "text-muted-foreground"
          )}>
            Organization
          </span>
        </button>
      </div>
    </div>
  );
};
