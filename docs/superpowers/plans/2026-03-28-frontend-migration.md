# Frontend Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port all Astro pages and components to Next.js App Router, consuming data from Payload CMS via its local API, producing a fully functional public site.

**Architecture:** Next.js App Router with a `(frontend)` route group for public pages. Server components fetch data via Payload's local API (`getPayload`). Client components use `"use client"` directive. Existing React components (.tsx) are copied from the `main` branch git history with minor import updates. Astro components (.astro) are converted to React. New pages (news, jobs) are built from scratch.

**Tech Stack:** Next.js 15, React 19, Payload CMS 3 (local API), Tailwind CSS v4, Embla Carousel, D3-geo, Lucide React, Radix UI, add-to-calendar-button-react

**Spec:** `docs/superpowers/specs/2026-03-28-cms-integration-design.md`
**Depends on:** Plan 1 (CMS Foundation) — must be complete on `cms-foundation` branch

---

## Source Code Reference

The old Astro components live in git history on the `main` branch. Throughout this plan, retrieve them with:

```bash
git show main:src/path/to/file.ext
```

This avoids copying thousands of lines of existing React code into the plan. The plan provides:
- **Full code** for all NEW files (data layer, layouts, pages, .astro→.tsx conversions)
- **Diff instructions** for existing React components that need minor updates (add `"use client"`, update imports)

---

## File Structure

```
src/
├── app/
│   ├── (frontend)/                    # Public site route group
│   │   ├── layout.tsx                 # Public layout (Header + Footer + theme)
│   │   ├── page.tsx                   # Homepage
│   │   ├── [category]/
│   │   │   ├── page.tsx               # Category listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Entry detail
│   │   ├── directorio/
│   │   │   ├── page.tsx               # Full directory
│   │   │   ├── [city]/
│   │   │   │   └── page.tsx           # City-filtered
│   │   │   └── submit/
│   │   │       └── page.tsx           # Submit form
│   │   ├── noticias/
│   │   │   ├── page.tsx               # News listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # News article
│   │   ├── empleos/
│   │   │   ├── page.tsx               # Job board
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Job detail
│   │   └── eventos/
│   │       └── page.tsx               # Events calendar
│   ├── (payload)/                     # Existing CMS routes (don't touch)
│   ├── layout.tsx                     # Root layout (fonts, meta, theme init)
│   └── not-found.tsx                  # 404 page
├── components/
│   ├── layout/
│   │   ├── Header.tsx                 # Converted from .astro
│   │   ├── Footer.tsx                 # Converted from .astro
│   │   └── MatrixBackground.tsx       # Converted from .astro
│   ├── sections/
│   │   ├── HeroSection.tsx            # Converted from .astro
│   │   ├── CategorySection.tsx        # Converted from .astro
│   │   ├── FeaturedSection.tsx        # Converted from .astro
│   │   ├── MapSection.tsx             # Copied from main (already React)
│   │   ├── CalendarSection.tsx        # Converted from .astro
│   │   ├── CtaSection.tsx             # Converted from .astro
│   │   ├── FaqSection.tsx             # Converted from .astro
│   │   └── EventsHeroSection.tsx      # Converted from .astro
│   ├── entries/
│   │   ├── EntryCard.tsx              # Converted from .astro
│   │   ├── EntryBadge.tsx             # Converted from .astro
│   │   ├── DirectoryFilter.tsx        # Copied from main (already React)
│   │   ├── DirectoryGrid.tsx          # New — server component for entry grid
│   │   ├── FeaturedCarousel.tsx       # Copied from main (already React)
│   │   └── CategoryCarousel.tsx       # Copied from main (already React)
│   ├── calendar/
│   │   ├── EventCalendar.tsx          # Copied from main (already React)
│   │   ├── EventDetailModal.tsx       # Copied from main (already React)
│   │   ├── UpcomingEventsStrip.tsx    # Copied from main (already React)
│   │   └── AddToCalendarButton.tsx    # Copied from main (already React)
│   ├── maps/
│   │   └── SinaloaMap.tsx             # Copied from main (already React)
│   ├── forms/
│   │   └── SubmitWizard.tsx           # Copied from main (already React)
│   └── ui/
│       ├── Button.tsx                 # Copied from main (already React)
│       ├── Card.tsx                   # Converted from .astro
│       ├── Carousel.tsx               # Copied from main (already React)
│       ├── Divider.tsx                # Converted from .astro
│       ├── ExternalLink.tsx           # Converted from .astro
│       ├── SectionHeading.tsx         # Converted from .astro
│       ├── ShareButton.tsx            # Copied from main (already React)
│       ├── Tag.tsx                    # Converted from .astro
│       └── ThemeToggle.tsx            # Copied from main (already React)
├── lib/
│   ├── payload.ts                     # NEW — Payload data fetching helpers
│   └── utils.ts                       # Ported from old utils/index.ts
├── hooks/
│   ├── revalidateOnPublish.ts         # Already exists (Payload hook)
│   └── useEventsData.ts              # Rewritten to use Payload Events API
├── styles/
│   ├── globals.css                    # Ported from old styles/global.css
│   └── tooltip.css                    # Copied from main
├── config.ts                          # Already exists
├── collections/                       # Already exists
└── access/                            # Already exists

public/
├── favicon.ico                        # Copied from main
├── og.jpg                             # Copied from main
├── robots.txt                         # Copied from main
├── site.webmanifest                   # Copied from main
├── topo/
│   └── Sinaloa_municipios.json        # Copied from main (needed by SinaloaMap)
└── (other favicons)                   # Copied from main
```

---

### Task 1: Install frontend dependencies + styles + static assets

**Files:**
- Modify: `package.json`
- Create: `src/styles/globals.css`
- Create: `src/styles/tooltip.css`
- Create: `public/` (multiple static assets)

- [ ] **Step 1: Install frontend dependencies**

```bash
pnpm add embla-carousel-react embla-carousel-auto-scroll d3-geo react-simple-maps lucide-react add-to-calendar-button-react class-variance-authority clsx tailwind-merge radix-ui
pnpm add -D @types/d3-geo @types/react-simple-maps
```

- [ ] **Step 2: Copy static assets from main branch**

```bash
git show main:public/favicon.ico > public/favicon.ico
git show main:public/og.jpg > public/og.jpg
git show main:public/og.png > public/og.png
git show main:public/robots.txt > public/robots.txt
git show main:public/site.webmanifest > public/site.webmanifest
git show main:public/apple-touch-icon.png > public/apple-touch-icon.png
git show main:public/favicon-16x16.png > public/favicon-16x16.png
git show main:public/favicon-32x32.png > public/favicon-32x32.png
git show main:public/android-chrome-192x192.png > public/android-chrome-192x192.png
git show main:public/android-chrome-512x512.png > public/android-chrome-512x512.png
mkdir -p public/topo
git show main:public/topo/Sinaloa_municipios.json > public/topo/Sinaloa_municipios.json
```

- [ ] **Step 3: Create globals.css**

Retrieve from main and adapt for Next.js:

```bash
git show main:src/styles/global.css > src/styles/globals.css
git show main:src/styles/tooltip.css > src/styles/tooltip.css
```

The CSS is pure Tailwind v4 + CSS custom properties. No Astro-specific syntax. Works as-is in Next.js.

- [ ] **Step 4: Import globals.css in root layout**

Modify `src/app/layout.tsx` to import the stylesheet. Replace the entire file:

```tsx
import type { Metadata } from 'next'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '@/config'
import '@/styles/globals.css'
import '@/styles/tooltip.css'

export const metadata: Metadata = {
  title: {
    default: `${SITE_TITLE} | Directorio del Ecosistema Tech de Sinaloa`,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: SITE_TITLE,
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}})()`,
          }}
        />
      </head>
      <body className="mx-auto font-sans w-full min-h-screen flex flex-col relative bg-background text-secondary selection:bg-accent selection:text-accent-foreground">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Configure Next.js for remote images**

Add remote image patterns to `next.config.ts` for the R2 media bucket:

```typescript
// Inside the nextConfig object, add:
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.r2.cloudflarestorage.com',
    },
    {
      protocol: 'https',
      hostname: 'media.atlas-sinaloa.tech',
    },
  ],
},
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: install frontend deps, styles, static assets, and configure root layout"
```

