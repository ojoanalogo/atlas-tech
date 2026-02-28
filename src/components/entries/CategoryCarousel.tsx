import { Rocket, Briefcase, Users, User } from "lucide-react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/Carousel";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  briefcase: Briefcase,
  users: Users,
  user: User,
};

export interface CategoryData {
  type: string;
  label: string;
  description: string;
  icon: string;
  slug: string;
  count: number;
}

export default function CategoryCarousel({
  categories,
}: {
  categories: CategoryData[];
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
        {categories.map((category) => {
          const Icon = iconMap[category.icon];
          return (
            <CarouselItem
              key={category.type}
              className="pl-3 basis-[75%] xs:basis-[50%]"
            >
              <a
                href={`/${category.slug}`}
                className="group block bg-card border border-border rounded-lg p-5 hover:border-accent/50 transition-all duration-300 h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    {Icon && <Icon className="w-5 h-5 text-accent" />}
                  </div>
                  <span className="text-2xl font-mono font-bold text-primary">
                    {category.count}
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-primary group-hover:text-accent transition-colors">
                  {category.label}
                </h3>
                <p className="text-sm text-muted mt-1">
                  {category.description}
                </p>
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
