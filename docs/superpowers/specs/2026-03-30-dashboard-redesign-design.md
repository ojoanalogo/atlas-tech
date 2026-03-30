# Dashboard Redesign & Combined CTA

## Summary

Converge the separate profile and "my content" dashboard views into a single tab-based hub. Redesign entry and job cards with richer information. Replace the main page bottom CTA with a combined section featuring project registration, wallet card promotion, and WhatsApp community.

## Dashboard Page (`/dashboard`)

### Welcome Header

- Avatar circle with user initials (derived from `session.user.name`)
- Greeting: "Hola, [first name]"
- Subtitle: email + "Miembro desde [month year]"
- Right-aligned quick actions: "Agregar proyecto" (accent), "Publicar empleo" (outlined)

### Tab System

Three client-side tabs with no URL changes. State managed via `useState`. Default tab: "Mi Perfil".

Tabs: **Mi Perfil** | **Mis Proyectos** | **Mis Empleos**

Tab bar styled as pill selector: muted background container, active tab gets elevated card-style background with border.

### Profile Tab (Two-Column Layout)

**Left column (flex-1):** The existing `ProfileForm` fields — name, title, company, email, phone, website, LinkedIn, X, GitHub, save button. No changes to form logic or API calls.

**Right column (w-[280px], sticky top):** Compact wallet preview card containing:
- Section label "Tu tarjeta digital"
- Scaled-down phone mockup (smaller than current full-size version, ~160px wide)
- Apple/Google sub-tabs
- Official wallet download button (Apple Wallet SVG / Google Wallet SVG)
- Helper text: "Guarda tu perfil primero" when no saved profile exists

On mobile (<md), columns stack vertically — form first, wallet card below.

### Projects Tab

**Stats bar:** Two stat cards side by side — "Publicados" count and "Pendiente" count. Uses accent color for published count, muted for pending.

**Entry cards (redesigned):** Each card shows:
- Left: Icon based on entry type (reuse `ENTRY_TYPE_ICON_MAP`), with subtle muted background
- Center: Entry type label badge (muted/monochrome — no colored backgrounds per type), status badge (published/pending), entry name (bold), city + relative timestamp ("Actualizado hace 3 días")
- Right: "Editar" and "Ver" action buttons (outlined, small)
- Moderation note: if present on drafts, shown as subtle warning bar below the card content

**Color constraint:** Entry type badges and status indicators use monochrome/muted tones — `text-muted` with `bg-elevated` backgrounds. Only accent green for "Publicado" status. Pending uses `text-secondary`. No per-type color coding on badges.

**Empty state:** Centered message + "Agregar proyecto" button.

**Bottom action:** "Agregar proyecto" button at the bottom of the list.

### Jobs Tab

**Stats bar:** Two stat cards — "Activos" count and "Expirados" count.

**Job cards (redesigned):** Each card shows:
- Left: Briefcase icon with subtle muted background
- Center: Status badge (active/pending/expired), job title (bold), type + modality + city, expiration info ("Expira en 25 días" / "Expiró hace 5 días")
- Right: "Ver" action button
- Moderation note if present on drafts

**Expired cards:** Reduced opacity (~0.6) to visually de-emphasize.

**Color constraint:** Same as projects — monochrome badges. Only accent for "Activo". Expired uses `text-muted`.

**Empty state:** Centered message + "Publicar empleo" button.

**Bottom action:** "Publicar empleo" button at the bottom.

### Relative Timestamps

Use a simple utility function that converts ISO dates to relative strings:
- < 1 hour: "hace unos minutos"
- < 24 hours: "hace X horas"
- < 30 days: "hace X días"
- else: formatted date

For job expiration countdown:
- Future: "Expira en X días"
- Past: "Expiró hace X días"

## Route Changes

- `/dashboard` — the converged page (tabs, profile, content)
- `/dashboard/profile` — redirect to `/dashboard` (or remove entirely). The profile form is now the default tab.
- `/dashboard/entries/[id]` — keep as-is (edit entry form)
- `/dashboard/jobs/new` — keep as-is (new job form)