---

### Task 2: Port utilities + create Payload data fetching layer

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/lib/payload.ts`

- [ ] **Step 1: Create utility functions**

Create `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SITE_URL, CITY_IDS, emptyTypeCounts, type AtlasEntryType } from '@/config'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildTrackedUrl(url: string, slug: string, medium = 'directorio'): string {
  try {
    const u = new URL(url)
    u.searchParams.set('utm_source', new URL(SITE_URL).hostname)
    u.searchParams.set('utm_medium', medium)
    u.searchParams.set('utm_content', slug)
    return u.toString()
  } catch {
    return url
  }
}

/** Flatten Payload array fields: [{tag: "x"}, {tag: "y"}] → ["x", "y"] */
export function flattenArray<T>(arr: { [key: string]: T }[] | undefined | null, key: string): T[] {
  if (!arr) return []
  return arr.map((item) => item[key]).filter(Boolean)
}

export function groupByCity(entries: Array<{ city: string }>): Record<string, number> {
  const result: Record<string, number> = {}
  for (const entry of entries) {
    const city = entry.city
    if (city === 'global') {
      for (const id of CITY_IDS) {
        result[id] = (result[id] || 0) + 1
      }
    } else {
      result[city] = (result[city] || 0) + 1
    }
  }
  return result
}

export function countByType(entries: Array<{ entryType: string }>): Record<AtlasEntryType, number> {
  return entries.reduce(
    (acc, entry) => {
      const type = entry.entryType as AtlasEntryType
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    emptyTypeCounts(),
  )
}

export function countByTypeAndCity(
  entries: Array<{ city: string; entryType: string }>,
): Record<string, Record<AtlasEntryType, number>> {
  const result: Record<string, Record<AtlasEntryType, number>> = {}
  for (const entry of entries) {
    const city = entry.city
    const type = entry.entryType as AtlasEntryType
    if (city === 'global') {
      for (const id of CITY_IDS) {
        if (!result[id]) result[id] = emptyTypeCounts()
        result[id][type] = (result[id][type] || 0) + 1
      }
    } else {
      if (!result[city]) result[city] = emptyTypeCounts()
      result[city][type] = (result[city][type] || 0) + 1
    }
  }
  return result
}

export interface CityOption {
  id: string
  name: string
  count: number
}

export function buildCityOptions(entries: Array<{ city: string }>): CityOption[] {
  const counts: Record<string, number> = {}
  for (const entry of entries) {
    counts[entry.city] = (counts[entry.city] || 0) + 1
  }
  const globalCount = counts['global'] || 0
  const { SINALOA_CITIES } = require('@/config')
  return [
    ...(globalCount > 0 ? [{ id: 'global', name: 'Global', count: globalCount }] : []),
    ...SINALOA_CITIES.map((m: { id: string; name: string }) => ({
      id: m.id,
      name: m.name,
      count: counts[m.id] || 0,
    })),
  ]
}
```

- [ ] **Step 2: Create Payload data fetching helpers**

Create `src/lib/payload.ts`:

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'
import type { AtlasEntryType } from '@/config'

export async function getPayloadClient() {
  return getPayload({ config })
}

// --- Entries ---

export async function getPublishedEntries(limit = 200) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'entries',
    where: { _status: { equals: 'published' } },
    limit,
    sort: '-publishDate',
  })
}

export async function getEntriesByType(entryType: AtlasEntryType, limit = 200) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'entries',
    where: {
      _status: { equals: 'published' },
      entryType: { equals: entryType },
    },
    limit,
    sort: '-publishDate',
  })
}

export async function getEntryBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'entries',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function getFeaturedEntries() {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'entries',
    where: {
      _status: { equals: 'published' },
      featured: { equals: true },
    },
    limit: 10,
    sort: 'name',
  })
}

// --- News ---

export async function getPublishedNews(limit = 20) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'news',
    where: { _status: { equals: 'published' } },
    limit,
    sort: '-publishDate',
  })
}

export async function getNewsBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'news',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
  })
  return result.docs[0] ?? null
}

// --- Jobs ---

export async function getActiveJobs(limit = 50) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'jobs',
    where: {
      _status: { equals: 'published' },
      expiresAt: { greater_than: new Date().toISOString() },
    },
    limit,
    sort: '-createdAt',
  })
}

export async function getJobBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'jobs',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
  })
  return result.docs[0] ?? null
}

// --- Events ---

export async function getPublishedEvents(limit = 100) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'events',
    where: { _status: { equals: 'published' } },
    limit,
    sort: 'date',
  })
}

export async function getUpcomingEvents(limit = 5) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'events',
    where: {
      _status: { equals: 'published' },
      date: { greater_than_equal: new Date().toISOString().split('T')[0] },
    },
    limit,
    sort: 'date',
  })
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/utils.ts src/lib/payload.ts
git commit -m "feat: add utility functions and Payload data fetching layer"
```

---

### Task 3: Port UI components

**Files:**
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Tag.tsx`
- Create: `src/components/ui/Divider.tsx`
- Create: `src/components/ui/ExternalLink.tsx`
- Create: `src/components/ui/SectionHeading.tsx`
- Create: `src/components/ui/Button.tsx` (copy from main)
- Create: `src/components/ui/Carousel.tsx` (copy from main)
- Create: `src/components/ui/ShareButton.tsx` (copy from main)
- Create: `src/components/ui/ThemeToggle.tsx` (copy from main)

- [ ] **Step 1: Convert .astro UI components to .tsx**

Create `src/components/ui/Card.tsx`:

```tsx
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function Card({ children, className, as: Tag = 'div' }: CardProps) {
  return (
    <Tag className={cn('bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6', className)}>
      {children}
    </Tag>
  )
}
```

Create `src/components/ui/Tag.tsx`:

```tsx
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface TagProps {
  children: React.ReactNode
  href?: string
  className?: string
}

export function Tag({ children, href, className }: TagProps) {
  const classes = cn(
    'inline-block text-2xs font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20',
    className,
  )
  if (href) {
    return <Link href={href} className={classes}>{children}</Link>
  }
  return <span className={classes}>{children}</span>
}
```

Create `src/components/ui/Divider.tsx`:

```tsx
import { cn } from '@/lib/utils'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  subtle?: boolean
  className?: string
}

export function Divider({ orientation = 'horizontal', subtle = true, className }: DividerProps) {
  return (
    <div
      className={cn(
        subtle ? 'bg-border/50' : 'bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className,
      )}
    />
  )
}
```

Create `src/components/ui/ExternalLink.tsx`:

```tsx
interface ExternalLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}
```

Create `src/components/ui/SectionHeading.tsx`:

```tsx
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  children: React.ReactNode
  className?: string
}

export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <p className={cn('text-xs font-mono uppercase text-muted mb-4 tracking-wider', className)}>
      {children}
    </p>
  )
}
```

- [ ] **Step 2: Copy existing React UI components from main branch**

These are already React — copy them and update the `cn` import path:

```bash
git show main:src/components/ui/Button.tsx > src/components/ui/Button.tsx
git show main:src/components/ui/Carousel.tsx > src/components/ui/Carousel.tsx
git show main:src/components/ui/ShareButton.tsx > src/components/ui/ShareButton.tsx
git show main:src/components/ui/ThemeToggle.tsx > src/components/ui/ThemeToggle.tsx
```

In each file, update imports:
- Change `from "../utils"` or `from "../../utils"` → `from "@/lib/utils"`
- Change `from "../../config"` or `from "../config"` → `from "@/config"`
- Add `"use client"` at the top of: Button.tsx (uses Slot), Carousel.tsx (uses state), ShareButton.tsx (uses state), ThemeToggle.tsx (uses state/effects)

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/
git commit -m "feat: port all UI components (Card, Tag, Divider, Button, Carousel, etc.)"
```

---

### Task 4: Port entry components

**Files:**
- Create: `src/components/entries/EntryBadge.tsx`
- Create: `src/components/entries/EntryCard.tsx`
- Create: `src/components/entries/FeaturedCarousel.tsx` (copy from main)
- Create: `src/components/entries/CategoryCarousel.tsx` (copy from main)

