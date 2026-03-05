# Entry Detail Page Improvements — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve the entry detail page layout, visibility, and polish for all entry types.

**Architecture:** All changes are in the single `[category]/[slug].astro` page. We add new Lucide icon imports, restructure the frontmatter logic to compute layout mode, update section headers with icons, fix color issues, and add adaptive logo/layout behavior.

**Tech Stack:** Astro, Tailwind CSS v4, Lucide Icons (`@lucide/astro`)

---

### Task 1: Add new Lucide icon imports and detail icon mapping

**Files:**

- Modify: `src/pages/[category]/[slug].astro:1-27` (imports)
- Modify: `src/pages/[category]/[slug].astro:49-79` (details array)

**Step 1: Update imports**

Replace the existing Lucide import block (lines 12-25) with:

```astro
import {
  BadgeCheck,
  Briefcase,
  Building,
  Building2,
  Calendar,
  Clock,
  Cpu,
  ExternalLink,
  Globe,
  GraduationCap,
  Info,
  LayoutList,
  Link as LinkIcon,
  MapPin,
  MessageCircle,
  Monitor,
  Rocket,
  Send,
  Tag,
  Target,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Wrench,
  Cog,
} from "@lucide/astro";
```

**Step 2: Add icons to every detail row**

Replace the `details` array (lines 60-79) with:

```typescript
const details: {
  label: string;
  value: string | number | undefined;
  icon: typeof Rocket;
}[] = [
  {
    label: "Categoria",
    value: typeLabels[entry.data.entryType],
    icon: EntryIcon,
  },
  { label: "Fundada", value: entry.data.foundedYear, icon: Calendar },
  { label: "Equipo", value: entry.data.teamSize, icon: Users },
  { label: "Etapa", value: entry.data.stage, icon: TrendingUp },
  { label: "Sector", value: entry.data.sector, icon: Building2 },
  { label: "Miembros", value: entry.data.memberCount, icon: Users },
  { label: "Frecuencia", value: entry.data.meetupFrequency, icon: Clock },
  { label: "Plataforma", value: entry.data.platform, icon: Monitor },
  { label: "Rol", value: entry.data.role, icon: UserCheck },
  { label: "Empresa", value: entry.data.company, icon: Building },
].filter((d) => d.value !== undefined);
```

Note: The `icon` field is no longer optional — every row has one.

**Step 3: Verify build**

Run: `npx astro check` or `npm run build`
Expected: Clean build, no type errors

---

### Task 2: Add section header icons throughout

**Files:**

- Modify: `src/pages/[category]/[slug].astro` (template section)

**Step 1: Update all section headers to include icons**

For each `<h2>` section header in the template, add the corresponding Lucide icon. The pattern is:

```astro
<h2 class="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
  <IconComponent class="w-4 h-4 text-accent" />
  Section Name
</h2>
```

Apply to these sections:

- "Acerca de" → `<Info class="w-4 h-4 text-accent" />`
- "Detalles" → `<LayoutList class="w-4 h-4 text-accent" />`
- "Ubicacion" → `<MapPin class="w-4 h-4 text-accent" />`
- "Enlaces" → `<LinkIcon class="w-4 h-4 text-accent" />`
- "Habilidades" → `<Wrench class="w-4 h-4 text-accent" />`
- "Servicios" → `<Cog class="w-4 h-4 text-accent" />`
- "Tecnologias" → `<Cpu class="w-4 h-4 text-accent" />`
- "Areas de enfoque" → `<Target class="w-4 h-4 text-accent" />`

**Step 2: Add a header to the Tags section**

Wrap the tags section (lines 278-288) in a card container with a header:

```astro
{
  entry.data.tags.length > 0 && (
    <div class="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6">
      <h2 class="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
        <Tag class="w-4 h-4 text-accent" />
        Etiquetas
      </h2>
      <div class="flex flex-wrap gap-2">
        {entry.data.tags.map((tag) => (
          <span class="text-xs font-mono px-2 py-1 rounded bg-accent/10 text-accent border border-accent/20">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
```

Note: This also applies the new tag colors (Task 3).

**Step 3: Verify build**

Run: `npm run build`
Expected: Clean build

---

### Task 3: Fix tags visibility and focus areas colors

**Files:**

- Modify: `src/pages/[category]/[slug].astro` (template section)

**Step 1: Fix tag colors**

Already done in Task 2 (tags now use `bg-accent/10 text-accent border-accent/20`). If Task 2 was completed, skip this.

