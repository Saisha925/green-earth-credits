import { TreePine, Waves, Sun, Sprout } from "lucide-react";

const categories = [
  {
    icon: TreePine,
    label: "Reforestation",
    credits: "2.4M",
    change: "+12.5%",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: Sprout,
    label: "Avoided Deforestation",
    credits: "1.8M",
    change: "+8.3%",
    color: "from-green-500 to-teal-600",
  },
  {
    icon: Waves,
    label: "Blue Carbon",
    credits: "890K",
    change: "+15.2%",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Sun,
    label: "Renewable Energy",
    credits: "3.2M",
    change: "+22.1%",
    color: "from-amber-500 to-orange-600",
  },
];

export const CategoryStats = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Carbon Credit Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore verified carbon credits across diverse environmental projects
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.label}
              className="group glass-card rounded-2xl p-6 card-hover cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{category.label}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gradient">{category.credits}</span>
                <span className="text-sm text-primary font-medium">{category.change}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">tonnes available</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