- [ ] **Step 1: Create EntryBadge**

Create `src/components/entries/EntryBadge.tsx`:

```tsx
import { cn } from '@/lib/utils'
import { ENTRY_TYPE_CONFIG, type AtlasEntryType } from '@/config'

interface EntryBadgeProps {
  entryType: AtlasEntryType
  className?: string
}

export function EntryBadge({ entryType, className }: EntryBadgeProps) {
  const config = ENTRY_TYPE_CONFIG[entryType]
  if (!config) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-2xs font-mono px-2 py-0.5 rounded-full border',
        config.badgeColor,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
```

- [ ] **Step 2: Create EntryCard**

Create `src/components/entries/EntryCard.tsx`:

```tsx
import Link from 'next/link'
import { EntryBadge } from './EntryBadge'
import { Tag } from '@/components/ui/Tag'
import { getEntryUrl, getCityName, type AtlasEntryType } from '@/config'

interface EntryCardProps {
  slug: string
  name: string
  tagline?: string
  entryType: AtlasEntryType
  logo?: { url: string; alt?: string } | null
  coverImage?: { url: string; alt?: string } | null
  city: string
  tags?: Array<{ tag: string }> | string[]
}

export function EntryCard({ slug, name, tagline, entryType, logo, coverImage, city, tags }: EntryCardProps) {
  const href = getEntryUrl(entryType, slug)
  const displayTags = (tags || []).slice(0, 3).map((t) => (typeof t === 'string' ? t : t.tag))

  const coverUrl = typeof coverImage === 'object' && coverImage?.url ? coverImage.url : null
  const logoUrl = typeof logo === 'object' && logo?.url ? logo.url : null

  return (
    <Link
      href={href}
      className="group block bg-card/90 backdrop-blur-sm border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-colors"
    >
      {/* Cover or logo fallback */}
      <div className="relative h-36 bg-elevated overflow-hidden">
        {coverUrl ? (
          <img src={coverUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
        ) : logoUrl ? (
          <div className="flex items-center justify-center h-full p-6">
            <img src={logoUrl} alt={name} className="max-h-20 max-w-[80%] object-contain" loading="lazy" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted text-3xl font-bold">
            {name.charAt(0)}
          </div>
        )}
        <div className="absolute top-2 left-2">
          <EntryBadge entryType={entryType} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-primary text-sm line-clamp-1">{name}</h3>
        {tagline && <p className="text-muted text-xs mt-1 line-clamp-2">{tagline}</p>}
        <p className="text-muted text-2xs font-mono mt-2">{getCityName(city)}</p>
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {displayTags.map((tag) => (
              <Tag key={tag} className="text-[10px]">{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
```

- [ ] **Step 3: Copy carousel components from main**

```bash
git show main:src/components/entries/FeaturedCarousel.tsx > src/components/entries/FeaturedCarousel.tsx
git show main:src/components/entries/CategoryCarousel.tsx > src/components/entries/CategoryCarousel.tsx
```

Update imports in both files:
- `from "../../utils"` → `from "@/lib/utils"`
- `from "../../config"` → `from "@/config"`
- `from "../ui/Carousel"` → `from "@/components/ui/Carousel"`
- Ensure `"use client"` is at the top

In `FeaturedCarousel.tsx`, update the entry card rendering to use the new `EntryCard` component or adapt the inline card markup to work with Payload's data shape (where `logo`/`coverImage` are objects with `url` property, not Astro image references).

- [ ] **Step 4: Commit**

```bash
git add src/components/entries/
git commit -m "feat: port entry components (EntryCard, EntryBadge, carousels)"
```

---

### Task 5: Port layout components (Header, Footer, public layout)

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/app/(frontend)/layout.tsx`

- [ ] **Step 1: Create Header**

Retrieve the old Header from `git show main:src/components/layout/Header.astro` and convert to React. This is the most complex layout conversion — it has dropdown menus, mobile menu, and event listeners.

Create `src/components/layout/Header.tsx`:

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Rocket, Users, Briefcase, User, Menu, X, Map, CalendarDays, Plus } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ENTRY_TYPE_CONFIG, ENTRY_TYPES, type AtlasEntryType } from '@/config'

const iconMap: Record<string, React.ReactNode> = {
  rocket: <Rocket className="w-4 h-4" />,
  users: <Users className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  user: <User className="w-4 h-4" />,
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const categories = ENTRY_TYPES.map((type) => ({
    type,
    ...ENTRY_TYPE_CONFIG[type],
  }))

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold text-primary">
          <span className="text-accent">{'>'}</span> tech_atlas
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Directory dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors"
            >
              Directorio
              <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                <Link href="/directorio" className="block px-4 py-2 text-xs font-mono text-secondary hover:text-primary hover:bg-elevated transition-colors">
                  Ver todo
                </Link>
                <div className="h-px bg-border my-1" />
                {categories.map((cat) => (
                  <Link
                    key={cat.type}
                    href={`/${cat.slug}`}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-secondary hover:text-primary hover:bg-elevated transition-colors"
                  >
                    {iconMap[cat.icon]}
                    {cat.labelPlural}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/eventos" className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors">
            <CalendarDays className="w-3.5 h-3.5" />
            Eventos
          </Link>

          <Link href="/noticias" className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors">
            Noticias
          </Link>

          <Link href="/empleos" className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors">
            Empleos
          </Link>

          <Link href="/#map" className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors">
            <Map className="w-3.5 h-3.5" />
            Mapa
          </Link>

          <ThemeToggle />

          <Link
            href="/directorio/submit"
            className="ml-2 flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-secondary hover:text-primary">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-background z-40 overflow-y-auto">
          <nav className="px-4 py-6 space-y-1">
            <Link href="/directorio" className="block px-4 py-3 text-sm font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated">
              Directorio
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.type}
                href={`/${cat.slug}`}
                className="flex items-center gap-2 px-4 py-3 text-sm font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated ml-2"
              >
                {iconMap[cat.icon]}
                {cat.labelPlural}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <Link href="/eventos" className="block px-4 py-3 text-sm font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated">
              Eventos
            </Link>
            <Link href="/noticias" className="block px-4 py-3 text-sm font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated">
              Noticias
            </Link>
            <Link href="/empleos" className="block px-4 py-3 text-sm font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated">
              Empleos
            </Link>
            <Link href="/#map" className="block px-4 py-3 text-sm font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated">
              Mapa
            </Link>
            <div className="h-px bg-border my-2" />
            <Link
              href="/directorio/submit"
              className="flex items-center justify-center gap-2 mx-4 py-3 text-sm font-mono font-medium bg-accent text-accent-foreground rounded-md"
            >
              <Plus className="w-4 h-4" />
              Agregar proyecto
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 2: Create Footer**

Create `src/components/layout/Footer.tsx`:

```tsx
import Link from 'next/link'
import { ENTRY_TYPE_CONFIG, ENTRY_TYPES, SOCIAL_LINKS } from '@/config'
import { Github } from 'lucide-react'

export function Footer() {
  const categories = ENTRY_TYPES.map((type) => ({
    type,
    ...ENTRY_TYPE_CONFIG[type],
  }))

  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="font-mono text-sm font-bold text-primary mb-2">
              <span className="text-accent">{'>'}</span> tech_atlas
            </p>
            <p className="text-xs text-muted leading-relaxed">
              Directorio abierto del ecosistema tecnológico de Sinaloa. Código abierto, hecho con cariño desde Sinaloa.
            </p>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent mt-3 font-mono"
              >
                <Github className="w-3.5 h-3.5" />
                {link.label}
              </a>
            ))}
          </div>

          {/* Directory links */}
          <div>
            <p className="text-xs font-mono uppercase text-muted mb-3 tracking-wider">Directorio</p>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.type}>
                  <Link href={`/${cat.slug}`} className="text-xs text-secondary hover:text-accent transition-colors font-mono">
                    {cat.labelPlural}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-mono uppercase text-muted mb-3 tracking-wider">Recursos</p>
            <ul className="space-y-2">
              <li><Link href="/directorio" className="text-xs text-secondary hover:text-accent transition-colors font-mono">Explorar</Link></li>
              <li><Link href="/#map" className="text-xs text-secondary hover:text-accent transition-colors font-mono">Mapa</Link></li>
              <li><Link href="/eventos" className="text-xs text-secondary hover:text-accent transition-colors font-mono">Eventos</Link></li>
              <li><Link href="/noticias" className="text-xs text-secondary hover:text-accent transition-colors font-mono">Noticias</Link></li>
              <li><Link href="/empleos" className="text-xs text-secondary hover:text-accent transition-colors font-mono">Empleos</Link></li>
              <li><Link href="/directorio/submit" className="text-xs text-secondary hover:text-accent transition-colors font-mono">Agregar proyecto</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-2xs text-muted font-mono">
            &copy; {new Date().getFullYear()} Tech Atlas — Sinaloa, México
          </p>
          <p className="text-2xs text-muted font-mono">
            Hecho con open source
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Create the public layout**

