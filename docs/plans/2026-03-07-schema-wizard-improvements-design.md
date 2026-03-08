# Schema, Wizard & Detail Page Improvements

**Date:** 2026-03-07
**Status:** Approved

## Context

The atlas entry schema had a redundant `description` frontmatter field that duplicated the markdown body content. Several wizard fields used free text where dropdowns are more appropriate. The detail page (`slug.astro`) had a few missing display improvements.

## Approved Design

### 1. New dropdown option sets (`src/config.ts`)

**`SECTOR_OPTIONS`** — for all entry types:
- Desarrollo Web, Desarrollo Mobile, SaaS, Fintech, Edtech, HealthTech, AgriTech, E-commerce, IA / Machine Learning, Ciberseguridad, IoT, MarTech, LegalTech, Logística, Gaming, Blockchain / Web3, Cloud / Infraestructura, Data & Analytics, Consultoría IT, Automatización, Otro

**`MEETUP_FREQUENCY_OPTIONS`** — for community (replaces free text):
- Permanente (online), Semanal, Quincenal, Mensual, Trimestral, Por evento, Otro

**`FOCUS_AREA_OPTIONS`** — for community `focusAreas` field (tag-picker UI):
- Desarrollo Web, Desarrollo Mobile, IA / ML, Emprendimiento, Diseño UX/UI, Ciberseguridad, Open Source, Gaming, Blockchain / Web3, DevOps / Cloud, Data Science, Networking, Otro

**New field: `businessModel`** — for startup / business / consultory (optional):
- B2B, B2C, B2B2C, Marketplace, SaaS, Freemium, Open Source, Otro

### 2. Schema changes (`src/content/config.ts`)

- Remove `description` entirely — the markdown body is the source of truth for long-form content. Existing entries with `description` in frontmatter are unaffected (Astro ignores unknown fields).
- Add `businessModel: z.string().optional()` to the schema.

### 3. Wizard changes (`src/components/forms/SubmitWizard.tsx`)

- Step 1 "Descripción" textarea → relabeled **"Acerca de \*"** with hint: *"Este texto será el contenido principal de tu entrada en el directorio"*
- Step 1 city dropdown → add `global` as first option: *"Global / Sin ubicación física"*
- Step 2 Detalles:
  - `sector` → `<select>` using `SECTOR_OPTIONS` (shown for all entry types, replaces free text input)
  - `meetupFrequency` → `<select>` using `MEETUP_FREQUENCY_OPTIONS`
  - `focusAreas` → tag-picker (same UI as existing tags system) using `FOCUS_AREA_OPTIONS` as suggestions
  - Add `businessModel` dropdown for startup / business / consultory using new options
- Payload field `description` retains the same key name (n8n uses it as the markdown body).

### 4. Detail page (`src/pages/[category]/[slug].astro`)

- Render `entry.data.tagline` as a visible `<p>` lead paragraph below the title in the header section (currently only used for SEO meta).
- Add person `email` to the `links[]` array as a `mailto:` link with a Mail icon (displayed in both compact inline strip and sidebar links card).

## Out of Scope

- No migration of existing frontmatter `description` fields (not needed).
- No changes to n8n webhook payload structure.
- No changes to existing entries.
