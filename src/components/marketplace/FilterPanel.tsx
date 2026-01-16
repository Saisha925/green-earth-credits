import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const countries = ["Brazil", "Indonesia", "Kenya", "Colombia", "Vietnam", "Peru"];
const categories = ["Reforestation", "Avoided Deforestation", "Blue Carbon", "Renewable Energy", "Clean Cookstoves"];
const registries = ["Verra", "Gold Standard", "American Carbon Registry", "Climate Action Reserve"];
const sdgs = ["No Poverty", "Zero Hunger", "Good Health", "Quality Education", "Gender Equality", "Clean Water", "Clean Energy", "Decent Work", "Industry Innovation", "Reduced Inequalities", "Sustainable Cities", "Responsible Consumption", "Climate Action", "Life Below Water", "Life on Land", "Peace Justice", "Partnerships"];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-medium hover:text-primary transition-colors">
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4 space-y-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

interface FilterPanelProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export const FilterPanel = ({ onClose, isMobile }: FilterPanelProps) => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [vintageRange, setVintageRange] = useState([2015, 2024]);

  return (
    <div className={`${isMobile ? "" : "glass-card rounded-2xl p-6"} space-y-2`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Filters</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {!isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            Clear All
          </Button>
        </div>
      )}

      {/* Price Range */}
      <FilterSection title="Price per Tonne">
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={100}
            step={1}
            className="mt-2"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </FilterSection>

      {/* Country */}
      <FilterSection title="Country">
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {countries.map((country) => (
            <div key={country} className="flex items-center gap-2">
              <Checkbox id={`country-${country}`} />
              <Label htmlFor={`country-${country}`} className="text-sm cursor-pointer">
                {country}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox id={`cat-${cat}`} />
              <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Vintage */}
      <FilterSection title="Vintage Year">
        <div className="space-y-4">
          <Slider
            value={vintageRange}
            onValueChange={setVintageRange}
            min={2010}
            max={2024}
            step={1}
            className="mt-2"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{vintageRange[0]}</span>
            <span>{vintageRange[1]}</span>
          </div>
        </div>
      </FilterSection>

      {/* Registry */}
      <FilterSection title="Registry" defaultOpen={false}>
        <div className="space-y-2">
          {registries.map((registry) => (
            <div key={registry} className="flex items-center gap-2">
              <Checkbox id={`registry-${registry}`} />
              <Label htmlFor={`registry-${registry}`} className="text-sm cursor-pointer">
                {registry}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* SDGs */}
      <FilterSection title="UN SDGs" defaultOpen={false}>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {sdgs.map((sdg, index) => (
            <div key={sdg} className="flex items-center gap-2">
              <Checkbox id={`sdg-${index}`} />
              <Label htmlFor={`sdg-${index}`} className="text-sm cursor-pointer">
                {index + 1}. {sdg}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Direct Listings Toggle */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Checkbox id="direct" />
          <Label htmlFor="direct" className="text-sm cursor-pointer">
            Direct listings only
          </Label>
        </div>
      </div>

      {isMobile && (
        <div className="pt-4">
          <Button className="w-full gradient-primary text-primary-foreground" onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
};
