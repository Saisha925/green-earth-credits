import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProjectMap } from "@/components/map/ProjectMap";
import {
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  User,
  ExternalLink,
  ArrowLeft,
  Leaf,
  Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoModeContext";

// Mock project data
const projectData = {
  id: "1",
  title: "Amazon Rainforest Conservation Project",
  description: "Protecting 500,000 hectares of primary rainforest in the Amazon basin, preserving biodiversity and indigenous communities. This project works directly with local communities to prevent deforestation while creating sustainable economic opportunities.",
  longDescription: `This flagship conservation initiative protects one of the most biodiverse regions on Earth. Through community partnerships and advanced monitoring technology, we've successfully prevented the deforestation of over 500,000 hectares of primary rainforest.

The project delivers multiple benefits beyond carbon sequestration:
- Protection of endangered species including jaguars, harpy eagles, and giant otters
- Support for indigenous communities and their traditional land rights
- Watershed protection for millions of downstream residents
- Preservation of medicinal plants and genetic resources`,
  image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop",
  pricePerTonne: 18.50,
  availableTonnes: 125000,
  country: "Brazil",
  category: "Avoided Deforestation",
  vintage: 2023,
  registry: "Verra VCS",
  assetId: "VCS-1234-2023",
  sellerHandle: "@amazon_protect",
  verified: true,
  certified: true,
  coordinates: { lat: -3.4653, lng: -62.2159 },
};

const ProjectDetails = () => {
  const { id } = useParams();
  const { user, isLoading } = useAuth();
  const { isDemoMode } = useDemoMode();
  
  const isAuthenticated = user || isDemoMode;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Map & Image */}
            <div className="space-y-6">
              {/* Interactive Map */}
              <div className="aspect-video glass-card">
                <ProjectMap
                  latitude={projectData.coordinates.lat}
                  longitude={projectData.coordinates.lng}
                  projectName={projectData.title}
                  country={projectData.country}
                  className="h-full"
                />
              </div>

              {/* Project Image */}
              <div className="aspect-video rounded-2xl overflow-hidden glass-card relative">
                <img
                  src={projectData.image}
                  alt={projectData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 px-3 py-2 rounded-lg glass-card flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{projectData.country}</span>
                </div>
              </div>

              {/* Project Details */}
              <div className="glass-card rounded-2xl p-6 space-y-6">
                <h2 className="font-semibold text-lg">Project Details</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground whitespace-pre-line">
                    {projectData.longDescription}
                  </p>
                </div>

              </div>
            </div>

            {/* Right: Purchase Card */}
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <div className="glass-card rounded-2xl p-6 space-y-6 glow-green-subtle">
                {/* Badges */}
                <div className="flex items-center gap-2">
                  {projectData.verified && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {projectData.certified && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Certified
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-display text-2xl font-bold">{projectData.title}</h1>

                {/* Seller */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  Listed by {projectData.sellerHandle}
                </div>

                <Separator />

                {/* Price & Availability */}
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted-foreground">Price per tonne</span>
                    <span className="text-3xl font-bold text-gradient">
                      ${projectData.pricePerTonne.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-medium">
                      {projectData.availableTonnes.toLocaleString()} tonnes
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Project Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Asset ID</span>
                    <p className="font-medium flex items-center gap-1">
                      {projectData.assetId}
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Registry</span>
                    <p className="font-medium">{projectData.registry}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Vintage</span>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {projectData.vintage}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Category</span>
                    <p className="font-medium">{projectData.category}</p>
                  </div>
                </div>

                <Separator />

                {/* Auth Warning */}
                {!isAuthenticated && !isLoading && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
                    <p className="flex items-center gap-2 text-amber-500">
                      <Lock className="w-4 h-4" />
                      Please log in to retire credits
                    </p>
                  </div>
                )}

                {/* CTA */}
                <Link to={isAuthenticated ? `/retire/${id}` : "/login"}>
                  <Button 
                    className="w-full h-14 gradient-primary text-primary-foreground btn-glow font-semibold text-lg"
                    disabled={isLoading}
                  >
                    {isAuthenticated ? (
                      <>
                        <Leaf className="w-5 h-5 mr-2" />
                        Retire Carbon
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Log in to Retire
                      </>
                    )}
                  </Button>
                </Link>

                <p className="text-xs text-center text-muted-foreground">
                  Retiring carbon credits permanently removes them from circulation,
                  ensuring they cannot be traded again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetails;
