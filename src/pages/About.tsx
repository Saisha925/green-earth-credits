import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Target,
  Globe,
  Users,
  Leaf,
  TrendingUp,
  Shield,
  ArrowRight,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/20 text-sm">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">UN SDG 13 - Climate Action</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">
              Building a{" "}
              <span className="text-gradient">Sustainable Future</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              GreenCredits is committed to accelerating climate action through transparent, 
              accessible carbon credit trading. We believe everyone has a role to play in 
              fighting climate change.
            </p>
          </div>
        </section>

        {/* SDG 13 Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-display text-4xl font-bold">
                  Aligned with SDG 13
                </h2>
                <p className="text-lg text-muted-foreground">
                  The United Nations Sustainable Development Goal 13 calls for urgent action 
                  to combat climate change and its impacts. GreenCredits directly supports 
                  this goal by:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                      <Leaf className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Enabling Carbon Offsetting</h4>
                      <p className="text-sm text-muted-foreground">
                        Making it easy for organizations and individuals to offset their emissions
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                      <Shield className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Ensuring Transparency</h4>
                      <p className="text-sm text-muted-foreground">
                        Providing verified, traceable carbon credits from certified projects
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                      <Globe className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Supporting Global Projects</h4>
                      <p className="text-sm text-muted-foreground">
                        Connecting buyers with impactful climate projects worldwide
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="glass-card rounded-2xl p-8 glow-green-subtle">
                <img
                  src="https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&h=400&fit=crop"
                  alt="SDG 13 Climate Action"
                  className="w-full rounded-xl mb-6"
                />
                <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary pl-4">
                  "Climate change is the defining issue of our time and we are at a defining 
                  moment. From shifting weather patterns that threaten food production, to 
                  rising sea levels that increase the risk of catastrophic flooding, the 
                  impacts of climate change are global in scope and unprecedented in scale."
                </blockquote>
                <p className="text-sm text-muted-foreground mt-4">— United Nations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-gradient mb-2">500K+</p>
                <p className="text-muted-foreground">Tonnes CO₂ Offset</p>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-gradient mb-2">150+</p>
                <p className="text-muted-foreground">Verified Projects</p>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-gradient mb-2">50+</p>
                <p className="text-muted-foreground">Countries Covered</p>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-gradient mb-2">10K+</p>
                <p className="text-muted-foreground">Active Users</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="font-display text-4xl font-bold">Our Mission</h2>
              <p className="text-xl text-muted-foreground">
                To democratize access to carbon markets, enabling every organization and 
                individual to participate in the global effort to combat climate change. 
                We believe that transparent, accessible carbon trading is essential for 
                achieving net-zero emissions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/marketplace">
                  <Button size="lg" className="gradient-primary text-primary-foreground btn-glow h-14 px-8">
                    Explore Marketplace
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="h-14 px-8">
                    Join GreenCredits
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Team Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card rounded-2xl p-6 text-center card-hover">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  Every credit is verified and traceable. We believe trust is built through openness.
                </p>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center card-hover">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Accessibility</h3>
                <p className="text-sm text-muted-foreground">
                  Climate action should be available to everyone, not just large corporations.
                </p>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center card-hover">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Impact</h3>
                <p className="text-sm text-muted-foreground">
                  We measure success by the real environmental change our platform enables.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