Create `src/app/(frontend)/layout.tsx`:

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1 lg:px-20 xl:px-8">
        {children}
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Create a temporary frontend homepage**

Create `src/app/(frontend)/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-primary">Tech Atlas</h1>
      <p className="text-secondary mt-2">Frontend migration in progress. Header and footer are live.</p>
    </div>
  )
}
```

Remove or rename the old `src/app/page.tsx` (the Plan 1 placeholder) since the `(frontend)` route group now handles `/`:

```bash
rm src/app/page.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/ src/app/\(frontend\)/ && git rm -f src/app/page.tsx 2>/dev/null; git add -A
git commit -m "feat: port layout system (Header, Footer, public layout)"
```

---

### Task 6: Port homepage sections

**Files:**
- Create: `src/components/sections/HeroSection.tsx`
- Create: `src/components/sections/CategorySection.tsx`
- Create: `src/components/sections/FeaturedSection.tsx`
- Create: `src/components/sections/CtaSection.tsx`
- Create: `src/components/sections/FaqSection.tsx`
- Create: `src/components/sections/CalendarSection.tsx`
- Create: `src/components/sections/EventsHeroSection.tsx`

- [ ] **Step 1: Create section components**

These are all converted from .astro to .tsx. Retrieve each from `git show main:src/components/sections/[Name].astro` and convert using these rules:

**Conversion pattern (.astro → .tsx):**
1. Remove the `---` frontmatter block. Move props to a TypeScript interface.
2. Replace `{slot}` with `{children}`.
3. Replace `class=` with `className=`.
4. Replace `class:list={[...]}` with `className={cn(...)}`.
5. Replace `client:load` / `client:visible` with nothing (the component itself has `"use client"`).
6. Replace Astro image imports (`import { Image } from 'astro:assets'`) with `<img>` or `next/image`.
7. Replace `Astro.props` with function params.
8. Replace `set:html` with `dangerouslySetInnerHTML`.
9. Update import paths: `../config` → `@/config`, `../utils` → `@/lib/utils`.

Create each section component following this pattern. The sections are primarily HTML + Tailwind — the conversion is mostly syntactic.

**Key sections to create:**

`src/components/sections/HeroSection.tsx` — Takes `cityCounts` prop, renders hero text + CTA buttons. Import SinaloaMap from `@/components/maps/SinaloaMap` (the component is copied in Task 7).

`src/components/sections/CategorySection.tsx` — Takes `counts` prop (Record<AtlasEntryType, number>), renders category cards with icons from lucide-react + CategoryCarousel for mobile.

`src/components/sections/FeaturedSection.tsx` — Takes `entries` prop (featured entries array), renders entry cards in a grid + FeaturedCarousel for mobile.

`src/components/sections/CtaSection.tsx` — Static section with "Pon a Sinaloa en el mapa" CTA + two buttons.

`src/components/sections/FaqSection.tsx` — Client component with `"use client"`, renders FAQ accordion using `<details>/<summary>` with FAQS from config.

`src/components/sections/CalendarSection.tsx` — Client component wrapper that mounts EventCalendar, EventDetailModal, AddToCalendarButton.

`src/components/sections/EventsHeroSection.tsx` — Simple server component with heading and subtext for the events page.

For each: retrieve the original `.astro` from main branch, apply the conversion rules above, and create the `.tsx` file. The bulk of the code (Tailwind classes, layout structure) carries over directly.

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/
git commit -m "feat: port homepage section components from Astro to React"
```

---

### Task 7: Port calendar, map, and directory filter components

**Files:**
- Create: `src/components/calendar/EventCalendar.tsx` (copy from main)
- Create: `src/components/calendar/EventDetailModal.tsx` (copy from main)
- Create: `src/components/calendar/UpcomingEventsStrip.tsx` (copy from main)
- Create: `src/components/calendar/AddToCalendarButton.tsx` (copy from main)
- Create: `src/hooks/useEventsData.ts`
- Create: `src/components/maps/SinaloaMap.tsx` (copy from main)
- Create: `src/components/sections/MapSection.tsx` (copy from main)
- Create: `src/components/entries/DirectoryFilter.tsx` (copy from main)
- Create: `src/components/forms/SubmitWizard.tsx` (copy from main)

- [ ] **Step 1: Rewrite useEventsData hook for Payload Events**

The old hook fetched from Google Sheets CSV. The new hook fetches from Payload's REST API (client-side, since calendar components are `"use client"`).

Create `src/hooks/useEventsData.ts`:

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'

export interface TechEvent {
  id: string
  title: string
  organizer: string
  date: string // YYYY-MM-DD
  startTime: string
  endTime: string
  description: string
  url: string
  location: string
  mapsUrl: string
  modality: string
  meetLink: string
  image?: { url: string } | null
  registerUrl: string
}

type Status = 'loading' | 'fresh' | 'error'

export interface UseEventsDataResult {
  events: TechEvent[]
  eventsByDate: Record<string, TechEvent[]>
  status: Status
  refetch: () => void
}

function groupByDate(events: TechEvent[]): Record<string, TechEvent[]> {
  const map: Record<string, TechEvent[]> = {}
  for (const ev of events) {
    const dateKey = ev.date?.split('T')[0]
    if (!dateKey) continue
    if (!map[dateKey]) map[dateKey] = []
    map[dateKey].push(ev)
  }
  return map
}

export function useEventsData(): UseEventsDataResult {
  const [events, setEvents] = useState<TechEvent[]>([])
  const [eventsByDate, setEventsByDate] = useState<Record<string, TechEvent[]>>({})
  const [status, setStatus] = useState<Status>('loading')

  const fetchEvents = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/events?limit=200&sort=date&where[_status][equals]=published')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const docs = (data.docs || []).map((doc: Record<string, unknown>) => ({
        id: doc.id as string,
        title: doc.title as string,
        organizer: (doc.organizer as string) || '',
        date: (doc.date as string) || '',
        startTime: (doc.startTime as string) || '',
        endTime: (doc.endTime as string) || '',
        description: '', // Rich text — simplified for calendar display
        url: (doc.url as string) || '',
        location: (doc.location as string) || '',
        mapsUrl: (doc.mapsUrl as string) || '',
        modality: (doc.modality as string) || 'in-person',
        meetLink: (doc.meetLink as string) || '',
        image: doc.image as { url: string } | null,
        registerUrl: (doc.registerUrl as string) || '',
      }))
      setEvents(docs)
      setEventsByDate(groupByDate(docs))
      setStatus('fresh')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return { events, eventsByDate, status, refetch: fetchEvents }
}
```

- [ ] **Step 2: Copy and adapt interactive components from main**

For each of these already-React components, copy from main and apply these updates:

```bash
# Calendar
mkdir -p src/components/calendar
git show main:src/components/calendar/EventCalendar.tsx > src/components/calendar/EventCalendar.tsx
git show main:src/components/calendar/EventDetailModal.tsx > src/components/calendar/EventDetailModal.tsx
git show main:src/components/calendar/UpcomingEventsStrip.tsx > src/components/calendar/UpcomingEventsStrip.tsx
git show main:src/components/calendar/AddToCalendarButton.tsx > src/components/calendar/AddToCalendarButton.tsx

# Map
mkdir -p src/components/maps
git show main:src/components/maps/SinaloaMap.tsx > src/components/maps/SinaloaMap.tsx
git show main:src/components/sections/MapSection.tsx > src/components/sections/MapSection.tsx

# Directory filter
git show main:src/components/entries/DirectoryFilter.tsx > src/components/entries/DirectoryFilter.tsx

# Submit wizard
mkdir -p src/components/forms
git show main:src/components/forms/SubmitWizard.tsx > src/components/forms/SubmitWizard.tsx
```

