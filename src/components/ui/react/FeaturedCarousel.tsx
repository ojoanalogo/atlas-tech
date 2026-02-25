import { MapPin } from "lucide-react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./Carousel";
import { cn } from "../../../utils";

const badgeConfig = {
  startup: {
    label: "Startup",
    color: "bg-emerald-500/90 text-emerald-50 border-emerald-500/60",
  },
  community: {
    label: "Comunidad",
    color: "bg-blue-500/90 text-blue-50 border-blue-500/60",
  },
  business: {
    label: "Empresa",
    color: "bg-purple-500/90 text-purple-50 border-purple-500/60",
  },
  consultory: {
    label: "Consultora",
    color: "bg-amber-500/90 text-amber-50 border-amber-500/60",
  },
  person: {
    label: "Persona",
    color: "bg-pink-500/90 text-pink-50 border-pink-500/60",
  },
} as const;

const CATEGORY_URL_MAP: Record<string, string> = {
  startup: "startups",
  consultory: "consultoras",
  community: "comunidades",
  person: "personas",
  business: "empresas",
};

type AtlasEntryType = keyof typeof badgeConfig;

export interface FeaturedEntry {
  slug: string;
  name: string;
  tagline?: string;
  entryType: AtlasEntryType;
  logoSrc?: string;
  coverSrc?: string;
  municipality: string;
  city: string;
  municipalityName: string;
  tags: string[];
}

export default function FeaturedCarousel({
  entries,
}: {
  entries: FeaturedEntry[];
}) {
  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      plugins={[
        AutoScroll({
          speed: 0.3,
          stopOnInteraction: true,
          stopOnMouseEnter: false,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent className="-ml-3">
        {entries.map((entry) => {
          const badge = badgeConfig[entry.entryType];
          const url = `/${CATEGORY_URL_MAP[entry.entryType]}/${entry.slug}`;
          const location =
            entry.municipality === "global"
              ? entry.city
              : `${entry.city}, ${entry.municipalityName}`;

          return (
            <CarouselItem
              key={entry.slug}
              className="pl-3 basis-[80%] min-[480px]:basis-[65%]"
            >
              <a
                href={url}
                className="group block bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all duration-300 h-full"
              >
                <div className="h-36 bg-elevated relative overflow-hidden">
                  {entry.coverSrc ? (
                    <img
                      src={entry.coverSrc}
                      alt={entry.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : entry.logoSrc ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={entry.logoSrc}
                        alt={`${entry.name} logo`}
                        className="w-16 h-16 object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-mono text-muted/30 font-bold">
                        {entry.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border",
                        badge.color,
                      )}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    {entry.logoSrc && entry.coverSrc && (
                      <img
                        src={entry.logoSrc}
                        alt={`${entry.name} logo`}
                        className="w-6 h-6 rounded border border-border object-cover shrink-0"
                        loading="lazy"
                      />
                    )}
                    <h3 className="font-sans font-semibold text-primary group-hover:text-accent transition-colors truncate">
                      {entry.name}
                    </h3>
                  </div>
                  {entry.tagline && (
                    <p className="text-sm text-secondary line-clamp-2">
                      {entry.tagline}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{location}</span>
                  </div>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {entry.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-elevated text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="flex items-center justify-center gap-2 mt-4">
        <CarouselPrevious
          className="static translate-y-0 min-h-[44px] min-w-[44px]"
          size="icon"
        />
        <CarouselNext
          className="static translate-y-0 min-h-[44px] min-w-[44px]"
          size="icon"
        />
      </div>
    </Carousel>
  );
}
