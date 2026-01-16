import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    id: 1,
    title: "Carbon Markets Hit Record $2 Trillion Volume in 2024",
    excerpt: "Global carbon markets reach unprecedented levels as corporations accelerate net-zero commitments.",
    date: "Jan 15, 2025",
    category: "Market Update",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "New Reforestation Standards Announced by VERRA",
    excerpt: "Enhanced verification protocols aim to increase transparency and impact measurement for forest credits.",
    date: "Jan 12, 2025",
    category: "Standards",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Blue Carbon Projects Gain Momentum in Southeast Asia",
    excerpt: "Coastal ecosystem preservation becomes fastest-growing category in voluntary carbon markets.",
    date: "Jan 10, 2025",
    category: "Projects",
    image: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&h=400&fit=crop",
  },
];

export const NewsSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Climate & Carbon News
            </h2>
            <p className="text-muted-foreground">
              Stay updated with the latest in carbon markets
            </p>
          </div>
          <Button variant="outline" className="shrink-0">
            View All News
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <article
              key={item.id}
              className="group glass-card rounded-2xl overflow-hidden card-hover cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {item.date}
                  </div>
                </div>
                <h3 className="font-semibold text-lg leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