## Combined CTA Section (Main Page)

Replaces the current `CtaSection` component at the bottom of the home page.

### Structure

Section header: "Pon a Sinaloa en el mapa" (keep existing copy) with a subtitle line: "Únete al ecosistema tech de Sinaloa. Registra tu proyecto, crea tu tarjeta digital, y conecta con la comunidad."

Three cards in a row (stack vertically on mobile):

**Card 1 — Registra tu proyecto:**
- Icon: Plus in muted accent circle
- Title: "Registra tu proyecto"
- Description: existing copy about visibility
- CTA: "Agregar proyecto →" (solid accent button)
- Links to `/directorio/submit`

**Card 2 — Tu tarjeta digital (wallet):**
- Subtle accent gradient background (very muted, not loud)
- "Nuevo" badge (small pill)
- Icon: card/wallet icon
- Title: "Tu tarjeta digital"
- Description: "Crea tu tarjeta de presentación para Apple Wallet y Google Wallet. Comparte tu perfil tech con un tap."
- Mini card preview: small abstract representation of a wallet card with placeholder name/title
- CTA: "Regístrate para obtenerla →" (outlined accent button)
- Links to `/dashboard` (auth flow handles redirect for non-logged-in users)

**Card 3 — Únete a la comunidad (WhatsApp):**
- Icon: MessageCircle in subtle green circle (WhatsApp green, but muted)
- Title: "Únete a la comunidad"
- Description: reuse existing WhatsApp CTA copy
- CTA: "Unirme al grupo →" (outlined, muted green)
- Links to `WHATSAPP_URL` (external, `target="_blank"`)

### Color Constraint

The wallet card is the only one with a slight background gradient — very subtle dark-to-accent tint. The other two cards use standard `bg-card` with `border-border`. WhatsApp green is used only on the WhatsApp card icon and button border, at reduced opacity. No bright saturated colors anywhere.

**Bottom line:** "O explora el directorio para ver quién ya está aquí." with a link to `/directorio`.

## Existing Components Reuse

- `ProfileForm` — extracted and adapted to work within the dashboard page (remove the outer section/heading wrapper, keep form logic intact)
- `MyEntries` — redesigned but keeps the same `useUserResource` hook and data shape
- `MyJobs` — redesigned but keeps the same hook and data shape
- `WhatsAppCta` — the standalone component stays available but is not used on the main page anymore (replaced by the combined CTA). Can be removed or kept for use elsewhere.
- `EntryBadge` — still used in project cards

## Files to Create/Modify

**New files:**
- `src/components/sections/CombinedCtaSection.tsx` — the three-card CTA for the main page

**Modified files:**
- `src/app/(frontend)/dashboard/page.tsx` — convert to client component with tabs, welcome header, inline profile form
- `src/components/dashboard/MyEntries.tsx` — redesigned cards with stats bar, actions, monochrome badges
- `src/components/dashboard/MyJobs.tsx` — redesigned cards with stats bar, expiration info
- `src/app/(frontend)/page.tsx` — replace `CtaSection` import with `CombinedCtaSection`
- `src/lib/utils.ts` (or new `src/lib/date.ts`) — relative timestamp utility

**Removed/deprecated:**
- `src/app/(frontend)/dashboard/profile/page.tsx` — replace with a redirect to `/dashboard`
- `src/app/(frontend)/dashboard/profile/ProfileForm.tsx` — keep in place, import from `@/app/(frontend)/dashboard/profile/ProfileForm` in the dashboard page (avoid unnecessary file moves)

## Mobile Behavior

- Welcome header: avatar + greeting stack above action buttons (buttons become full-width)
- Tabs: horizontal scroll if needed, or compact text
- Profile tab: single column, wallet card below the form
- Projects/Jobs: cards stay single-column (already are)
- Combined CTA: cards stack vertically with full width
