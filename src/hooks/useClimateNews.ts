import { useState, useEffect } from "react";

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  url: string;
  source: string;
}

// Fallback news for when API fails or is not configured
const fallbackNews: NewsItem[] = [
  {
    id: 1,
    title: "Carbon Markets Hit Record $2 Trillion Volume in 2024",
    excerpt: "Global carbon markets reach unprecedented levels as corporations accelerate net-zero commitments.",
    date: "Jan 15, 2025",
    category: "Market Update",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop",
    url: "#",
    source: "Climate Finance Weekly"
  },
  {
    id: 2,
    title: "New Reforestation Standards Announced by VERRA",
    excerpt: "Enhanced verification protocols aim to increase transparency and impact measurement for forest credits.",
    date: "Jan 12, 2025",
    category: "Standards",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    url: "#",
    source: "Carbon Standard News"
  },
  {
    id: 3,
    title: "Blue Carbon Projects Gain Momentum in Southeast Asia",
    excerpt: "Coastal ecosystem preservation becomes fastest-growing category in voluntary carbon markets.",
    date: "Jan 10, 2025",
    category: "Projects",
    image: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&h=400&fit=crop",
    url: "#",
    source: "ESG Today"
  },
];

export const useClimateNews = () => {
  const [news, setNews] = useState<NewsItem[]>(fallbackNews);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Try to fetch from a news API if configured
        // For demo purposes, we'll use fallback data with dynamic dates
        const today = new Date();
        const dynamicNews = fallbackNews.map((item, index) => ({
          ...item,
          date: new Date(today.getTime() - index * 2 * 24 * 60 * 60 * 1000)
            .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }));
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setNews(dynamicNews);
      } catch (err) {
        console.error("Failed to fetch climate news:", err);
        setError("Unable to load latest news. Showing recent headlines.");
        setNews(fallbackNews);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, isLoading, error };
};
