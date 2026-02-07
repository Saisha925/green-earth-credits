import { ArrowRight, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClimateNews } from "@/hooks/useClimateNews";

export const NewsSection = () => {
  const { news, isLoading, error } = useClimateNews();

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
            {error && (
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            )}
          </div>
          <Button variant="outline" className="shrink-0" asChild>
            <a
              href="https://news.google.com/search?q=carbon%20credits%20OR%20carbon%20footprint"
              target="_blank"
              rel="noopener noreferrer"
            >
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <article
                key={item.id}
                className="group glass-card rounded-2xl overflow-hidden card-hover cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
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
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">{item.source}</span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
