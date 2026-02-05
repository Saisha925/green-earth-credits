import { useState, useMemo, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectCard } from "@/components/marketplace/ProjectCard";
import { FilterPanel, FilterState } from "@/components/marketplace/FilterPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Grid3X3, List, SlidersHorizontal } from "lucide-react";

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    title: "Amazon Rainforest Conservation Project",
    description: "Protecting 500,000 hectares of primary rainforest in the Amazon basin, preserving biodiversity and indigenous communities.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    pricePerTonne: 18.50,
    country: "Brazil",
    category: "Avoided Deforestation",
    vintage: 2023,
    verified: true,
    registry: "Verra",
  },
  {
    id: "2",
    title: "Mangrove Restoration Initiative",
    description: "Restoring coastal mangrove ecosystems across Southeast Asia, protecting coastlines and sequestering carbon.",
    image: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&h=400&fit=crop",
    pricePerTonne: 24.00,
    country: "Indonesia",
    category: "Blue Carbon",
    vintage: 2024,
    verified: true,
    registry: "Gold Standard",
  },
  {
    id: "3",
    title: "Wind Farm Development - Kenya",
    description: "Large-scale wind energy project providing clean electricity to over 1 million households in East Africa.",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600&h=400&fit=crop",
    pricePerTonne: 12.75,
    country: "Kenya",
    category: "Renewable Energy",
    vintage: 2023,
    verified: true,
    registry: "Verra",
  },
  {
    id: "4",
    title: "Community Reforestation Colombia",
    description: "Planting 2 million native trees with local communities in the Colombian Andes, creating sustainable livelihoods.",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&h=400&fit=crop",
    pricePerTonne: 15.25,
    country: "Colombia",
    category: "Reforestation",
    vintage: 2024,
    verified: true,
    registry: "Gold Standard",
  },
  {
    id: "5",
    title: "Solar Energy Access Program",
    description: "Deploying distributed solar systems across rural Vietnam, replacing diesel generators and kerosene lamps.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
    pricePerTonne: 10.50,
    country: "Vietnam",
    category: "Renewable Energy",
    vintage: 2023,
    verified: true,
    registry: "American Carbon Registry",
  },
  {
    id: "6",
    title: "Clean Cookstoves Distribution",
    description: "Providing efficient cookstoves to 100,000 households, reducing deforestation and indoor air pollution.",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&h=400&fit=crop",
    pricePerTonne: 8.00,
    country: "Kenya",
    category: "Clean Cookstoves",
    vintage: 2024,
    verified: true,
    registry: "Gold Standard",
  },
  {
    id: "7",
    title: "Peatland Restoration Borneo",
    description: "Rewetting and restoring degraded peatlands in Borneo to prevent fires and massive carbon emissions.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
    pricePerTonne: 28.00,
    country: "Indonesia",
    category: "Avoided Deforestation",
    vintage: 2023,
    verified: true,
    registry: "Verra",
  },
  {
    id: "8",
    title: "Atlantic Forest Regeneration",
    description: "Regenerating native Atlantic Forest through sustainable agroforestry with local farming communities.",
    image: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=600&h=400&fit=crop",
    pricePerTonne: 20.00,
    country: "Brazil",
    category: "Reforestation",
    vintage: 2024,
    verified: true,
    registry: "Climate Action Reserve",
  },
  {
    id: "9",
    title: "Hydropower Expansion Peru",
    description: "Run-of-river hydropower project generating clean energy for remote Peruvian communities.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop",
    pricePerTonne: 14.50,
    country: "Peru",
    category: "Renewable Energy",
    vintage: 2023,
    verified: true,
    registry: "Verra",
  },
];

const defaultFilters: FilterState = {
  priceRange: [0, 100],
  vintageRange: [2015, 2024],
  selectedCountries: [],
  selectedCategories: [],
  selectedRegistries: [],
  directListingsOnly: false
};

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const filteredProjects = useMemo(() => {
    let projects = mockProjects.filter((project) => {
      // Search query filter
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Price range filter
      if (project.pricePerTonne < filters.priceRange[0] || project.pricePerTonne > filters.priceRange[1]) {
        return false;
      }

      // Vintage range filter
      if (project.vintage < filters.vintageRange[0] || project.vintage > filters.vintageRange[1]) {
        return false;
      }

      // Country filter
      if (filters.selectedCountries.length > 0 && !filters.selectedCountries.includes(project.country)) {
        return false;
      }

      // Category filter
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(project.category)) {
        return false;
      }

      // Registry filter
      if (filters.selectedRegistries.length > 0 && !filters.selectedRegistries.includes(project.registry)) {
        return false;
      }

      return true;
    });

    // Sort projects
    switch (sortBy) {
      case "price-low":
        projects = [...projects].sort((a, b) => a.pricePerTonne - b.pricePerTonne);
        break;
      case "price-high":
        projects = [...projects].sort((a, b) => b.pricePerTonne - a.pricePerTonne);
        break;
      case "newest":
        projects = [...projects].sort((a, b) => b.vintage - a.vintage);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return projects;
  }, [searchQuery, filters, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100) count++;
    if (filters.vintageRange[0] !== 2015 || filters.vintageRange[1] !== 2024) count++;
    if (filters.selectedCountries.length > 0) count++;
    if (filters.selectedCategories.length > 0) count++;
    if (filters.selectedRegistries.length > 0) count++;
    if (filters.directListingsOnly) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold mb-2">Carbon Credit Marketplace</h1>
            <p className="text-muted-foreground">
              Discover and invest in verified carbon offset projects worldwide
            </p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search projects, countries, categories..."
                className="pl-12 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden h-12">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-6">
                  <FilterPanel 
                    isMobile 
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredProjects.length} projects
            {activeFilterCount > 0 && (
              <span className="ml-2 text-primary">
                ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active)
              </span>
            )}
          </p>

          {/* Main Content */}
          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-28">
                <FilterPanel 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </aside>

            {/* Projects Grid */}
            <div className="flex-1">
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProjectCard {...project} />
                  </div>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No projects found matching your criteria.</p>
                  <Button 
                    variant="link" 
                    onClick={() => setFilters(defaultFilters)}
                    className="mt-2"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
