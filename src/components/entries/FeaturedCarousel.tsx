"use client"

import { useMemo } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/Carousel";
import { EntryCard } from "@/components/entries/EntryCard";
import type { AtlasEntryType } from "@/config";

interface CarouselEntry {
  slug: string;
  name: string;
  tagline?: string;
  entryType: AtlasEntryType;
  logo?: { url: string; alt?: string } | null;
  coverImage?: { url: string; alt?: string } | null;
  city: string;
  tags?: Array<{ tag: string }> | string[];
}

export default function FeaturedCarousel({ entries }: { entries: CarouselEntry[] }) {
  const plugins = useMemo(
    () => [
      AutoScroll({
        speed: 0.3,
        stopOnInteraction: true,
        stopOnMouseEnter: false,
      }),
    ],
    [],
  );

  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      plugins={plugins}
      className="w-full"
    >
      <CarouselContent className="-ml-3">
        {entries.map((entry) => (
          <CarouselItem
            key={entry.slug}
            className="pl-3 basis-[80%] xs:basis-[65%]"
          >
            <EntryCard
              slug={entry.slug}
              name={entry.name}
              tagline={entry.tagline}
              entryType={entry.entryType}
              logo={entry.logo}
              coverImage={entry.coverImage}
              city={entry.city}
              tags={entry.tags}
            />
          </CarouselItem>
        ))}
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
