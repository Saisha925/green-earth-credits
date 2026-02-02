import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto glow-green">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Start Your Journey to{" "}
            <span className="text-gradient">Carbon Neutrality</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Calculate your footprint, get personalized recommendations, and offset your emissions 
            with verified carbon credit projects that make a real difference.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/calculator">
              <Button size="lg" className="gradient-primary text-primary-foreground btn-glow h-14 px-8 text-lg font-semibold">
                Calculate My Footprint
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-primary/30 hover:bg-primary/5">
                Browse Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
