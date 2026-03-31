# Client-Side Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace server-side "fetch all" with paginated API routes and a shared `PaginatedView` component for entries, news, and jobs.

**Architecture:** New GET route handlers wrap Payload's `find()` with query params for page/limit/sort/filters. A generic `PaginatedView` client component handles fetching, shimmer loading states, and pagination controls. Listing pages become static shells that delegate rendering to `PaginatedView`.

**Tech Stack:** Next.js 15 Route Handlers, Payload CMS `find()`, React client components, Tailwind CSS

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/lib/api.ts` | `PaginatedResponse<T>` type + `fetchPaginated()` client utility |
| `src/app/api/entries/route.ts` | Paginated entries endpoint with entryType/city/sort filters |
| `src/app/api/entries/counts/route.ts` | Lightweight counts-by-city and counts-by-type for sidebar |
| `src/app/api/news/route.ts` | Paginated news endpoint |
| `src/app/api/jobs/route.ts` | Paginated active jobs endpoint |
| `src/components/ui/PaginatedView.tsx` | Generic paginated list with shimmer + pagination controls |
| `src/components/entries/EntryCardSkeleton.tsx` | Shimmer matching `EntryCard` layout |
| `src/components/entries/NewsCardSkeleton.tsx` | Shimmer matching news card layout |
| `src/components/entries/JobCardSkeleton.tsx` | Shimmer matching job card layout |
| `src/components/entries/RandomEntries.tsx` | "Ver más" — fetches 3 random entries |
| `src/components/entries/DirectoryFilter.tsx` | Refactored: sidebar only, accepts counts, controls URL params |
| `src/app/(frontend)/directorio/page.tsx` | Static shell + PaginatedView |
| `src/app/(frontend)/directorio/[city]/page.tsx` | Static shell + PaginatedView |
| `src/app/(frontend)/[category]/page.tsx` | Static shell + PaginatedView |
| `src/app/(frontend)/noticias/page.tsx` | Static shell + PaginatedView |
| `src/app/(frontend)/empleos/page.tsx` | Static shell + PaginatedView |

---

### Task 1: Shared API types and client utility

**Files:**
- Create: `src/lib/api.ts`

- [ ] **Step 1: Create `src/lib/api.ts`**

```ts
export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function fetchPaginated<T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<PaginatedResponse<T>> {
  const url = new URL(endpoint, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value)
    }
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to `src/lib/api.ts`

- [ ] **Step 3: Commit**

```bash
git add src/lib/api.ts
git commit -m "feat: add PaginatedResponse type and fetchPaginated client utility"
```

---

### Task 2: Entries API route

**Files:**
- Create: `src/app/api/entries/route.ts`

- [ ] **Step 1: Create the entries API route**

```ts
import { getPayloadClient } from '@/lib/payload'
import { NextResponse, type NextRequest } from 'next/server'

const SORT_MAP: Record<string, string> = {
  'name-asc': 'name',
  'name-desc': '-name',
  'date-desc': '-publishDate',
  'date-asc': 'publishDate',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '18', 10)), 100)
    const sortKey = searchParams.get('sort') || 'date-desc'
    const sort = SORT_MAP[sortKey] || '-publishDate'
    const entryType = searchParams.get('entryType')
    const city = searchParams.get('city')

    const where: Record<string, unknown> = {
      _status: { equals: 'published' },
    }
    if (entryType) where.entryType = { equals: entryType }
    if (city) where.city = { equals: city }

    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'entries',
      where,
      page,
      limit,
      sort,
    })

    return NextResponse.json({
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    })
  } catch (error) {
    console.error('Entries API failed:', error)
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Test the route manually**

Run: `curl -s "http://localhost:3000/api/entries?limit=2" | npx json docs.length totalPages page`
Expected: Returns `2`, a totalPages number > 0, and `1`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/entries/route.ts
git commit -m "feat: add paginated entries API route"
```

---

### Task 3: Entries counts API route

**Files:**
- Create: `src/app/api/entries/counts/route.ts`

- [ ] **Step 1: Create the counts endpoint**