**Updates to apply to ALL copied files:**
1. Ensure `"use client"` is at the top
2. Fix import paths:
   - `from "../../utils"` or `from "../utils"` → `from "@/lib/utils"`
   - `from "../../config"` or `from "../config"` → `from "@/config"`
   - `from "../../hooks/useEventsData"` or `from "../hooks/useEventsData"` → `from "@/hooks/useEventsData"`
   - `from "../ui/Button"` → `from "@/components/ui/Button"`
   - `from "../ui/Carousel"` → `from "@/components/ui/Carousel"`
   - All relative component imports → `@/components/...` absolute imports
3. In calendar components: the `isInPerson` boolean becomes `modality === 'in-person'`
4. In `DirectoryFilter.tsx`: URL navigation via `window.location` or `useRouter` — keep as-is since it uses client-side DOM filtering
5. In `SubmitWizard.tsx`: keep the n8n webhook URL from config. This works as-is since it's a client-side POST.

- [ ] **Step 3: Create Payload REST API route for events**

The `useEventsData` hook fetches from `/api/events`. Payload's REST API is already mounted at `(payload)/api/[...slug]/route.ts`, which handles `/api/events` automatically. Verify this works by checking that `http://localhost:3000/api/events` returns events data.

If the API route is inside `(payload)` route group, create a proxy:

Create `src/app/api/events/route.ts`:

```typescript
import { getPayloadClient } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'events',
    where: { _status: { equals: 'published' } },
    limit: parseInt(searchParams.get('limit') || '200'),
    sort: searchParams.get('sort') || 'date',
  })

  return NextResponse.json(result)
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/calendar/ src/components/maps/ src/components/entries/DirectoryFilter.tsx src/components/forms/ src/components/sections/MapSection.tsx src/hooks/useEventsData.ts src/app/api/events/
git commit -m "feat: port calendar, map, directory filter, and form components"
```

---

### Task 8: Build homepage

**Files:**
- Modify: `src/app/(frontend)/page.tsx`

- [ ] **Step 1: Build the full homepage**

Replace `src/app/(frontend)/page.tsx`:

```tsx
import { getPublishedEntries, getFeaturedEntries, getUpcomingEvents } from '@/lib/payload'
import { countByType, groupByCity, countByTypeAndCity } from '@/lib/utils'
import { FAQS, SITE_URL } from '@/config'

import { HeroSection } from '@/components/sections/HeroSection'
import { CategorySection } from '@/components/sections/CategorySection'
import { FeaturedSection } from '@/components/sections/FeaturedSection'
import { MapSection } from '@/components/sections/MapSection'
import { CalendarSection } from '@/components/sections/CalendarSection'
import { FaqSection } from '@/components/sections/FaqSection'
import { CtaSection } from '@/components/sections/CtaSection'
import { UpcomingEventsStrip } from '@/components/calendar/UpcomingEventsStrip'

export default async function HomePage() {
  const [entriesResult, featuredResult] = await Promise.all([
    getPublishedEntries(),
    getFeaturedEntries(),
  ])

  const allEntries = entriesResult.docs
  const counts = countByType(allEntries)
  const cityCounts = groupByCity(allEntries)
  const cityTypeCounts = countByTypeAndCity(allEntries)
  const featured = featuredResult.docs

  const totalEntries = Math.floor(allEntries.length / 5) * 5
  const homeDescription = `Explora ${totalEntries}+ startups, consultorías, comunidades y talento tech en Sinaloa.`

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Tech Atlas',
            url: SITE_URL,
            logo: `${SITE_URL}/android-chrome-512x512.png`,
            description: homeDescription,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }),
        }}
      />

      <HeroSection cityCounts={cityCounts} />

      <section className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <UpcomingEventsStrip />
        </div>
      </section>

      <CategorySection counts={counts} />
      <FeaturedSection entries={featured} />
      <MapSection cityCounts={cityCounts} cityTypeCounts={cityTypeCounts} />
      <CalendarSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(frontend\)/page.tsx
git commit -m "feat: build homepage with all sections and Payload data fetching"
```

---

### Task 9: Build directory pages

**Files:**
- Create: `src/app/(frontend)/directorio/page.tsx`
- Create: `src/app/(frontend)/directorio/[city]/page.tsx`
- Create: `src/components/entries/DirectoryGrid.tsx`

- [ ] **Step 1: Create the directory grid server component**

Create `src/components/entries/DirectoryGrid.tsx`:

```tsx
import { EntryCard } from './EntryCard'
import { flattenArray } from '@/lib/utils'

interface DirectoryGridProps {
  entries: Array<Record<string, unknown>>
}

export function DirectoryGrid({ entries }: DirectoryGridProps) {
  return (
    <div id="entries-grid" className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {entries.map((entry) => (
        <div
          key={entry.id as string}
          className="entry-item"
          data-type={entry.entryType as string}
          data-city={entry.city as string}
          data-name={(entry.name as string).toLowerCase()}
          data-date={entry.publishDate ? (entry.publishDate as string).slice(0, 10) : ''}
        >
          <EntryCard
            slug={entry.slug as string}
            name={entry.name as string}
            tagline={entry.tagline as string | undefined}
            entryType={entry.entryType as any}
            logo={entry.logo as any}
            coverImage={entry.coverImage as any}
            city={entry.city as string}
            tags={entry.tags as any}
          />
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create directory page**

Create `src/app/(frontend)/directorio/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { getPublishedEntries } from '@/lib/payload'
import { buildCityOptions } from '@/lib/utils'
import { ENTRY_TYPE_CONFIG } from '@/config'
import { DirectoryFilter } from '@/components/entries/DirectoryFilter'
import { DirectoryGrid } from '@/components/entries/DirectoryGrid'

export const metadata: Metadata = {
  title: 'Directorio',
}

