import { useState, useEffect, useCallback } from "react";

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

const NEWS_QUERY = '"carbon credits" OR "carbon footprint"';
const GOOGLE_NEWS_URL = `https://news.google.com/rss/search?q=${encodeURIComponent(NEWS_QUERY)}&hl=en-US&gl=US&ceid=US:en`;
const REFRESH_INTERVAL_MS = 1000 * 60 * 30; // 30 minutes

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

const getCategory = (title: string, description: string) => {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("market") || text.includes("trade") || text.includes("price")) return "Market Update";
  if (text.includes("policy") || text.includes("regulation") || text.includes("law")) return "Policy";
  if (text.includes("project") || text.includes("offset") || text.includes("reforestation")) return "Projects";
  if (text.includes("emission") || text.includes("footprint")) return "Emissions";

  return "Climate News";
};

const toFormattedDate = (rawDate: string | null) => {
  if (!rawDate) return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const parseGoogleNewsRss = (xmlString: string): NewsItem[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const items = Array.from(xmlDoc.querySelectorAll("item")).slice(0, 6);

  return items.map((item, index) => {
    const title = item.querySelector("title")?.textContent?.trim() || "Untitled story";
    const link = item.querySelector("link")?.textContent?.trim() || "#";
    const description = item.querySelector("description")?.textContent?.trim() || "Latest coverage on climate and carbon markets.";
    const pubDate = item.querySelector("pubDate")?.textContent ?? null;
    const source = item.querySelector("source")?.textContent?.trim() || "Google News";

    return {
      id: index + 1,
      title,
      excerpt: description.replace(/<[^>]*>/g, "").slice(0, 180),
      date: toFormattedDate(pubDate),
      category: getCategory(title, description),
      image: fallbackNews[index % fallbackNews.length].image,
      url: link,
      source,
    };
  });
};

export const useClimateNews = () => {
  const [news, setNews] = useState<NewsItem[]>(fallbackNews);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setError(null);

    try {
      const proxiedRssUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(GOOGLE_NEWS_URL)}`;
      const response = await fetch(proxiedRssUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch feed. Status: ${response.status}`);
      }

      const xml = await response.text();
      const latestNews = parseGoogleNewsRss(xml);

      if (latestNews.length === 0) {
        throw new Error("Feed returned no articles");
      }

      setNews(latestNews);
    } catch (err) {
      console.error("Failed to fetch climate news:", err);
      setError("Unable to load live news right now. Showing recent headlines.");
      setNews(fallbackNews);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();

    const intervalId = window.setInterval(() => {
      fetchNews();
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [fetchNews]);

  return { news, isLoading, error };
};