**Step 2: Fix focus areas colors**

Replace the amber color scheme for focus areas (line ~353):

Old:

```
bg-amber-500/10 text-amber-400 border-amber-500/20
```

New (use blue to match community badge color):

```
bg-blue-500/10 text-blue-400 border-blue-500/20
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Clean build

---

### Task 4: Adaptive logo container for rectangular logos

**Files:**

- Modify: `src/pages/[category]/[slug].astro` (logo overlap section, lines 166-178)

**Step 1: Replace the logo overlap block**

Replace the current logo overlap (lines 166-178) with an adaptive container:

```astro
{
  entry.data.logo && (
    <div class="absolute -bottom-7 left-5">
      <Image
        src={entry.data.logo}
        alt={`${entry.data.name} logo`}
        width={140}
        height={72}
        class="h-14 w-auto max-w-[140px] rounded-xl border-4 border-card bg-card object-contain shadow-lg px-1"
      />
    </div>
  )
}
```

Key changes:

- `width={140} height={72}` — allows wider aspect ratios
- `h-14 w-auto max-w-[140px]` — fixed height, flexible width up to 140px
- `object-contain` instead of `object-cover` — preserves logo proportions
- `px-1` — small horizontal padding for logos that touch edges

**Step 2: Verify build**

Run: `npm run build`
Expected: Clean build

---

### Task 5: Adaptive single-column layout for low-info entries

**Files:**

- Modify: `src/pages/[category]/[slug].astro` (frontmatter + template structure)

**Step 1: Add layout mode computation in frontmatter**

After the `links` array (after line 115), add:

```typescript
// Determine layout mode: compact for sparse entries, full for rich ones
const sidebarCardCount =
  (details.length > 0 ? 1 : 0) + 1 + (links.length > 0 ? 1 : 0);