export default async function DirectoryPage() {
  const result = await getPublishedEntries()
  const entries = result.docs
  const cities = buildCityOptions(entries)

  const typeLabels: Record<string, string> = Object.fromEntries(
    Object.entries(ENTRY_TYPE_CONFIG).map(([k, v]) => [k, v.labelPlural]),
  )
  const typeIcons: Record<string, string> = Object.fromEntries(
    Object.entries(ENTRY_TYPE_CONFIG).map(([k, v]) => [k, v.icon]),
  )

  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <DirectoryFilter
          typeLabels={typeLabels}
          typeIcons={typeIcons}
          cities={cities}
          totalCount={entries.length}
          pageSize={18}
        >
          <DirectoryGrid entries={entries} />
        </DirectoryFilter>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create city-filtered directory page**

Create `src/app/(frontend)/directorio/[city]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { getPublishedEntries } from '@/lib/payload'
import { buildCityOptions } from '@/lib/utils'
import { ENTRY_TYPE_CONFIG, ALL_CITY_IDS, getCityName } from '@/config'
import { DirectoryFilter } from '@/components/entries/DirectoryFilter'
import { DirectoryGrid } from '@/components/entries/DirectoryGrid'

export async function generateStaticParams() {
  return ALL_CITY_IDS.filter((id) => id !== 'global').map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  return { title: `Directorio — ${getCityName(city)}` }
}

export default async function CityDirectoryPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const result = await getPublishedEntries()
  const entries = result.docs
  const cities = buildCityOptions(entries)

  const typeLabels: Record<string, string> = Object.fromEntries(
    Object.entries(ENTRY_TYPE_CONFIG).map(([k, v]) => [k, v.labelPlural]),
  )
  const typeIcons: Record<string, string> = Object.fromEntries(
    Object.entries(ENTRY_TYPE_CONFIG).map(([k, v]) => [k, v.icon]),
  )

  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <DirectoryFilter
          typeLabels={typeLabels}
          typeIcons={typeIcons}
          cities={cities}
          totalCount={entries.length}
          initialCity={city}
          pageSize={18}
        >
          <DirectoryGrid entries={entries} />
        </DirectoryFilter>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/entries/DirectoryGrid.tsx src/app/\(frontend\)/directorio/
git commit -m "feat: build directory pages with city filtering and static generation"
```

---

### Task 10: Build category + entry detail pages

**Files:**
- Create: `src/app/(frontend)/[category]/page.tsx`
- Create: `src/app/(frontend)/[category]/[slug]/page.tsx`

- [ ] **Step 1: Create category listing page**

Create `src/app/(frontend)/[category]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { getPublishedEntries } from '@/lib/payload'
import { buildCityOptions } from '@/lib/utils'
import { ENTRY_TYPE_CONFIG, URL_CATEGORY_MAP, type AtlasEntryType } from '@/config'
import { DirectoryFilter } from '@/components/entries/DirectoryFilter'
import { DirectoryGrid } from '@/components/entries/DirectoryGrid'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return Object.values(ENTRY_TYPE_CONFIG).map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const entryType = URL_CATEGORY_MAP[category]
  if (!entryType) return { title: 'Not Found' }
  return { title: ENTRY_TYPE_CONFIG[entryType].labelPlural }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const entryType = URL_CATEGORY_MAP[category] as AtlasEntryType | undefined
  if (!entryType) notFound()

  const config = ENTRY_TYPE_CONFIG[entryType]
  const result = await getPublishedEntries()
  const allEntries = result.docs
  const categoryEntries = allEntries.filter((e) => e.entryType === entryType)
  const cities = buildCityOptions(categoryEntries)

  const typeLabels: Record<string, string> = Object.fromEntries(
    Object.entries(ENTRY_TYPE_CONFIG).map(([k, v]) => [k, v.labelPlural]),
  )
  const typeIcons: Record<string, string> = Object.fromEntries(
    Object.entries(ENTRY_TYPE_CONFIG).map(([k, v]) => [k, v.icon]),
  )

  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <DirectoryFilter
          typeLabels={typeLabels}
          typeIcons={typeIcons}
          cities={cities}
          totalCount={allEntries.length}
          initialType={entryType}
          pageSize={18}
        >
          <DirectoryGrid entries={allEntries} />
        </DirectoryFilter>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create entry detail page**

This is the most complex page. Retrieve the old version from `git show main:src/pages/[category]/[slug].astro` as reference for the layout and suggestion algorithm.

Create `src/app/(frontend)/[category]/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getEntryBySlug, getPublishedEntries } from '@/lib/payload'
import { buildTrackedUrl, flattenArray } from '@/lib/utils'
import {
  ENTRY_TYPE_CONFIG,
  URL_CATEGORY_MAP,
  CATEGORY_URL_MAP,
  getCityName,
  SITE_URL,
  type AtlasEntryType,
} from '@/config'
import { EntryBadge } from '@/components/entries/EntryBadge'
import { EntryCard } from '@/components/entries/EntryCard'
import { Tag } from '@/components/ui/Tag'
import { ShareButton } from '@/components/ui/ShareButton'
import { ExternalLink } from '@/components/ui/ExternalLink'
import {
  Globe, MapPin, Calendar, Users2, Layers, Wrench, Code2, Briefcase,
  Heart, GraduationCap, Mail, Link2,
} from 'lucide-react'

