import { MapPin } from "lucide-react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/Carousel";
import { cn } from "../../utils";
import {
  ENTRY_TYPE_CONFIG,
  CATEGORY_URL_MAP,
  type AtlasEntryType,
} from "../../config";

export interface FeaturedEntry {
  slug: string;
  name: string;
  tagline?: string;
  entryType: AtlasEntryType;
  logoSrc?: string;
  coverSrc?: string;
  city: string;
  cityName: string;
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
          const config = ENTRY_TYPE_CONFIG[entry.entryType];
          const url = `/${CATEGORY_URL_MAP[entry.entryType]}/${entry.slug}`;
          const location =
            entry.city === "global"
              ? "Global"
              : entry.cityName;

          return (
            <CarouselItem
              key={entry.slug}
              className="pl-3 basis-[80%] xs:basis-[65%]"
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
                        config.badgeColor,
                      )}
                    >
                      {config.label}
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
                          className="text-2xs font-mono px-1.5 py-0.5 rounded bg-elevated text-muted"
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
          className="static translate-y-0 min-h-11 min-w-11"
          size="icon"
        />
        <CarouselNext
          className="static translate-y-0 min-h-11 min-w-11"
          size="icon"
        />
      </div>
    </Carousel>
  );
}
