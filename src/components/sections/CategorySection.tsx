import Link from 'next/link'
import { Rocket, Briefcase, Users, User, Microscope } from 'lucide-react'
import { ATLAS_CATEGORIES, type AtlasEntryType } from '@/config'
import CategoryCarousel from '@/components/entries/CategoryCarousel'

interface CategorySectionProps {
  counts: Record<AtlasEntryType, number>
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  briefcase: Briefcase,
  users: Users,
  user: User,
  microscope: Microscope,
}

export function CategorySection({ counts }: CategorySectionProps) {
  const carouselCategories = ATLAS_CATEGORIES.map((category) => ({
    type: category.type,
    label: category.label,
    description: category.description,
    icon: category.icon,
    slug: category.slug,
    count: counts[category.type] || 0,
  }))

  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-primary">
            Explora por categoría
          </h2>
          <p className="mt-2 text-secondary">
            Encuentra lo que necesitas en el ecosistema tech de Sinaloa
          </p>
        </div>

        {/* Carousel for mobile */}
        <div className="sm:hidden">
          <CategoryCarousel categories={carouselCategories} />
        </div>

        {/* Grid for sm+ */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ATLAS_CATEGORIES.map((category) => {
            const Icon = iconMap[category.icon]
            return (
              <Link
                key={category.type}
                href={`/${category.slug}`}
                className="group bg-card border border-border rounded-lg p-5 hover:border-accent/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    {Icon && <Icon className="w-5 h-5 text-accent" />}
                  </div>
                  <span className="text-2xl font-mono font-bold text-primary">
                    {counts[category.type] || 0}
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-primary group-hover:text-accent transition-colors">
                  {category.label}
                </h3>
                <p className="text-sm text-muted mt-1">{category.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