export async function generateStaticParams() {
  const result = await getPublishedEntries()
  return result.docs.map((entry) => ({
    category: CATEGORY_URL_MAP[entry.entryType as AtlasEntryType],
    slug: entry.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const entry = await getEntryBySlug(slug)
  if (!entry) return { title: 'Not Found' }
  return {
    title: entry.name as string,
    description: (entry.tagline as string) || undefined,
  }
}

export default async function EntryDetailPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const entryType = URL_CATEGORY_MAP[category] as AtlasEntryType | undefined
  if (!entryType) notFound()

  const entry = await getEntryBySlug(slug)
  if (!entry || entry.entryType !== entryType) notFound()

  // Suggestion algorithm: same type > same city > random, max 3
  const allResult = await getPublishedEntries()
  const others = allResult.docs.filter((e) => e.id !== entry.id)
  const sameType = others.filter((e) => e.entryType === entry.entryType)
  const sameCity = others.filter((e) => e.city === entry.city)
  const suggestions: typeof others = []
  for (const e of sameType) { if (suggestions.length < 3 && !suggestions.includes(e)) suggestions.push(e) }
  for (const e of sameCity) { if (suggestions.length < 3 && !suggestions.includes(e)) suggestions.push(e) }
  for (const e of others) { if (suggestions.length < 3 && !suggestions.includes(e)) suggestions.push(e) }

  const config = ENTRY_TYPE_CONFIG[entry.entryType as AtlasEntryType]
  const tags = flattenArray(entry.tags as Array<{ tag: string }>, 'tag')
  const technologies = flattenArray(entry.technologies as Array<{ technology: string }>, 'technology')
  const services = flattenArray(entry.services as Array<{ service: string }>, 'service')
  const skills = flattenArray(entry.skills as Array<{ skill: string }>, 'skill')
  const focusAreas = flattenArray(entry.focusAreas as Array<{ area: string }>, 'area')

  const coverUrl = (entry.coverImage as { url: string } | null)?.url
  const logoUrl = (entry.logo as { url: string } | null)?.url
  const isStartupLike = ['startup', 'business', 'consultory'].includes(entry.entryType as string)

  return (
    <article className="py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs font-mono text-muted mb-6 uppercase">
          <a href="/" className="hover:text-accent transition-colors">Inicio</a>
          <span className="mx-2">/</span>
          <a href={`/${config.slug}`} className="hover:text-accent transition-colors">{config.labelPlural}</a>
          <span className="mx-2">/</span>
          <span className="text-primary">{entry.name as string}</span>
        </nav>

        {/* Cover image */}
        {coverUrl && (
          <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
            <img src={coverUrl} alt={entry.name as string} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          {logoUrl && (
            <img src={logoUrl} alt={entry.name as string} className="w-16 h-16 rounded-lg object-contain border border-border bg-card p-1" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <EntryBadge entryType={entry.entryType as AtlasEntryType} />
              {entry.verified && <span className="text-2xs font-mono text-accent">Verificado</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">{entry.name as string}</h1>
            {entry.tagline && <p className="text-secondary mt-1">{entry.tagline as string}</p>}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted font-mono">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{getCityName(entry.city as string)}</span>
              {entry.foundedYear && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{entry.foundedYear as number}</span>}
            </div>
          </div>
          <ShareButton url={`${SITE_URL}/${config.slug}/${entry.slug}`} title={entry.name as string} />
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2 mb-6">
          {entry.website && (
            <ExternalLink href={buildTrackedUrl(entry.website as string, entry.slug as string)} className="flex items-center gap-1 text-xs font-mono text-accent hover:underline">
              <Globe className="w-3.5 h-3.5" /> Sitio web
            </ExternalLink>
          )}
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {isStartupLike && entry.stage && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Etapa</p>
              <p className="text-sm text-primary font-medium">{entry.stage as string}</p>
            </div>
          )}
          {isStartupLike && entry.teamSize && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Equipo</p>
              <p className="text-sm text-primary font-medium flex items-center gap-1"><Users2 className="w-3.5 h-3.5" />{entry.teamSize as string}</p>
            </div>
          )}
          {isStartupLike && entry.sector && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Sector</p>
              <p className="text-sm text-primary font-medium">{entry.sector as string}</p>
            </div>
          )}
          {isStartupLike && entry.businessModel && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Modelo</p>
              <p className="text-sm text-primary font-medium">{entry.businessModel as string}</p>
            </div>
          )}
          {entry.entryType === 'community' && entry.meetupFrequency && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Frecuencia</p>
              <p className="text-sm text-primary font-medium">{entry.meetupFrequency as string}</p>
            </div>
          )}
          {entry.entryType === 'person' && entry.role && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Rol</p>
              <p className="text-sm text-primary font-medium">{entry.role as string}</p>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-6">
            {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        )}

        {/* Technologies / Services / Skills / Focus Areas */}
        {technologies.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-mono text-muted mb-2 flex items-center gap-1"><Code2 className="w-3 h-3" /> Tecnologías</p>
            <div className="flex flex-wrap gap-1">{technologies.map((t) => <Tag key={t}>{t}</Tag>)}</div>
          </div>
        )}
        {services.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-mono text-muted mb-2 flex items-center gap-1"><Wrench className="w-3 h-3" /> Servicios</p>
            <div className="flex flex-wrap gap-1">{services.map((s) => <Tag key={s}>{s}</Tag>)}</div>
          </div>
        )}
        {skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-mono text-muted mb-2 flex items-center gap-1"><Layers className="w-3 h-3" /> Habilidades</p>
            <div className="flex flex-wrap gap-1">{skills.map((s) => <Tag key={s}>{s}</Tag>)}</div>
          </div>
        )}
        {focusAreas.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-mono text-muted mb-2">Áreas de enfoque</p>
            <div className="flex flex-wrap gap-1">{focusAreas.map((a) => <Tag key={a}>{a}</Tag>)}</div>
          </div>
        )}

        {/* Body */}
        {entry.body && (
          <div className="prose prose-sm dark:prose-invert max-w-none mt-8 mb-8">
            <RichText data={entry.body as any} />
          </div>
        )}

        {/* Hiring banner */}
        {isStartupLike && entry.hiring && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-8">
            <p className="text-sm font-medium text-accent flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Estamos contratando
            </p>
            {entry.hiringUrl && (
              <ExternalLink href={entry.hiringUrl as string} className="text-xs text-accent underline mt-1 inline-block">
                Ver vacantes
              </ExternalLink>
            )}
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-primary mb-4">Mira más</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((s) => (
                <EntryCard
                  key={s.id as string}
                  slug={s.slug as string}
                  name={s.name as string}
                  tagline={s.tagline as string | undefined}
                  entryType={s.entryType as AtlasEntryType}
                  logo={s.logo as any}
                  coverImage={s.coverImage as any}
                  city={s.city as string}
                  tags={s.tags as any}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(frontend\)/\[category\]/
git commit -m "feat: build category listing and entry detail pages with static generation"
```

---

### Task 11: Build events page

**Files:**
- Create: `src/app/(frontend)/eventos/page.tsx`

- [ ] **Step 1: Create events page**

Create `src/app/(frontend)/eventos/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { CalendarSection } from '@/components/sections/CalendarSection'
import { EventsHeroSection } from '@/components/sections/EventsHeroSection'

export const metadata: Metadata = {
  title: 'Eventos Tech en Sinaloa',
  description: 'Meetups, talleres, hackatones y conferencias tech en Sinaloa, México.',
}

export default function EventosPage() {
  return (
    <>
      <EventsHeroSection />
      <CalendarSection />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(frontend\)/eventos/
git commit -m "feat: build events page"
```

---

### Task 12: Build news pages

**Files:**
- Create: `src/app/(frontend)/noticias/page.tsx`
- Create: `src/app/(frontend)/noticias/[slug]/page.tsx`

- [ ] **Step 1: Create news listing page**

Create `src/app/(frontend)/noticias/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedNews } from '@/lib/payload'
import { SectionHeading } from '@/components/ui/SectionHeading'

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Noticias del ecosistema tecnológico de Sinaloa.',
}

export default async function NoticiasPage() {
  const result = await getPublishedNews()
  const articles = result.docs

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading>Noticias</SectionHeading>
        <h1 className="text-3xl font-bold text-primary mb-8">Noticias del ecosistema tech</h1>

        {articles.length === 0 && (
          <p className="text-muted text-sm">No hay noticias publicadas aún.</p>
        )}

        <div className="space-y-6">
          {articles.map((article) => {
            const coverUrl = (article.coverImage as { url: string } | null)?.url
            return (
              <Link
                key={article.id}
                href={`/noticias/${article.slug}`}
                className="block bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row">
                  {coverUrl && (
                    <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                      <img src={coverUrl} alt={article.title as string} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-4 flex-1">
                    <p className="text-2xs font-mono text-muted mb-1">
                      {new Date(article.publishDate as string).toLocaleDateString('es-MX', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                    <h2 className="text-lg font-semibold text-primary mb-1">{article.title as string}</h2>
                    {article.excerpt && (
                      <p className="text-sm text-secondary line-clamp-2">{article.excerpt as string}</p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create news detail page**

Create `src/app/(frontend)/noticias/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getNewsBySlug, getPublishedNews } from '@/lib/payload'
import { SectionHeading } from '@/components/ui/SectionHeading'

export async function generateStaticParams() {
  const result = await getPublishedNews()
  return result.docs.map((article) => ({ slug: article.slug as string }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsBySlug(slug)
  if (!article) return { title: 'Not Found' }
  return {
    title: article.title as string,
    description: (article.excerpt as string) || undefined,
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getNewsBySlug(slug)
  if (!article) notFound()

  const coverUrl = (article.coverImage as { url: string } | null)?.url
  const authorName = (article.author as { displayName?: string; email: string } | null)?.displayName || (article.author as { email: string } | null)?.email

  return (
    <article className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <nav className="text-xs font-mono text-muted mb-6 uppercase">
          <a href="/" className="hover:text-accent transition-colors">Inicio</a>
          <span className="mx-2">/</span>
          <a href="/noticias" className="hover:text-accent transition-colors">Noticias</a>
          <span className="mx-2">/</span>
          <span className="text-primary">{article.title as string}</span>
        </nav>

        {coverUrl && (
          <div className="rounded-lg overflow-hidden mb-6 h-64">
            <img src={coverUrl} alt={article.title as string} className="w-full h-full object-cover" />
          </div>
        )}

        <SectionHeading>
          {new Date(article.publishDate as string).toLocaleDateString('es-MX', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
          {authorName && ` — ${authorName}`}
        </SectionHeading>

        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">{article.title as string}</h1>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <RichText data={article.body as any} />
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(frontend\)/noticias/
git commit -m "feat: build news listing and detail pages"
```

---

### Task 13: Build job board pages

**Files:**
- Create: `src/app/(frontend)/empleos/page.tsx`
- Create: `src/app/(frontend)/empleos/[slug]/page.tsx`

- [ ] **Step 1: Create job board listing**

Create `src/app/(frontend)/empleos/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getActiveJobs } from '@/lib/payload'
import { getCityName } from '@/config'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { flattenArray } from '@/lib/utils'
import { MapPin, Clock, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Empleos',
  description: 'Ofertas de empleo y oportunidades en el ecosistema tech de Sinaloa.',
}

const typeLabels: Record<string, string> = {
  'full-time': 'Tiempo completo',
  'part-time': 'Medio tiempo',
  contract: 'Contrato',
  freelance: 'Freelance',
  volunteer: 'Voluntariado',
}

const modalityLabels: Record<string, string> = {
  remote: 'Remoto',
  'in-person': 'Presencial',
  hybrid: 'Híbrido',
}

export const dynamic = 'force-dynamic' // Jobs page is always fresh

export default async function EmpleosPage() {
  const result = await getActiveJobs()
  const jobs = result.docs

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading>Empleos</SectionHeading>
        <h1 className="text-3xl font-bold text-primary mb-2">Bolsa de trabajo</h1>
        <p className="text-secondary text-sm mb-8">Oportunidades en el ecosistema tech de Sinaloa.</p>

        {jobs.length === 0 && (
          <p className="text-muted text-sm">No hay ofertas de empleo activas.</p>
        )}

        <div className="space-y-4">
          {jobs.map((job) => {
            const tags = flattenArray(job.tags as Array<{ tag: string }>, 'tag')
            const entryName = (job.entry as { name: string } | null)?.name
            return (
              <Link
                key={job.id}
                href={`/empleos/${job.slug}`}
                className="block bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-primary">{job.title as string}</h2>
                    {entryName && <p className="text-xs text-muted font-mono mt-0.5">{entryName}</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted font-mono">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {typeLabels[job.type as string] || job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {modalityLabels[job.modality as string] || job.modality}
                      </span>
                      {job.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {getCityName(job.city as string)}
                        </span>
                      )}
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.slice(0, 4).map((tag) => <Tag key={tag} className="text-[10px]">{tag}</Tag>)}
                      </div>
                    )}
                  </div>
                  {job.compensation && (
                    <span className="text-sm font-mono font-medium text-accent whitespace-nowrap">
                      {job.compensation as string}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create job detail page**

Create `src/app/(frontend)/empleos/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getJobBySlug } from '@/lib/payload'
import { getCityName } from '@/config'
import { flattenArray } from '@/lib/utils'
import { Tag } from '@/components/ui/Tag'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { MapPin, Clock, Briefcase, ExternalLink as LinkIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  if (!job) return { title: 'Not Found' }
  return { title: `${job.title} — Empleos` }
}

const typeLabels: Record<string, string> = {
  'full-time': 'Tiempo completo',
  'part-time': 'Medio tiempo',
  contract: 'Contrato',
  freelance: 'Freelance',
  volunteer: 'Voluntariado',
}

const modalityLabels: Record<string, string> = {
  remote: 'Remoto',
  'in-person': 'Presencial',
  hybrid: 'Híbrido',
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  if (!job) notFound()

  const tags = flattenArray(job.tags as Array<{ tag: string }>, 'tag')
  const entryName = (job.entry as { name: string } | null)?.name
  const entrySlug = (job.entry as { slug: string; entryType: string } | null)

  return (
    <article className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <nav className="text-xs font-mono text-muted mb-6 uppercase">
          <a href="/" className="hover:text-accent transition-colors">Inicio</a>
          <span className="mx-2">/</span>
          <a href="/empleos" className="hover:text-accent transition-colors">Empleos</a>
          <span className="mx-2">/</span>
          <span className="text-primary">{job.title as string}</span>
        </nav>

        <h1 className="text-3xl font-bold text-primary mb-2">{job.title as string}</h1>

        {entryName && (
          <p className="text-sm text-muted font-mono mb-4">
            Publicado por {entryName}
          </p>
        )}

        {/* Job metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-card border border-border rounded-lg p-3">
            <p className="text-2xs font-mono text-muted uppercase">Tipo</p>
            <p className="text-sm text-primary font-medium flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              {typeLabels[job.type as string] || job.type}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <p className="text-2xs font-mono text-muted uppercase">Modalidad</p>
            <p className="text-sm text-primary font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {modalityLabels[job.modality as string] || job.modality}
            </p>
          </div>
          {job.city && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Ubicación</p>
              <p className="text-sm text-primary font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {getCityName(job.city as string)}
              </p>
            </div>
          )}
          {job.compensation && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Compensación</p>
              <p className="text-sm text-accent font-medium">{job.compensation as string}</p>
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-6">
            {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        )}

        {/* Description */}
        <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
          <RichText data={job.description as any} />
        </div>

        {/* Apply CTA */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 text-center">
          <p className="text-sm text-primary font-medium mb-3">Interesado en esta oportunidad?</p>
          <ExternalLink
            href={job.contactUrl as string}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-md text-sm font-mono font-medium hover:bg-accent/90 transition-colors"
          >
            <LinkIcon className="w-4 h-4" /> Aplicar
          </ExternalLink>
        </div>

        {/* Expiry notice */}
        <p className="text-2xs text-muted font-mono mt-4 text-center">
          Esta oferta expira el {new Date(job.expiresAt as string).toLocaleDateString('es-MX', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>
    </article>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(frontend\)/empleos/
git commit -m "feat: build job board listing and detail pages"
```

---

### Task 14: Build submit page

**Files:**
- Create: `src/app/(frontend)/directorio/submit/page.tsx`

- [ ] **Step 1: Create submit page**

Create `src/app/(frontend)/directorio/submit/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { SubmitWizard } from '@/components/forms/SubmitWizard'
import { SINALOA_CITIES } from '@/config'

export const metadata: Metadata = {
  title: 'Agregar Proyecto',
}

export default function SubmitPage() {
  const cities = [
    { id: 'global', name: 'Global (sin ubicación específica)' },
    ...SINALOA_CITIES.map((m) => ({ id: m.id, name: m.name })),
  ]

  return (
    <section className="py-4 px-4">
      <div className="max-w-2xl mx-auto">
        <nav className="text-xs font-mono text-muted mb-6 uppercase">
          <a href="/" className="hover:text-accent transition-colors">Inicio</a>
          <span className="mx-2">/</span>
          <a href="/directorio" className="hover:text-accent transition-colors">Directorio</a>
          <span className="mx-2">/</span>
          <span className="text-primary">Agregar proyecto</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-sans font-bold text-primary mb-2">Agregar proyecto</h1>
        <p className="text-secondary mb-8">
          Registra tu startup, consultora, comunidad o perfil en el directorio tech de Sinaloa.
        </p>

        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 md:p-8">
          <SubmitWizard cities={cities} />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(frontend\)/directorio/submit/
git commit -m "feat: build submit page with SubmitWizard form"
```

---

### Task 15: MatrixBackground + final homepage polish

**Files:**
- Create: `src/components/layout/MatrixBackground.tsx`
- Modify: `src/app/(frontend)/page.tsx` (add MatrixBackground)

- [ ] **Step 1: Port MatrixBackground**

Retrieve from `git show main:src/components/layout/MatrixBackground.astro`. This is a canvas-based animated background. Convert the inline `<script>` to a React component with `useEffect`.

Create `src/components/layout/MatrixBackground.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'

interface MatrixBackgroundProps {
  movementDirection?: 'up-left' | 'down-right'
  movementSpeed?: number
  highlight?: boolean
}

export function MatrixBackground({
  movementDirection = 'up-left',
  movementSpeed = 0.04,
  highlight = false,
}: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let offsetX = 0
    let offsetY = 0
    const boxSize = 30
    const gap = 1

    function getColors() {
      const isDark = document.documentElement.classList.contains('dark')
      return {
        line: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)',
        bg: 'transparent',
      }
    }

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    function draw() {
      if (!canvas || !ctx) return
      const { line } = getColors()
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = line
      ctx.lineWidth = gap

      const startX = (offsetX % boxSize) - boxSize
      const startY = (offsetY % boxSize) - boxSize

      for (let x = startX; x < w + boxSize; x += boxSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = startY; y < h + boxSize; y += boxSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      const dx = movementDirection === 'up-left' ? -movementSpeed : movementSpeed
      const dy = movementDirection === 'up-left' ? -movementSpeed : movementSpeed
      offsetX += dx
      offsetY += dy

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [movementDirection, movementSpeed])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
      aria-hidden="true"
    />
  )
}
```

- [ ] **Step 2: Add MatrixBackground to the public layout**

Update `src/app/(frontend)/layout.tsx` to include the background:

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MatrixBackground } from '@/components/layout/MatrixBackground'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MatrixBackground movementDirection="up-left" movementSpeed={0.04} />
      <Header />
      <main id="main" className="flex-1 lg:px-20 xl:px-8">
        {children}
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/MatrixBackground.tsx src/app/\(frontend\)/layout.tsx
git commit -m "feat: port MatrixBackground and add to public layout"
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Homepage loads at `/` with all sections (hero, events strip, categories, featured, map, calendar, FAQ, CTA)
- [ ] Directory at `/directorio` shows all entries with filtering
- [ ] City-filtered directory at `/directorio/culiacan` works
- [ ] Category pages at `/startups`, `/comunidades`, etc. load correctly
- [ ] Entry detail at `/startups/operia` renders with all fields, suggestions, rich text body
- [ ] Events page at `/eventos` shows calendar
- [ ] News listing at `/noticias` shows published articles
- [ ] News detail at `/noticias/[slug]` renders rich text body
- [ ] Job board at `/empleos` lists active jobs (dynamic, not cached)
- [ ] Job detail at `/empleos/[slug]` renders with apply CTA
- [ ] Submit form at `/directorio/submit` renders the wizard
- [ ] Dark/light theme toggle works across all pages
- [ ] Header navigation (desktop dropdown, mobile menu) works
- [ ] Static generation works for entry/category/news pages (`generateStaticParams`)
- [ ] 404 page renders for invalid routes

---

## Next Plan

**Plan 3: Auth & User Features** — Set up better-auth with Google provider, user dashboard, submission flow via authenticated API routes, moderation workflow in Payload admin. Reference `.agents/skills/better-auth-best-practices/SKILL.md` and `.agents/skills/create-auth-skill/SKILL.md` for implementation patterns.
