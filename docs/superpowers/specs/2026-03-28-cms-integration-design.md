# CMS Integration Design — Atlas Sinaloa Tech

**Date:** 2026-03-28
**Status:** Approved

## Overview

Migrate the Atlas Sinaloa Tech site from a static Astro site with manual content management to a full-stack Next.js application with Payload CMS embedded, better-auth for public user authentication, and support for new content types (news, jobs, events).

### Goals

1. Replace the manual n8n webhook → git file workflow with a CMS-powered moderation pipeline
2. Add a news section managed by a non-technical editor via Payload's Lexical rich text editor
3. Add a job board / help wanted board with moderation, supporting both entry-linked and standalone posts
4. Allow registered users to own and submit edits to their directory entries (all changes moderated)
5. Consolidate events management into the CMS (currently Google Sheets CSV)
6. Preserve static generation for SEO/performance on content pages while enabling dynamic pages where needed

---

## Architecture

Single Next.js application with Payload CMS v3 embedded, deployed as a Docker container on a VPS.

```
┌──────────────────────────────────────────┐
│         VPS (Docker - single container)  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │          Next.js App               │  │
│  │                                    │  │
│  │  ┌─────────────┐ ┌─────────────┐  │  │
│  │  │ Payload CMS │ │ better-auth │  │  │
│  │  │ (embedded)  │ │ (Google)    │  │  │
│  │  └─────────────┘ └─────────────┘  │  │
│  │                                    │  │
│  │  Public Site                       │  │
│  │  - Static: entries, news, events   │  │
│  │  - Dynamic: jobs, dashboard        │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
         │
    External Services:
    ├── Neon (Postgres)
    ├── Cloudflare R2 (media storage)
    └── Cloudflare CDN (proxy/cache)
```

### Infrastructure

- **App:** Single Docker container running Next.js + Payload + better-auth
- **Database:** Neon (managed Postgres), using separate schemas:
  - `payload` — Payload collections (entries, news, jobs, events, media, admin users)
  - `auth` — better-auth tables (users, sessions, accounts, OAuth tokens)
  - `public` — shared/cross-cutting tables if needed
- **Media:** Cloudflare R2 (S3-compatible, no egress fees)
- **CDN:** Cloudflare in front of the VPS, caches static pages at the edge

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| CMS | Payload CMS v3 (embedded) |
| Public auth | better-auth (Google provider only) |
| Database | Neon (Postgres) with `payload` + `auth` schemas |
| Media storage | Cloudflare R2 |
| CDN/Proxy | Cloudflare |
| Styling | Tailwind CSS v4 |
| UI components | Radix UI + Lucide icons (carried over from Astro site) |
| Rich text | Payload Lexical editor |
| Maps | D3-geo (carried over) |
| Deployment | Docker (single container) on VPS |

---

## Content Model

### `entries` (migrated from `/src/content/atlas/`)

All 5 entry types in one collection: startup, community, business, consultory, person.

**Shared fields (all types):**
- `entryType` — enum: startup, community, business, consultory, person (required)
- `name` — text (required)
- `slug` — auto-generated from name
- `city` — select from 17 Sinaloa cities + "global" (required)
- `state` — text, default "Sinaloa"
- `country` — text, default "Mexico"
- `tagline` — text
- `logo` — media upload (R2)
- `coverImage` — media upload (R2)
- `tags` — array of text
- `verified` — boolean
- `featured` — boolean
- `website` — URL
- `x`, `instagram`, `linkedin`, `github`, `youtube` — social handles
- `publishDate` — date
- `owner` — email (links to better-auth user)
- `body` — Lexical rich text (replaces raw markdown)
- `status` — draft/published (Payload built-in)

**Startup/Business/Consultory-specific (conditional display):**
- `foundedYear`, `stage`, `teamSize`, `sector`, `services`, `technologies`
- `hiring`, `hiringUrl`, `businessModel`

**Community-specific (conditional display):**
- `memberCount`, `meetupFrequency`, `discord`, `telegram`, `platform`, `focusAreas`

**Person-specific (conditional display):**
- `role`, `company`, `skills`, `availableForHire`, `availableForMentoring`, `email`, `portfolio`

### `news` (new)

