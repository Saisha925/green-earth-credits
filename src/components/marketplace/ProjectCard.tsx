import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Shield } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  pricePerTonne: number;
  country: string;
  category: string;
  vintage: number;
  verified: boolean;
}

export const ProjectCard = ({
  id,
  title,
  description,
  image,
  pricePerTonne,
  country,
  category,
  vintage,
  verified,
}: ProjectCardProps) => {
  return (
    <Link to={`/marketplace/${id}`}>
      <article className="group glass-card rounded-2xl overflow-hidden card-hover cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {verified && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Verified
            </div>
          )}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg glass-card text-sm font-bold">
            ${pricePerTonne.toFixed(2)}/t
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {country}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {vintage}
            </Badge>
          </div>
        </div>
      </article>
    </Link>
  );
};
