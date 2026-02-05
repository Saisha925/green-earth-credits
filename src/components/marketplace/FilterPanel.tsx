import { useState, useEffect } from "react";
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

export interface FilterState {
  priceRange: [number, number];
  vintageRange: [number, number];
  selectedCountries: string[];
  selectedCategories: string[];
  selectedRegistries: string[];
  directListingsOnly: boolean;
}

interface FilterPanelProps {
  onClose?: () => void;
  isMobile?: boolean;
  filters?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
}

export const FilterPanel = ({ onClose, isMobile, filters, onFilterChange }: FilterPanelProps) => {
  const [priceRange, setPriceRange] = useState(filters?.priceRange || [0, 100]);
  const [vintageRange, setVintageRange] = useState(filters?.vintageRange || [2015, 2024]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(filters?.selectedCountries || []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters?.selectedCategories || []);
  const [selectedRegistries, setSelectedRegistries] = useState<string[]>(filters?.selectedRegistries || []);
  const [directListingsOnly, setDirectListingsOnly] = useState(filters?.directListingsOnly || false);

  // Update parent when filters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        priceRange: priceRange as [number, number],
        vintageRange: vintageRange as [number, number],
        selectedCountries,
        selectedCategories,
        selectedRegistries,
        directListingsOnly
      });
    }
  }, [priceRange, vintageRange, selectedCountries, selectedCategories, selectedRegistries, directListingsOnly, onFilterChange]);

  const handleCountryChange = (country: string, checked: boolean) => {
    if (checked) {
      setSelectedCountries([...selectedCountries, country]);
    } else {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleRegistryChange = (registry: string, checked: boolean) => {
    if (checked) {
      setSelectedRegistries([...selectedRegistries, registry]);
    } else {
      setSelectedRegistries(selectedRegistries.filter(r => r !== registry));
    }
  };

  const handleClearAll = () => {
    setPriceRange([0, 100]);
    setVintageRange([2015, 2024]);
    setSelectedCountries([]);
    setSelectedCategories([]);
    setSelectedRegistries([]);
    setDirectListingsOnly(false);
  };

  const hasActiveFilters = 
    priceRange[0] !== 0 || 
    priceRange[1] !== 100 ||
    vintageRange[0] !== 2015 ||
    vintageRange[1] !== 2024 ||
    selectedCountries.length > 0 ||
    selectedCategories.length > 0 ||
    selectedRegistries.length > 0 ||
    directListingsOnly;

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
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground"
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Price Range */}
      <FilterSection title="Price per Tonne">
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
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
              <Checkbox 
                id={`country-${country}`}
                checked={selectedCountries.includes(country)}
                onCheckedChange={(checked) => handleCountryChange(country, checked === true)}
              />
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
              <Checkbox 
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={(checked) => handleCategoryChange(cat, checked === true)}
              />
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
            onValueChange={(v) => setVintageRange(v as [number, number])}
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
              <Checkbox 
                id={`registry-${registry}`}
                checked={selectedRegistries.includes(registry)}
                onCheckedChange={(checked) => handleRegistryChange(registry, checked === true)}
              />
              <Label htmlFor={`registry-${registry}`} className="text-sm cursor-pointer">
                {registry}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Direct Listings Toggle */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Checkbox 
            id="direct"
            checked={directListingsOnly}
            onCheckedChange={(checked) => setDirectListingsOnly(checked === true)}
          />
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