- `title` — text (required)
- `slug` — auto-generated
- `excerpt` — text
- `coverImage` — media upload
- `body` — Lexical rich text
- `author` — relationship to Payload admin users
- `publishDate` — date
- `tags` — array of text
- `featured` — boolean
- `status` — draft/published

### `jobs` (new)

- `title` — text (required)
- `description` — Lexical rich text
- `type` — enum: full-time, part-time, contract, freelance, volunteer
- `modality` — enum: remote, in-person, hybrid
- `city` — select (optional, for in-person/hybrid)
- `compensation` — text (flexible format)
- `tags` — array of text
- `contactUrl` — URL
- `postedBy` — email (links to better-auth user)
- `entry` — optional relationship to entries (company-linked job)
- `expiresAt` — date (auto-expire after 30 days, configurable)
- `status` — draft/published (moderated)

### `events` (migrated from Google Sheets)

- `title` — text (required)
- `organizer` — text
- `description` — Lexical rich text
- `date` — date (required)
- `startTime`, `endTime` — time fields
- `location` — text
- `mapsUrl` — URL
- `modality` — enum: in-person, online, hybrid
- `meetLink` — URL (optional, for online/hybrid)
- `url` — URL (event page link)
- `registerUrl` — URL
- `image` — media upload
- `status` — draft/published

### `media` (Payload built-in)

Stores file metadata; actual files stored in Cloudflare R2.

---

## Authentication & Authorization

### better-auth (public users)

- **Who:** Entry owners, job posters — anyone registering on the site
- **Provider:** Google (only, no email/password)
- **Lives in:** `auth` Postgres schema, Next.js API routes (`/api/auth/*`)
- **Session:** Cookie-based, managed by better-auth
- **Reference:** `.agents/skills/better-auth-best-practices/SKILL.md` and `.agents/skills/create-auth-skill/SKILL.md` for implementation patterns
- **Capabilities:**
  - Claim or submit a new entry (goes to moderation)
  - Edit their owned entry (goes to moderation)
  - Post jobs (goes to moderation)
  - View their submissions and moderation status in dashboard

### Payload auth (internal users)

- **Who:** Admins, moderators, news editor
- **Lives in:** `payload` Postgres schema, Payload admin panel (`/admin`)
- **Roles:**
  - **Admin** — full access to everything
  - **Moderator** — approve/reject submissions, edit any entry or job
  - **Editor** — create/edit/publish news and events
- **Capabilities:**
  - News editor: create/edit/publish news and events via Lexical editor
  - Moderators: review pending entries and jobs, approve or reject with feedback
  - Admins: everything, including role management

### Connection between auth systems

The link between better-auth public users and Payload documents is the **user's email** — stored in better-auth's `auth.users` table and as the `owner`/`postedBy` text field on Payload documents (not a Payload relationship, since it crosses schema boundaries). API routes validate the better-auth session, then stamp the authenticated user's email onto submissions. Payload access control uses this email to filter "my content" queries from the dashboard.

---

## Rendering Strategy

### Static pages (pre-rendered, cached by Cloudflare)

- `/` — Homepage (hero, featured carousel, categories, map, upcoming events)
- `/[category]` — Category listing pages (`/startups`, `/comunidades`, etc.)
- `/[category]/[slug]` — Individual entry detail pages
- `/directorio` — Full directory with all entries
- `/directorio/[city]` — City-filtered directory
- `/noticias` — News listing
- `/noticias/[slug]` — Individual news articles
- `/eventos` — Events calendar

All fetched from Payload's local API at build time via `generateStaticParams` + server components.

### Dynamic pages (server-rendered or client-rendered)

- `/empleos` — Job board (server-rendered, supports search/filter query params)
- `/empleos/[slug]` — Job detail (server-rendered)
- `/dashboard` — User dashboard (authenticated, client-rendered behind better-auth session)
- `/directorio/submit` — Submission wizard (authenticated)

### Rebuild triggers (ISR)

Payload `afterChange` hooks on entries, news, and events collections trigger Next.js on-demand revalidation:

```
Payload afterChange hook
  → if status changed to/from "published"
    → revalidatePath('/')
    → revalidatePath('/[category]')
    → revalidatePath('/[category]/[slug]')
    → (etc., only affected paths)
```

