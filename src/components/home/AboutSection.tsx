import { Target, Globe, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "SDG 13 Aligned",
    description: "Every transaction contributes to the UN's Climate Action goals. We're committed to transparent, impactful environmental change.",
  },
  {
    icon: Globe,
    title: "Global Marketplace",
    description: "Connect with verified carbon credit projects worldwide. From rainforests to renewable energy initiatives.",
  },
  {
    icon: Users,
    title: "Trusted Community",
    description: "Join thousands of organizations and individuals making a difference. Every credit is authenticated and tracked.",
  },
  {
    icon: Zap,
    title: "Instant Trading",
    description: "Buy, sell, and retire carbon credits instantly. Our platform makes climate action accessible to everyone.",
  },
];

export const AboutSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-semibold uppercase tracking-wider text-sm">
                About Path2Zero
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                Your Personalized Path to{" "}
                <span className="text-gradient">Net-Zero</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Path2Zero combines intelligent carbon footprint calculation with 
                personalized offset recommendations, helping individuals and organizations 
                achieve their sustainability goals with confidence.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.slice(0, 2).map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card rounded-2xl p-6 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
