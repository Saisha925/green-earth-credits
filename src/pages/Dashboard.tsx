import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SellerDashboard } from "@/components/dashboard/SellerDashboard";
import { useDemoMode } from "@/contexts/DemoModeContext";
import {
  ShoppingCart,
  Store,
  Shield,
  Calculator,
  User,
  ArrowRight,
  TrendingUp,
  Leaf,
  FileText,
  Home,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const dashboardCards = [
  {
    icon: ShoppingCart,
    title: "Marketplace",
    description: "Browse and purchase verified carbon credits",
    href: "/marketplace",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: FileText,
    title: "ESG Report",
    description: "Generate comprehensive sustainability reports",
    href: "/esg-report",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: Shield,
    title: "Authenticate Certificate",
    description: "Verify your carbon credit certificates",
    href: "/authenticate",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Calculator,
    title: "Carbon Calculator",
    description: "Calculate your carbon footprint",
    href: "/calculator",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: User,
    title: "Profile",
    description: "View your credits and transactions",
    href: "/profile",
    color: "from-violet-500 to-purple-600",
  },
];

const Dashboard = () => {
  const { isDemoMode, demoRole } = useDemoMode();
  const activeRole = isDemoMode ? demoRole : "buyer";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb Navigation - Issue 7 Fix */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Manage your carbon credits and explore the marketplace.
            </p>
          </div>

          {/* Role Tabs */}
          <Tabs value={activeRole} className="mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
              <TabsTrigger value="buyer" className="h-10 text-base" disabled={isDemoMode}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buyer
              </TabsTrigger>
              <TabsTrigger value="seller" className="h-10 text-base" disabled={isDemoMode}>
                <Store className="w-4 h-4 mr-2" />
                Seller
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buyer" className="mt-8">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Retired</p>
                      <p className="text-3xl font-bold text-gradient">142 t</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">CO₂ Offset</p>
                      <p className="text-3xl font-bold text-gradient">142 t</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Investment</p>
                      <p className="text-3xl font-bold text-gradient">$2,847</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seller" className="mt-8">
              {isDemoMode ? (
                <SellerDashboard />
              ) : (
                <>
                  {/* Seller Stats */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Listed Credits</p>
                          <p className="text-3xl font-bold text-gradient">5,000 t</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Store className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Sold</p>
                          <p className="text-3xl font-bold text-gradient">1,250 t</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="text-3xl font-bold text-gradient">$18,750</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action for Seller */}
                  <div className="glass-card rounded-2xl p-6 mb-8 glow-green-subtle">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Ready to list more credits?</h3>
                        <p className="text-muted-foreground text-sm">
                          Authenticate your certificates and start selling on the marketplace.
                        </p>
                      </div>
                      <Link to="/authenticate">
                        <Button className="gradient-primary text-primary-foreground btn-glow">
                          Authenticate Certificate
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          {/* Navigation Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {dashboardCards.map((card, index) => (
              <Link
                key={card.title}
                to={card.href}
                className="group"
              >
                <div
                  className="glass-card rounded-2xl p-6 h-full card-hover"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