```ts
import { getPayloadClient } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'entries',
      where: { _status: { equals: 'published' } },
      limit: 0,
      pagination: false,
    })

    const byCity: Record<string, number> = {}
    const byType: Record<string, number> = {}

    for (const doc of result.docs) {
      const city = doc.city as string
      const type = doc.entryType as string
      byCity[city] = (byCity[city] || 0) + 1
      byType[type] = (byType[type] || 0) + 1
    }

    return NextResponse.json({
      byCity,
      byType,
      total: result.totalDocs,
    })
  } catch (error) {
    console.error('Entries counts API failed:', error)
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Test the route manually**

Run: `curl -s "http://localhost:3000/api/entries/counts" | npx json total`
Expected: Returns total count number

- [ ] **Step 3: Commit**

```bash
git add src/app/api/entries/counts/route.ts
git commit -m "feat: add entries counts API route for sidebar"
```

---

### Task 4: News API route

**Files:**
- Create: `src/app/api/news/route.ts`

- [ ] **Step 1: Create the news API route**

```ts
import { getPayloadClient } from '@/lib/payload'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '12', 10)), 100)
    const sortParam = searchParams.get('sort') || 'date-desc'
    const sort = sortParam === 'date-asc' ? 'publishDate' : '-publishDate'

    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'news',
      where: { _status: { equals: 'published' } },
      page,
      limit,
      sort,
    })

    return NextResponse.json({
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    })
  } catch (error) {
    console.error('News API failed:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Test the route manually**

Run: `curl -s "http://localhost:3000/api/news?limit=2" | npx json docs.length page`
Expected: Returns `2` and `1`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/news/route.ts
git commit -m "feat: add paginated news API route"
```

---

### Task 5: Jobs API route

**Files:**
- Create: `src/app/api/jobs/route.ts`

- [ ] **Step 1: Create the jobs API route**

Note: There is an existing `src/app/api/submissions/jobs/route.ts` for job submissions. This is a separate public read endpoint.

```ts
import { getPayloadClient } from '@/lib/payload'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '12', 10)), 100)
    const sortParam = searchParams.get('sort') || 'date-desc'
    const sort = sortParam === 'date-asc' ? 'createdAt' : '-createdAt'

    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'jobs',
      where: {
        _status: { equals: 'published' },
        expiresAt: { greater_than: new Date().toISOString() },
      },
      page,
      limit,
      sort,
    })

    return NextResponse.json({
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    })
  } catch (error) {
    console.error('Jobs API failed:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Test the route manually**

Run: `curl -s "http://localhost:3000/api/jobs?limit=2" | npx json docs.length page`
Expected: Returns count and `1`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/jobs/route.ts
git commit -m "feat: add paginated jobs API route"
```

---

### Task 6: Skeleton components

**Files:**
- Create: `src/components/entries/EntryCardSkeleton.tsx`
- Create: `src/components/entries/NewsCardSkeleton.tsx`
- Create: `src/components/entries/JobCardSkeleton.tsx`

- [ ] **Step 1: Create `EntryCardSkeleton`**

Matches the layout of `src/components/entries/EntryCard.tsx` (136px cover, badge area, name, tagline, city, tags).

```tsx
export function EntryCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-card/90 border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="h-36 bg-elevated" />
      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <div className="h-4 w-3/4 bg-elevated rounded" />
        <div className="h-3 w-full bg-elevated rounded" />
        <div className="h-3 w-1/3 bg-elevated rounded mt-2" />
        <div className="flex gap-1 mt-auto pt-2">
          <div className="h-4 w-12 bg-elevated rounded" />
          <div className="h-4 w-16 bg-elevated rounded" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `NewsCardSkeleton`**

Matches the news card in `src/app/(frontend)/noticias/page.tsx` (horizontal card with image left, text right).

```tsx
export function NewsCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-40 sm:h-auto bg-elevated flex-shrink-0" />
        <div className="p-4 flex-1 space-y-2">
          <div className="h-3 w-24 bg-elevated rounded" />
          <div className="h-5 w-3/4 bg-elevated rounded" />
          <div className="h-3 w-full bg-elevated rounded" />
          <div className="h-3 w-2/3 bg-elevated rounded" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `JobCardSkeleton`**

Matches the job card in `src/app/(frontend)/empleos/page.tsx` (title, company, meta row, tags).

```tsx
export function JobCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 bg-elevated rounded" />
          <div className="h-3 w-1/4 bg-elevated rounded" />
          <div className="flex gap-3 mt-2">
            <div className="h-3 w-20 bg-elevated rounded" />
            <div className="h-3 w-16 bg-elevated rounded" />
            <div className="h-3 w-16 bg-elevated rounded" />
          </div>
          <div className="flex gap-1 mt-2">
            <div className="h-4 w-12 bg-elevated rounded" />
            <div className="h-4 w-14 bg-elevated rounded" />
          </div>
        </div>
        <div className="h-4 w-16 bg-elevated rounded" />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify types compile**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/entries/EntryCardSkeleton.tsx src/components/entries/NewsCardSkeleton.tsx src/components/entries/JobCardSkeleton.tsx
git commit -m "feat: add shimmer skeleton components for entries, news, and jobs"
```

---

### Task 7: `PaginatedView` component

**Files:**
- Create: `src/components/ui/PaginatedView.tsx`

- [ ] **Step 1: Create the `PaginatedView` component**

This component handles: fetching via `fetchPaginated`, shimmer loading, pagination controls, URL sync, and scroll-to-top.

```tsx
'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react'
import { fetchPaginated, type PaginatedResponse } from '@/lib/api'

interface PaginatedViewProps<T> {
  endpoint: string
  params?: Record<string, string>
  renderItem: (item: T) => ReactNode
  renderSkeleton: () => ReactNode
  skeletonCount?: number
  layout?: 'grid' | 'list'
  gridCols?: string
  emptyMessage?: string
  pageSize?: number
  scrollTargetId?: string
}

export function PaginatedView<T extends { id: string | number }>({
  endpoint,
  params,
  renderItem,
  renderSkeleton,
  skeletonCount,
  layout = 'grid',
  gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  emptyMessage = 'No se encontraron resultados.',
  pageSize = 18,
  scrollTargetId,
}: PaginatedViewProps<T>) {
  const [data, setData] = useState<PaginatedResponse<T> | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === 'undefined') return 1
    const p = parseInt(new URLSearchParams(window.location.search).get('page') || '1', 10)
    return p > 0 ? p : 1
  })

  const effectiveSkeletonCount = skeletonCount ?? pageSize

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true)
      try {
        const result = await fetchPaginated<T>(endpoint, {
          ...params,
          page: String(page),
          limit: String(pageSize),
        })
        setData(result)
      } catch (err) {
        console.error('PaginatedView fetch error:', err)
        setData(null)
      } finally {
        setLoading(false)
      }
    },
    [endpoint, params, pageSize],
  )

  useEffect(() => {
    fetchData(currentPage)
  }, [fetchData, currentPage])

  function handlePageChange(page: number) {
    setCurrentPage(page)
    const url = new URL(window.location.href)
    if (page <= 1) url.searchParams.delete('page')
    else url.searchParams.set('page', String(page))
    window.history.pushState({}, '', url.pathname + url.search)
    if (scrollTargetId) {
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Skeleton loading state
  if (loading) {
    const wrapperClass =
      layout === 'grid' ? `grid ${gridCols} gap-4` : 'space-y-4'
    return (
      <div className={wrapperClass}>
        {Array.from({ length: effectiveSkeletonCount }, (_, i) => (
          <div key={i}>{renderSkeleton()}</div>
        ))}
      </div>
    )
  }

  // Empty state
  if (!data || data.docs.length === 0) {
    return (
      <div className="text-center py-20">
        <SearchX className="w-12 h-12 mx-auto mb-4 text-muted opacity-40" strokeWidth={1.5} />
        <p className="text-muted font-mono text-sm">{emptyMessage}</p>
      </div>
    )
  }

  const wrapperClass =
    layout === 'grid' ? `grid ${gridCols} gap-4` : 'space-y-4'

  return (
    <div>
      <div className={wrapperClass}>
        {data.docs.map((item) => (
          <div key={item.id}>{renderItem(item)}</div>
        ))}
      </div>
      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

/* ── Pagination ── */

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  const btn =
    'inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 rounded text-sm font-mono transition-colors cursor-pointer'
  const active = 'bg-accent/15 text-accent border border-accent/30'
  const inactive = 'text-secondary hover:text-accent hover:bg-elevated border border-transparent'
  const disabled = 'text-muted/40 pointer-events-none border border-transparent'

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className={`${btn} ${currentPage <= 1 ? disabled : inactive}`}
        aria-label="Página anterior"
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-muted text-sm">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btn} ${p === currentPage ? active : inactive}`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        className={`${btn} ${currentPage >= totalPages ? disabled : inactive}`}
        aria-label="Página siguiente"
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/PaginatedView.tsx
git commit -m "feat: add generic PaginatedView component with shimmer and pagination"
```

---

### Task 8: Refactor directory pages

**Files:**
- Modify: `src/app/(frontend)/directorio/page.tsx`
- Modify: `src/app/(frontend)/directorio/[city]/page.tsx`
- Modify: `src/app/(frontend)/[category]/page.tsx`
- Modify: `src/components/entries/DirectoryFilter.tsx`

This is the largest task. The `DirectoryFilter` is refactored from a data-heavy component into a sidebar-only controller, and the three directory pages become static shells.

- [ ] **Step 1: Refactor `DirectoryFilter` to accept counts and control params**

Replace the entire content of `src/components/entries/DirectoryFilter.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import {
  SearchX,
  LayoutGrid,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react'
import {
  CATEGORY_URL_MAP,
  ENTRY_TYPE_LABELS,
  ENTRY_TYPE_ICONS,
  type AtlasEntryType,
} from '@/config'
import { ENTRY_TYPE_ICON_MAP } from '@/lib/icons'
import { PaginatedView } from '@/components/ui/PaginatedView'
import { EntryCardSkeleton } from './EntryCardSkeleton'
import type { Entry, Media } from '@/payload-types'
import { EntryCard } from './EntryCard'

/* ── Types ── */

interface CountsData {
  byCity: Record<string, number>
  byType: Record<string, number>
  total: number
}

interface CityInfo {
  id: string
  name: string
  count: number
}

type SortOption = 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc'

const DEFAULT_SORT: SortOption = 'date-desc'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date-desc', label: 'Más recientes' },
  { value: 'date-asc', label: 'Más antiguos' },
  { value: 'name-asc', label: 'Nombre A–Z' },
  { value: 'name-desc', label: 'Nombre Z–A' },
]

interface Props {
  cities: CityInfo[]
  initialType?: string
  initialCity?: string
  pageSize?: number
}

/* ── Helpers ── */

function typeToPath(type: string): string {
  const slug = CATEGORY_URL_MAP[type as AtlasEntryType]
  return slug ? `/${slug}` : '/directorio'
}

function getSortFromURL(): SortOption {
  if (typeof window === 'undefined') return DEFAULT_SORT
  const s = new URLSearchParams(window.location.search).get('sort')
  return SORT_OPTIONS.some((o) => o.value === s) ? (s as SortOption) : DEFAULT_SORT
}

function renderEntryItem(entry: Entry) {
  const logo = typeof entry.logo === 'object' && entry.logo !== null ? entry.logo as Media : null
  const coverImage = typeof entry.coverImage === 'object' && entry.coverImage !== null ? entry.coverImage as Media : null

  return (
    <div className="entry-item animate-in">
      <EntryCard
        slug={entry.slug}
        name={entry.name}
        tagline={entry.tagline ?? undefined}
        entryType={entry.entryType}
        logo={logo && logo.url ? { url: logo.url, alt: logo.alt } : null}
        coverImage={coverImage && coverImage.url ? { url: coverImage.url, alt: coverImage.alt } : null}
        city={entry.city}
        tags={entry.tags ?? undefined}
      />
    </div>
  )
}

/* ── DirectoryFilter ── */

export default function DirectoryFilter({
  cities,
  initialType = '',
  initialCity = '',
  pageSize = 18,
}: Props) {
  const [currentSort, setCurrentSort] = useState<SortOption>(DEFAULT_SORT)
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeType = initialType
  const activeCity = initialCity

  useEffect(() => {
    setCurrentSort(getSortFromURL())
  }, [])

  function navigate(type: string, city: string) {
    if (type) {
      window.location.href = typeToPath(type)
    } else if (city) {
      window.location.href = `/directorio/${city}`
    } else {
      window.location.href = '/directorio'
    }
  }

  function handleTypeClick(type: string) {
    navigate(type === activeType ? '' : type, '')
  }

  function handleCityClick(id: string) {
    navigate('', id === activeCity ? '' : id)
  }

  function clearFilters() {
    navigate('', '')
  }

  function handleSortChange(sort: SortOption) {
    setCurrentSort(sort)
    const url = new URL(window.location.href)
    url.searchParams.delete('page')
    if (sort === DEFAULT_SORT) url.searchParams.delete('sort')
    else url.searchParams.set('sort', sort)
    window.history.pushState({}, '', url.pathname + url.search)
  }

  const activeCityName = cities.find((m) => m.id === activeCity)?.name
  const activeTypeName = activeType ? ENTRY_TYPE_LABELS[activeType] : undefined
  const heading = activeCityName || activeTypeName || 'Ecosistema Sinaloa'

  const sortedCities = cities.filter((m) => m.count > 0).sort((a, b) => b.count - a.count)

  // Build API params
  const apiParams: Record<string, string> = { sort: currentSort }
  if (activeType) apiParams.entryType = activeType
  if (activeCity) apiParams.city = activeCity

  /* ── Shared sidebar content ── */
  const sidebarContent = (
    <>
      {/* Category filters */}
      <div>
        <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-3">Categorías</h3>
        <div className="space-y-1">
          <a
            href="/directorio"
            onClick={(e) => {
              e.preventDefault()
              clearFilters()
            }}
            className={`w-full flex items-center gap-2.5 py-2 px-3 rounded text-left transition-colors ${
              !activeType && !activeCity
                ? 'bg-accent/10 border-l-2 border-accent'
                : 'hover:bg-elevated'
            }`}
          >
            <LayoutGrid
              className={`w-4 h-4 shrink-0 ${
                !activeType && !activeCity ? 'text-accent' : 'text-muted'
              }`}
            />
            <span
              className={`text-sm ${
                !activeType && !activeCity ? 'text-accent font-medium' : 'text-primary'
              }`}
            >
              Todos
            </span>
          </a>

          {Object.entries(ENTRY_TYPE_LABELS).map(([type, label]) => {
            const IconComponent = ENTRY_TYPE_ICON_MAP[ENTRY_TYPE_ICONS[type]] || LayoutGrid
            const isActive = activeType === type
            return (
              <a
                key={type}
                href={typeToPath(type)}
                onClick={(e) => {
                  e.preventDefault()
                  handleTypeClick(type)
                }}
                className={`w-full flex items-center gap-2.5 py-2 px-3 rounded text-left transition-colors ${
                  isActive ? 'bg-accent/10 border-l-2 border-accent' : 'hover:bg-elevated'
                }`}
              >
                <IconComponent
                  className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent' : 'text-muted'}`}
                />
                <span
                  className={`text-sm ${isActive ? 'text-accent font-medium' : 'text-primary'}`}
                >
                  {label}
                </span>
              </a>
            )
          })}
        </div>
      </div>

      <hr className="border-border" />

      {/* City filters */}
      <div>
        <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-3">Municipios</h3>
        <div className="space-y-1">
          {sortedCities.map((mun) => (
            <button
              key={mun.id}
              onClick={() => handleCityClick(mun.id)}
              className={`w-full flex items-center justify-between py-2 px-3 rounded text-left transition-colors cursor-pointer ${
                activeCity === mun.id
                  ? 'bg-accent/10 border-l-2 border-accent'
                  : 'hover:bg-elevated'
              }`}
            >
              <span
                className={`text-sm ${
                  activeCity === mun.id ? 'text-accent font-medium' : 'text-primary'
                }`}
              >
                {mun.name}
              </span>
              <span className="text-xs font-mono text-muted">{mun.count}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-border" />

      {/* Sort options */}
      <div>
        <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-3">Ordenar</h3>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => {
            const isActive = currentSort === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={`w-full flex items-center gap-2.5 py-2 px-3 rounded text-left transition-colors cursor-pointer ${
                  isActive ? 'bg-accent/10 border-l-2 border-accent' : 'hover:bg-elevated'
                }`}
              >
                <ArrowUpDown
                  className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent' : 'text-muted'}`}
                />
                <span
                  className={`text-sm ${isActive ? 'text-accent font-medium' : 'text-primary'}`}
                >
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )

  return (
    <div id="directory-top">
      {/* Breadcrumb */}
      <nav className="text-xs font-mono text-muted mb-4">
        <a href="/" className="hover:text-accent transition-colors">
          INICIO
        </a>
        <span className="mx-2">/</span>
        {activeCityName || activeTypeName ? (
          <>
            <button
              onClick={clearFilters}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              DIRECTORIO
            </button>
            <span className="mx-2">/</span>
            <span className="text-accent">
              {(activeCityName || activeTypeName || '').toUpperCase()}
            </span>
          </>
        ) : (
          <span className="text-primary">DIRECTORIO</span>
        )}
      </nav>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-sans font-bold text-primary">{heading}</h1>
      <p className="mt-2 text-secondary mb-6">
        Explora el directorio del ecosistema tech.
      </p>

      {/* Mobile filter panel */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-card/90 backdrop-blur-sm border border-border rounded-lg text-sm font-mono text-primary cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted" />
            Filtros
            {(activeType || activeCity) && (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-accent/20 text-accent">1</span>
            )}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted transition-transform duration-250 ${
              mobileOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div className={`collapse-grid ${mobileOpen ? 'open' : ''}`}>
          <div className="collapse-content">
            <div className="mt-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 space-y-4">
              {sidebarContent}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: sidebar + content grid */}
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 h-fit lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto space-y-4">
          {sidebarContent}
        </aside>

        {/* Content area */}
        <PaginatedView<Entry>
          endpoint="/api/entries"
          params={apiParams}
          renderItem={renderEntryItem}
          renderSkeleton={() => <EntryCardSkeleton />}
          layout="grid"
          gridCols="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          pageSize={pageSize}
          scrollTargetId="directory-top"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Refactor `/directorio/page.tsx`**

Replace `src/app/(frontend)/directorio/page.tsx`:

```tsx
import type { Metadata } from 'next'
import DirectoryFilter from '@/components/entries/DirectoryFilter'
import { SINALOA_CITIES } from '@/config'

export const metadata: Metadata = {
  title: 'Directorio',
  description: 'Explora el directorio completo del ecosistema tecnológico de Sinaloa. Startups, consultorías, comunidades y talento tech.',
}

const staticCities = SINALOA_CITIES.map((m) => ({ id: m.id, name: m.name, count: 0 }))

export default function DirectoryPage() {
  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <DirectoryFilter cities={staticCities} pageSize={18} />
      </div>
    </section>
  )
}
```

Note: City counts are now 0 in the static shell. A future enhancement could fetch counts client-side from `/api/entries/counts` within `DirectoryFilter`. For now, the counts endpoint exists but the sidebar shows static city names without counts until we wire that up.

- [ ] **Step 3: Refactor `/directorio/[city]/page.tsx`**

Replace `src/app/(frontend)/directorio/[city]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { ALL_CITY_IDS, getCityName, SINALOA_CITIES } from '@/config'
import DirectoryFilter from '@/components/entries/DirectoryFilter'

export async function generateStaticParams() {
  return ALL_CITY_IDS.filter((id) => id !== 'global').map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const cityName = getCityName(city)
  return {
    title: `Directorio — ${cityName}`,
    description: `Empresas, startups, comunidades y talento tech en ${cityName}, Sinaloa.`,
  }
}

const staticCities = SINALOA_CITIES.map((m) => ({ id: m.id, name: m.name, count: 0 }))

export default async function CityDirectoryPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params

  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <DirectoryFilter cities={staticCities} initialCity={city} pageSize={18} />
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Refactor `/[category]/page.tsx`**

Replace `src/app/(frontend)/[category]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { ENTRY_TYPE_CONFIG, URL_CATEGORY_MAP, SINALOA_CITIES, type AtlasEntryType } from '@/config'
import DirectoryFilter from '@/components/entries/DirectoryFilter'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return Object.values(ENTRY_TYPE_CONFIG).map((c) => ({ category: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const entryType = URL_CATEGORY_MAP[category]
  if (!entryType) return { title: 'Not Found' }
  return { title: ENTRY_TYPE_CONFIG[entryType].labelPlural }
}

const staticCities = SINALOA_CITIES.map((m) => ({ id: m.id, name: m.name, count: 0 }))

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const entryType = URL_CATEGORY_MAP[category] as AtlasEntryType | undefined
  if (!entryType) notFound()

  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <DirectoryFilter cities={staticCities} initialType={entryType} pageSize={18} />
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Verify types compile and dev server runs**

Run: `npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No errors

Run: `npm run dev` and visit `/directorio` — should see shimmer skeletons then entries load
Visit `/startups` — should show only startups
Visit `/directorio/culiacan` — should show only Culiacán entries

- [ ] **Step 6: Commit**

```bash
git add src/components/entries/DirectoryFilter.tsx src/app/\(frontend\)/directorio/page.tsx src/app/\(frontend\)/directorio/\[city\]/page.tsx src/app/\(frontend\)/\[category\]/page.tsx
git commit -m "refactor: directory pages use PaginatedView with API-driven pagination"
```

---

### Task 9: Refactor news page

**Files:**
- Modify: `src/app/(frontend)/noticias/page.tsx`

- [ ] **Step 1: Create a `NewsCard` component inline or extract from current page**

The news card rendering currently lives inline in the noticias page. We need it as a standalone component for `PaginatedView.renderItem`. Add to `src/app/(frontend)/noticias/page.tsx` as a client page:

Replace `src/app/(frontend)/noticias/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { SectionHeading } from '@/components/ui/SectionHeading'
import NoticiasContent from './NoticiasContent'

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Noticias del ecosistema tecnológico de Sinaloa.',
}

export default function NoticiasPage() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading>Noticias</SectionHeading>
        <h1 className="text-3xl font-bold text-primary mb-8">Noticias del ecosistema tech</h1>
        <NoticiasContent />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `NoticiasContent` client component**

Create `src/app/(frontend)/noticias/NoticiasContent.tsx`:

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PaginatedView } from '@/components/ui/PaginatedView'
import { NewsCardSkeleton } from '@/components/entries/NewsCardSkeleton'
import { formatDateEs, extractImageUrl } from '@/lib/format'
import type { News } from '@/payload-types'

function NewsCard({ article }: { article: News }) {
  const coverUrl = extractImageUrl(article.coverImage)
  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="block bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-colors"
    >
      <div className="flex flex-col sm:flex-row">
        {coverUrl && (
          <div className="relative sm:w-48 h-40 sm:h-auto flex-shrink-0">
            <Image src={coverUrl} alt={article.title as string} fill className="object-cover" sizes="192px" />
          </div>
        )}
        <div className="p-4 flex-1">
          <p className="text-2xs font-mono text-muted mb-1">
            {formatDateEs(article.publishDate as string)}
          </p>
          <h2 className="text-lg font-semibold text-primary mb-1">{article.title as string}</h2>
          {article.excerpt && (
            <p className="text-sm text-secondary line-clamp-2">{article.excerpt as string}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function NoticiasContent() {
  return (
    <PaginatedView<News>
      endpoint="/api/news"
      renderItem={(article) => <NewsCard article={article} />}
      renderSkeleton={() => <NewsCardSkeleton />}
      layout="list"
      pageSize={12}
      emptyMessage="No hay noticias publicadas aún."
    />
  )
}
```

- [ ] **Step 3: Verify noticias page works**

Run dev server and visit `/noticias` — should see shimmer then news articles with pagination

- [ ] **Step 4: Commit**

```bash
git add src/app/\(frontend\)/noticias/page.tsx src/app/\(frontend\)/noticias/NoticiasContent.tsx
git commit -m "refactor: noticias page uses PaginatedView with API pagination"
```

---

### Task 10: Refactor jobs page

**Files:**
- Modify: `src/app/(frontend)/empleos/page.tsx`

- [ ] **Step 1: Replace the empleos page with static shell**

Replace `src/app/(frontend)/empleos/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { SectionHeading } from '@/components/ui/SectionHeading'
import EmpleosContent from './EmpleosContent'

export const metadata: Metadata = {
  title: 'Empleos',
  description: 'Ofertas de empleo y oportunidades en el ecosistema tech de Sinaloa.',
}

export default function EmpleosPage() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading>Empleos</SectionHeading>
        <h1 className="text-3xl font-bold text-primary mb-2">Bolsa de trabajo</h1>
        <p className="text-secondary text-sm mb-8">Oportunidades en el ecosistema tech de Sinaloa.</p>
        <EmpleosContent />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `EmpleosContent` client component**

Create `src/app/(frontend)/empleos/EmpleosContent.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { MapPin, Clock, Briefcase } from 'lucide-react'
import { PaginatedView } from '@/components/ui/PaginatedView'
import { JobCardSkeleton } from '@/components/entries/JobCardSkeleton'
import { getCityName, JOB_TYPE_LABELS, MODALITY_LABELS } from '@/config'
import { flattenArray } from '@/lib/utils'
import { Tag } from '@/components/ui/Tag'
import type { Job } from '@/payload-types'

function JobCard({ job }: { job: Job }) {
  const tags = flattenArray(job.tags as Array<{ tag: string }>, 'tag')
  const entryName = (job.entry as { name: string } | null)?.name

  return (
    <Link
      href={`/empleos/${job.slug}`}
      className="block bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-base font-semibold text-primary">{job.title as string}</h2>
          {entryName && <p className="text-xs text-muted font-mono mt-0.5">{entryName}</p>}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted font-mono">
            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{JOB_TYPE_LABELS[job.type as string] || job.type}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{MODALITY_LABELS[job.modality as string] || job.modality}</span>
            {job.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{getCityName(job.city as string)}</span>}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 4).map((tag) => <Tag key={tag} className="text-[10px]">{tag}</Tag>)}
            </div>
          )}
        </div>
        {job.compensation && (
          <span className="text-sm font-mono font-medium text-accent whitespace-nowrap">{job.compensation as string}</span>
        )}
      </div>
    </Link>
  )
}

export default function EmpleosContent() {
  return (
    <PaginatedView<Job>
      endpoint="/api/jobs"
      renderItem={(job) => <JobCard job={job} />}
      renderSkeleton={() => <JobCardSkeleton />}
      layout="list"
      pageSize={12}
      emptyMessage="No hay ofertas de empleo activas."
    />
  )
}
```

- [ ] **Step 3: Verify empleos page works**

Run dev server and visit `/empleos` — should see shimmer then job listings with pagination

- [ ] **Step 4: Commit**

```bash
git add src/app/\(frontend\)/empleos/page.tsx src/app/\(frontend\)/empleos/EmpleosContent.tsx
git commit -m "refactor: empleos page uses PaginatedView with API pagination"
```

---

### Task 11: RandomEntries "Ver más" component

**Files:**
- Create: `src/components/entries/RandomEntries.tsx`

- [ ] **Step 1: Add `sort=random` support to entries API route**

Edit `src/app/api/entries/route.ts` — add random sort handling before the `payload.find` call:

After the existing `const sort = SORT_MAP[sortKey] || '-publishDate'` line, add handling for random. The full approach: when `sort=random`, fetch total count, pick 3 random offsets, fetch each.

Actually, simpler: fetch a larger set and pick randomly client-side. But the spec says the API handles it. Simplest server approach — fetch all IDs, shuffle, return N:

Update the route to handle `sort=random`:

```ts
// Add at the top of the GET handler, after parsing params:
if (sortKey === 'random') {
  const payload = await getPayloadClient()
  const all = await payload.find({
    collection: 'entries',
    where,
    limit: 0,
    pagination: false,
  })
  // Shuffle and pick `limit` entries
  const shuffled = all.docs.sort(() => Math.random() - 0.5).slice(0, limit)
  return NextResponse.json({
    docs: shuffled,
    totalDocs: shuffled.length,
    totalPages: 1,
    page: 1,
    hasNextPage: false,
    hasPrevPage: false,
  })
}
```

Add this block right after the `const city = ...` line and before the existing `const payload = await getPayloadClient()` line in the route handler.

- [ ] **Step 2: Create `RandomEntries` component**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { fetchPaginated } from '@/lib/api'
import { EntryCard } from './EntryCard'
import { EntryCardSkeleton } from './EntryCardSkeleton'
import type { Entry, Media } from '@/payload-types'

export function RandomEntries() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPaginated<Entry>('/api/entries', { limit: '3', sort: 'random' })
      .then((res) => setEntries(res.docs))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <EntryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (entries.length === 0) return null

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {entries.map((entry) => {
        const logo = typeof entry.logo === 'object' && entry.logo !== null ? entry.logo as Media : null
        const coverImage = typeof entry.coverImage === 'object' && entry.coverImage !== null ? entry.coverImage as Media : null

        return (
          <EntryCard
            key={entry.id}
            slug={entry.slug}
            name={entry.name}
            tagline={entry.tagline ?? undefined}
            entryType={entry.entryType}
            logo={logo && logo.url ? { url: logo.url, alt: logo.alt } : null}
            coverImage={coverImage && coverImage.url ? { url: coverImage.url, alt: coverImage.alt } : null}
            city={entry.city}
            tags={entry.tags ?? undefined}
          />
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/api/entries/route.ts src/components/entries/RandomEntries.tsx
git commit -m "feat: add RandomEntries component with random sort API support"
```

---

### Task 12: Wire up sidebar counts (enhancement)

**Files:**
- Modify: `src/components/entries/DirectoryFilter.tsx`

- [ ] **Step 1: Fetch counts from API on mount inside DirectoryFilter**

Add a `useEffect` at the top of the `DirectoryFilter` component body that fetches `/api/entries/counts` and updates city counts:

Add after the existing state declarations:

```tsx
const [cityCounts, setCityCounts] = useState<Record<string, number>>({})

useEffect(() => {
  fetch('/api/entries/counts')
    .then((res) => res.json())
    .then((data: CountsData) => setCityCounts(data.byCity))
    .catch(console.error)
}, [])
```

Then update the `sortedCities` line to merge API counts with the static cities prop:

```tsx
const sortedCities = cities
  .map((c) => ({ ...c, count: cityCounts[c.id] ?? c.count }))
  .filter((m) => m.count > 0)
  .sort((a, b) => b.count - a.count)
```

- [ ] **Step 2: Verify sidebar shows counts after load**

Visit `/directorio` — sidebar city counts should update from 0 to real counts after a moment

- [ ] **Step 3: Commit**

```bash
git add src/components/entries/DirectoryFilter.tsx
git commit -m "feat: directory sidebar fetches live counts from API"
```

---

### Task 13: Final verification

- [ ] **Step 1: Full type check**

Run: `npx tsc --noEmit --pretty`
Expected: No errors

- [ ] **Step 2: Test all routes**

Visit each page and verify:
- `/directorio` — shimmer, then entries grid, pagination works
- `/directorio/culiacan` — filtered to Culiacán
- `/startups` — filtered to startups
- `/noticias` — shimmer, then news list, pagination works
- `/empleos` — shimmer, then jobs list, pagination works
- Sidebar counts load dynamically
- Sort changes trigger refetch
- Page numbers in URL sync with pagination
- Back/forward browser navigation works

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -u
git commit -m "fix: address pagination integration issues"
```
