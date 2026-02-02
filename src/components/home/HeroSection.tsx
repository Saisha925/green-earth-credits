import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Animated Orbit Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="orbit-ring w-[400px] h-[400px] opacity-30 animate-orbit" />
        <div className="orbit-ring w-[600px] h-[600px] opacity-20 animate-orbit-slow" />
        <div className="orbit-ring w-[800px] h-[800px] opacity-10 animate-orbit-reverse" />
      </div>

      {/* Floating Particles */}
      <div className="particles">
        <div className="particle left-[10%] top-[20%] animate-float" style={{ animationDelay: "0s" }} />
        <div className="particle left-[20%] top-[60%] animate-float" style={{ animationDelay: "1s" }} />
        <div className="particle left-[80%] top-[30%] animate-float" style={{ animationDelay: "2s" }} />
        <div className="particle left-[70%] top-[70%] animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="particle left-[50%] top-[10%] animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-4 pt-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 stagger-children">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/20 text-sm">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Aligned with UN SDG 13 - Climate Action</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
            Your Journey to{" "}
            <span className="text-gradient">Carbon Neutrality</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Calculate your carbon footprint, discover personalized offset recommendations, 
            and take meaningful action for climate change with Path2Zero.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/calculator">
              <Button size="lg" className="gradient-primary text-primary-foreground btn-glow h-14 px-8 text-lg font-semibold">
                Calculate My Footprint
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-primary/30 hover:bg-primary/5">
                Explore Offset Projects
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Verified Credits</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Real-time Trading</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              <span>Climate Impact</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