// 1 = location card (always present)
const isCompactLayout = sidebarCardCount <= 2 && !entry.data.coverImage;
```

**Step 2: Update the grid wrapper**

Replace `<div class="grid lg:grid-cols-[1fr_20rem] gap-8">` (line 142) with:

```astro
<div class:list={[
  isCompactLayout
    ? "max-w-3xl mx-auto"
    : "grid lg:grid-cols-[1fr_20rem] gap-8"
]}>
```

**Step 3: Wrap sidebar with conditional rendering**

For compact layout, merge sidebar info inline. Replace the sidebar column (lines 366-495) with:

```astro
{/* Sidebar column — only in full layout */}
{!isCompactLayout && (
  <div class="space-y-4">
    {/* Details card */}
    {
      details.length > 0 && (
        <div class="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-5">
          <h2 class="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
            <LayoutList class="w-4 h-4 text-accent" />
            Detalles
          </h2>
          <div class="space-y-3">
            {details.map((detail) => (
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted flex items-center gap-1.5">
                  <detail.icon class="w-3.5 h-3.5 text-muted" />
                  {detail.label}
                </span>
                <span class="text-sm font-mono text-primary">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    {/* Location card */}
    <div class="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-5">
      <h2 class="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
        <MapPin class="w-4 h-4 text-accent" />
        Ubicacion
      </h2>
      <div class="flex items-center gap-2 text-sm text-primary">
        <MapPin class="w-4 h-4 text-accent shrink-0" />
        <span>{
          entry.data.city === "global"
            ? "Global"
            : getCityName(entry.data.city)
        }</span>
      </div>
      <p class="text-xs text-muted mt-1 ml-6">
        {entry.data.state}, {entry.data.country}
      </p>
    </div>

    {/* Links card */}
    {
      links.length > 0 && (
        <div class="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-5">
          <h2 class="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
            <LinkIcon class="w-4 h-4 text-accent" />
            Enlaces
          </h2>
          <div class="space-y-2">
            {links.map((link) => (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors"
              >
                {link.icon === "globe" && <Globe class="w-4 h-4" />}
                {link.icon === "x" && (
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
                {link.icon === "linkedin" && (
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                )}
                {link.icon === "github" && (
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                )}
                {link.icon === "instagram" && (
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8504.6165 19.0872.321 18.2143.12 16.9366.0667 15.6588.0107 15.2479-.0022 11.9999.0009 8.7519.0037 8.3424.0177 7.0689.0827l.0012-.0003zm-.2073 2.3102c1.2568-.0567 1.6334-.0689 4.8492-.0625 3.2157.0063 3.5906.021 4.8495.0827 1.1644.0531 1.7975.2479 2.2183.4117.5576.2168.9556.4758 1.3742.8943.4184.4185.6776.8162.8945 1.3741.1636.4202.3583 1.0537.4113 2.2179.0624 1.2589.0762 1.6338.0825 4.8492.0063 3.2155-.0059 3.5906-.0684 4.8495-.0618 1.1646-.252 1.7977-.4156 2.218-.2167.5579-.4756.9558-.8942 1.3742-.4182.4188-.816.6778-1.3741.8944-.4202.1636-1.0539.3584-2.2185.4116-1.2585.0623-1.6332.0764-4.8494.0827-3.2161.0062-3.5907-.006-4.8497-.0685-1.1644-.0618-1.7977-.252-2.2178-.4156-.558-.2167-.9562-.4756-1.3742-.8943-.4185-.4182-.6778-.816-.8944-1.3742-.1637-.4202-.3585-1.0539-.4117-2.2181-.0623-1.2588-.0764-1.6334-.0826-4.8495-.0062-3.216.0061-3.5907.0685-4.8495.0617-1.1644.252-1.7976.4155-2.2178.2168-.558.4757-.9562.8943-1.3742.4185-.4185.8162-.6778 1.3742-.8944.4203-.1636 1.0539-.3584 2.218-.4117zm9.9233 3.3544a1.4348 1.4348 0 1 0 0 2.8695 1.4348 1.4348 0 0 0 0-2.8695zm-6.7253 1.7197a4.862 4.862 0 1 0 .001 9.7235 4.862 4.862 0 0 0-.001-9.7235zm0 2.139a2.7232 2.7232 0 1 1 0 5.4464 2.7232 2.7232 0 0 1 0-5.4464z" />
                  </svg>
                )}
                {link.icon === "youtube" && (
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                )}
                {link.icon === "discord" && <MessageCircle class="w-4 h-4" />}
                {link.icon === "telegram" && <Send class="w-4 h-4" />}
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )
    }
  </div>
)}
```

**Step 4: Add compact inline info strip for compact layout**

After the action buttons `</div>` (around line 258), inside the header section, add:

```astro
{/* Compact layout: inline details strip */}
{isCompactLayout && (
  <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-secondary">
    <span class="inline-flex items-center gap-1.5">
      <MapPin class="w-3.5 h-3.5 text-accent" />
      {entry.data.city === "global" ? "Global" : getCityName(entry.data.city)}, {entry.data.state}
    </span>
    {details.filter(d => d.label !== "Categoria").map((detail) => (
      <span class="inline-flex items-center gap-1.5">
        <detail.icon class="w-3.5 h-3.5 text-accent" />
        {detail.label}: <span class="font-mono text-primary">{detail.value}</span>
      </span>
    ))}
    {links.map((link) => (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-secondary hover:text-accent transition-colors"
      >
        {link.icon === "globe" && <Globe class="w-3.5 h-3.5" />}
        {link.icon === "x" && (
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        )}
        {link.icon === "instagram" && (
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8504.6165 19.0872.321 18.2143.12 16.9366.0667 15.6588.0107 15.2479-.0022 11.9999.0009 8.7519.0037 8.3424.0177 7.0689.0827l.0012-.0003z" />
          </svg>
        )}
        {link.icon === "linkedin" && (
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        )}
        {link.icon === "github" && (
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        )}
        {link.icon === "youtube" && (
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        )}
        {link.icon === "discord" && <MessageCircle class="w-3.5 h-3.5" />}
        {link.icon === "telegram" && <Send class="w-3.5 h-3.5" />}
        {link.label}
      </a>
    ))}
  </div>
)}
```

**Step 5: Verify build**

Run: `npm run build`
Expected: Clean build

---

### Task 6: Final verification

**Step 1: Full build check**

Run: `npm run build`
Expected: Clean build, all pages generated

**Step 2: Visual verification checklist**

Manually verify (dev server):

- [ ] Rich entry (e.g., Sofinanzas): two-column layout, all icons visible
- [ ] Low-info entry (e.g., Cero Papel): compact single-column, inline details
- [ ] Community entry (e.g., La Cripto Plebada): blue focus areas, icons on all headers
- [ ] Tags are clearly visible with accent-tinted colors
- [ ] Rectangular logos display cleanly with adaptive container
- [ ] All section headers have Lucide icons
