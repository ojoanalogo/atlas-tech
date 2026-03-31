# Client-Side Pagination with API Routes

**Date:** 2026-03-30
**Status:** Approved

## Summary

Replace the current pattern of server-side "fetch all entries and filter in-memory on the client" with paginated API route handlers and a shared `PaginatedView` component. Listing pages become static shells that render client-side with shimmer loading states. Detail pages remain fully SSR for SEO.

## Motivation

Currently, `/directorio`, `/directorio/[city]`, `/[category]`, `/noticias`, and `/empleos` all fetch their entire dataset server-side (up to 200 entries) and pass it as props to client components. Filtering, sorting, and pagination happen in-memory. This is wasteful — the client receives far more data than it displays, and the pages can't scale as the dataset grows.

## Architecture

### API Layer

Three public GET route handlers, all thin wrappers around Payload's `find()`:

**`GET /api/entries`**
- Query params: `page` (default 1), `limit` (default 18), `sort` (`name-asc`, `name-desc`, `date-desc`, `date-asc`), `entryType`, `city`
- Filters to `_status: published`
- Returns `PaginatedResponse<Entry>`

**`GET /api/entries/counts`**
- No pagination params — lightweight endpoint for sidebar
- Returns `{ byCity: Record<string, number>, byType: Record<string, number>, total: number }`
- Filters to `_status: published`

**`GET /api/news`**
- Query params: `page` (default 1), `limit` (default 12), `sort` (default `date-desc`)
- Filters to `_status: published`
- Returns `PaginatedResponse<News>`

**`GET /api/jobs`**
- Query params: `page` (default 1), `limit` (default 12), `sort` (default `date-desc`)
- Filters to `_status: published` and `expiresAt > now`
- Returns `PaginatedResponse<Job>`

**Shared response type:**

```ts
interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
```

### Client Utility

`src/lib/api.ts` exports a typed `fetchPaginated<T>(endpoint, params)` function used by `PaginatedView` to call the API routes.

### `PaginatedView` Component

Generic `'use client'` component at `src/components/ui/PaginatedView.tsx`.

**Props:**

```ts
interface PaginatedViewProps<T> {
  endpoint: string                       // e.g. "/api/entries"
  params?: Record<string, string>        // persistent filters (entryType, city, etc.)
  renderItem: (item: T) => ReactNode     // consumer controls item rendering
  renderSkeleton: () => ReactNode        // custom shimmer per entry type
  skeletonCount?: number                 // how many shimmers while loading (default: pageSize)
  layout?: 'grid' | 'list'              // wraps items in grid or vertical stack
  gridCols?: string                      // tailwind grid cols, default "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  emptyMessage?: string
  pageSize?: number                      // default 18 for entries, 12 for news/jobs
}
```

**Behavior:**
- On mount, fetches page 1 from `endpoint`
- While loading, renders `skeletonCount` instances of `renderSkeleton()`
- On page change, shows skeletons again while fetching
- Updates URL search params (`?page=2`) via `history.pushState` without full navigation
- Scrolls to top of list on page change
- Pagination controls (page numbers, prev/next arrows) are built-in, extracted from the current `DirectoryFilter` pagination component

### Skeleton Components

One shimmer component per content type, using `animate-pulse` blocks matching real card dimensions:

- `EntryCardSkeleton` — logo placeholder, name bar, tagline bar, badge
- `NewsCardSkeleton` — image block, title bar, excerpt lines
- `JobCardSkeleton` — title bar, meta row, tags row

### Page Refactors

**Directory pages** (`/directorio`, `/directorio/[city]`, `/[category]`):
- Become static shells: metadata + `DirectoryFilter` sidebar + `PaginatedView`
- `DirectoryFilter` is refactored: no longer receives `entries[]`, instead receives counts from `/api/entries/counts` and controls URL params
- Sort state changes update `params` on `PaginatedView`, triggering a refetch
- Category/city clicks navigate to the appropriate route (same as current)

**News page** (`/noticias`):
- Static heading + `PaginatedView` with `endpoint="/api/news"`, `NewsCard` render, `NewsCardSkeleton`, `layout="list"`, `pageSize={12}`

**Jobs page** (`/empleos`):
- Static heading + `PaginatedView` with `endpoint="/api/jobs"`, `JobCard` render, `JobCardSkeleton`, `layout="list"`, `pageSize={12}`
- Removes `export const dynamic = 'force-dynamic'`

**Directory "Ver más" (3 random entries):**
- Small `'use client'` component `RandomEntries` that calls `/api/entries?limit=3&sort=random` on mount
- Separate from `PaginatedView` — one-shot fetch, not paginated

### SEO

List pages no longer SSR content — only detail pages (`/startups/[slug]`, `/noticias/[slug]`, `/empleos/[slug]`) are SSR'd for SEO. This is acceptable since search engines should index individual entries, not list pages with paginated subsets.

## File Changes

### New Files
- `src/app/api/entries/route.ts`
- `src/app/api/entries/counts/route.ts`
- `src/app/api/news/route.ts`
- `src/app/api/jobs/route.ts`
- `src/lib/api.ts`
- `src/components/ui/PaginatedView.tsx`
- `src/components/entries/EntryCardSkeleton.tsx`
- `src/components/entries/NewsCardSkeleton.tsx`
- `src/components/entries/JobCardSkeleton.tsx`
- `src/components/entries/RandomEntries.tsx`

### Modified Files
- `src/components/entries/DirectoryFilter.tsx` — remove in-memory filtering/pagination, keep sidebar UI, accept counts instead of entries array
- `src/app/(frontend)/directorio/page.tsx` — static shell + PaginatedView
- `src/app/(frontend)/directorio/[city]/page.tsx` — same
- `src/app/(frontend)/[category]/page.tsx` — same
- `src/app/(frontend)/noticias/page.tsx` — replace inline list with PaginatedView
- `src/app/(frontend)/empleos/page.tsx` — replace inline list with PaginatedView, remove force-dynamic

### Unchanged
- All detail pages (`[slug]`) remain SSR
- `src/lib/payload.ts` — existing functions stay for detail pages
- `src/collections/*` — no changes
- `DirectoryGrid`, existing card components — reused as-is

### Deleted
- `Pagination` component inside `DirectoryFilter.tsx` — replaced by PaginatedView's built-in pagination