Incremental Static Regeneration — only affected pages rebuild, updates go live in seconds.

---

## Moderation Workflow

### Entry submissions (new)

1. User registers via Google (better-auth)
2. Fills submission wizard (similar to current multi-step form)
3. API route creates Payload entry with `status: "draft"`, `owner: user's email`
4. User sees "Pending review" in their dashboard
5. Moderator reviews in Payload admin (filtered view: drafts)
6. Approve → `status: "published"` → triggers ISR revalidation
7. Reject → moderator adds rejection note → user sees reason in dashboard

### Entry edits (by owner)

1. User edits their entry from dashboard
2. API route creates a new draft version (Payload versions feature)
3. Published version stays live — visitors see no change
4. Moderator reviews the proposed changes
5. Approve → draft becomes new published version → revalidation
6. Reject → draft discarded, user notified with reason

### Job posts

1. User submits job (optionally linked to their entry)
2. API route creates job with `status: "draft"`
3. Moderator reviews and approves/rejects
4. Published jobs auto-expire after 30 days (configurable)
5. Owner can close or repost from dashboard

### News & Events (editorial — no moderation queue)

1. Editor/admin logs into `/admin`
2. Creates content using Lexical editor
3. Saves as draft (preview available)
4. Publishes when ready → triggers ISR revalidation

---

## Migration Path

### Phase 1: Scaffold & Infrastructure

- Initialize Next.js project with Payload CMS v3 embedded
- Configure Neon Postgres with `payload` and `auth` schemas
- Configure Cloudflare R2 bucket for media
- Set up better-auth with Google provider (reference: `.agents/skills/` for patterns)
- Docker setup for the Next.js app
- Local dev environment

### Phase 2: Content Model in Payload

- Define all Payload collections (entries, news, jobs, events, media)
- Set up access control (admin, moderator, editor roles)
- Configure Lexical editor for rich text fields
- Set up media uploads pointing to R2
- Configure Payload afterChange hooks for ISR revalidation

### Phase 3: Seed Existing Content

- Migrate 14 existing entries from markdown frontmatter into Payload
- One-time migration script:
  - Reads each `/src/content/atlas/*/index.md`
  - Parses frontmatter + body
  - Uploads logos/covers to R2
  - Creates Payload documents via local API
- Migrate events from Google Sheets CSV into Payload events collection

### Phase 4: Rebuild Frontend in Next.js

Port order:
1. Layouts (`BaseLayout`, `DirectoryLayout` → Next.js app layouts)
2. Homepage (hero, featured, categories, map, events strip)
3. Directory pages (listing, city filter, detail pages)
4. Category pages
5. News pages (new)
6. Events page (calendar, detail modal)
7. Job board (new)
8. Submission wizard (rework existing form)
9. User dashboard (new)

Existing React components (SinaloaMap, EventCalendar, FeaturedCarousel, etc.) port with minimal changes — mainly swapping data-fetching props. Tailwind styles carry over directly.

### Phase 5: Auth & User Features

- Integrate better-auth routes (`/api/auth/*`)
- Build login/register UI (Google sign-in button)
- Build user dashboard (my entries, my jobs, submit, edit)
- Build API routes for authenticated submissions
- Wire up moderation workflow in Payload admin

### Phase 6: Cutover

- Deploy Docker container to VPS
- Test on staging subdomain (`staging.atlas-sinaloa.tech`)
- Point Cloudflare DNS from Cloudflare Pages → VPS
- Decommission n8n webhook
- Remove Google Sheets events dependency

No downtime: old Astro site stays live until new site is verified on staging and DNS is switched.

---

## What's Preserved

- All Tailwind styles and theme (light/dark)
- React components (SinaloaMap, EventCalendar, carousels, etc.)
- Content model (same entry types and fields)
- URL structure (`/startups/operia`, `/comunidades/4to-piso`, etc.)
- SEO characteristics (static pages, same slugs)

## What's New

- `/noticias`, `/noticias/[slug]` — News section
- `/empleos`, `/empleos/[slug]` — Job board
- `/dashboard` — User dashboard (my entries, my jobs)
- `/admin` — Payload admin panel (moderation, editorial)
- Google sign-in for public users
- Moderation workflow with versioned drafts
- Events managed in CMS (replaces Google Sheets)
