import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { ProjectRecommendation } from "@/lib/carbonCalculations";

interface ProjectRecommendationsProps {
  recommendations: ProjectRecommendation[];
  totalEmissions: number;
}

export const ProjectRecommendations = ({ recommendations, totalEmissions }: ProjectRecommendationsProps) => {
  if (recommendations.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">Recommended Projects to Offset Your Emissions</h2>
          <p className="text-muted-foreground text-sm">
            Based on your emission profile, we've matched these high-impact projects for you
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {recommendations.map((project, index) => (
          <div
            key={project.id}
            className="glass-card rounded-2xl overflow-hidden card-hover animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-3 left-3">
                <Badge className="gradient-primary text-primary-foreground border-0">
                  {project.category}
                </Badge>
              </div>
              {project.verified && (
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 rounded-full bg-background/90 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-semibold text-lg line-clamp-2 mb-1">{project.title}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{project.country}</span>
                </div>
              </div>

              {/* Why this project */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-primary font-medium">
                  💡 {project.reason}
                </p>
              </div>

              {/* Suggested offset */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Suggested offset:</span>
                <span className="font-bold text-foreground">{project.suggestedTonnes} tonnes</span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gradient">${project.pricePerTonne.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground"> /tonne</span>
                </div>
                <span className="text-sm font-medium">
                  Total: ${(project.pricePerTonne * project.suggestedTonnes).toFixed(2)}
                </span>
              </div>

              {/* CTA */}
              <Link to={`/marketplace/${project.id}`}>
                <Button className="w-full gradient-primary text-primary-foreground btn-glow">
                  Offset with this project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* View All CTA */}
      <div className="text-center mt-8">
        <Link to="/marketplace">
          <Button variant="outline" size="lg">
            View All Projects in Marketplace
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
