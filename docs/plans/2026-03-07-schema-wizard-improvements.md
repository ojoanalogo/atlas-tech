# Schema, Wizard & Detail Page Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove redundant `description` frontmatter field, add structured dropdown options, and improve the detail page display.

**Architecture:** Changes span three layers — config constants, Zod schema, React wizard form, and Astro detail page. No migrations needed since `description` in existing frontmatter is silently ignored by Astro when removed from the schema.

**Tech Stack:** Astro 5, React (island), Zod (content schema), TypeScript, Tailwind CSS, Lucide icons

---

### Task 1: Add new option constants to `src/config.ts`

**Files:**
- Modify: `src/config.ts`

**Step 1: Add `SECTOR_OPTIONS` after `PLATFORM_OPTIONS`**

```ts
export const SECTOR_OPTIONS = [
  { value: "Desarrollo Web", label: "Desarrollo Web" },
  { value: "Desarrollo Mobile", label: "Desarrollo Mobile" },
  { value: "SaaS", label: "SaaS" },
  { value: "Fintech", label: "Fintech" },
  { value: "Edtech", label: "Edtech" },
  { value: "HealthTech", label: "HealthTech" },
  { value: "AgriTech", label: "AgriTech" },
  { value: "E-commerce", label: "E-commerce" },
  { value: "IA / Machine Learning", label: "IA / Machine Learning" },
  { value: "Ciberseguridad", label: "Ciberseguridad" },
  { value: "IoT", label: "IoT" },
  { value: "MarTech", label: "MarTech" },
  { value: "LegalTech", label: "LegalTech" },
  { value: "Logística", label: "Logística" },
  { value: "Gaming", label: "Gaming" },
  { value: "Blockchain / Web3", label: "Blockchain / Web3" },
  { value: "Cloud / Infraestructura", label: "Cloud / Infraestructura" },
  { value: "Data & Analytics", label: "Data & Analytics" },
  { value: "Consultoría IT", label: "Consultoría IT" },
  { value: "Automatización", label: "Automatización" },
  { value: "Otro", label: "Otro" },
] as const;
```

**Step 2: Add `MEETUP_FREQUENCY_OPTIONS` (replaces the existing free-text field)**

```ts
export const MEETUP_FREQUENCY_OPTIONS = [
  { value: "Permanente (online)", label: "Permanente (online)" },
  { value: "Semanal", label: "Semanal" },
  { value: "Quincenal", label: "Quincenal" },
  { value: "Mensual", label: "Mensual" },
  { value: "Trimestral", label: "Trimestral" },
  { value: "Por evento", label: "Por evento" },
  { value: "Otro", label: "Otro" },
] as const;
```

**Step 3: Add `FOCUS_AREA_OPTIONS` and `BUSINESS_MODEL_OPTIONS`**

```ts
export const FOCUS_AREA_OPTIONS = [
  "Desarrollo Web",
  "Desarrollo Mobile",
  "IA / ML",
  "Emprendimiento",
  "Diseño UX/UI",
  "Ciberseguridad",
  "Open Source",
  "Gaming",
  "Blockchain / Web3",
  "DevOps / Cloud",
  "Data Science",
  "Networking",
  "Otro",
] as const;

export const BUSINESS_MODEL_OPTIONS = [
  { value: "B2B", label: "B2B" },
  { value: "B2C", label: "B2C" },
  { value: "B2B2C", label: "B2B2C" },
  { value: "Marketplace", label: "Marketplace" },
  { value: "SaaS", label: "SaaS" },
  { value: "Freemium", label: "Freemium" },
  { value: "Open Source", label: "Open Source" },
  { value: "Otro", label: "Otro" },
] as const;
```

---

### Task 2: Update content schema (`src/content/config.ts`)

**Files:**
- Modify: `src/content/config.ts`

**Step 1: Remove `description` field and add `businessModel`**

Remove this line from the schema:
```ts
description: z.string(),
```

Add `businessModel` in the startup/business/consultory extras section (after `hiringUrl`):
```ts
businessModel: z.string().optional(),
```

**Step 2: Verify build doesn't break**

```bash
npx astro build 2>&1 | tail -20
```

Expected: build succeeds (existing entries with `description` in frontmatter are silently ignored by Astro/Zod when the field is removed from schema).

---

### Task 3: Update wizard — Step 1 changes

**Files:**
- Modify: `src/components/forms/SubmitWizard.tsx`

**Step 1: Import new constants at the top**

In the existing import from `../../config`, add:
```ts
SECTOR_OPTIONS,
MEETUP_FREQUENCY_OPTIONS,
FOCUS_AREA_OPTIONS,
BUSINESS_MODEL_OPTIONS,
```

**Step 2: Add `businessModel` state variable**

After the existing `focusAreas` state (around line 150), add:
```ts
const [businessModel, setBusinessModel] = useState("");
```

Also add `focusAreas` to the tag-picker state (change from a string to an array):
```ts
// focusAreas was: const [focusAreas, setFocusAreas] = useState("");
// Change to:
const [focusAreas, setFocusAreas] = useState<string[]>([]);
```

**Step 3: Add `focusAreaInput` state for the tag-picker**

```ts
const [focusAreaInput, setFocusAreaInput] = useState("");
```

**Step 4: Update `buildPayload` to handle array `focusAreas` and new field**

In `buildPayload()`, change:
```ts
focusAreas: focusAreas || undefined,
```
to:
```ts
focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
businessModel: businessModel || undefined,
```

**Step 5: Relabel "Descripción" textarea in Step 1**

Find the `Descripción *` label block (around line 454) and change:
- Label text: `Descripción *` → `Acerca de *`
- Add a hint below the textarea:
```tsx
<p className="text-xs text-muted mt-1 font-mono">
  Este texto será el contenido principal de tu entrada en el directorio.
</p>
```

**Step 6: Add `global` option to the city dropdown in Step 1**

In the `<select>` for city (around line 473), add before the mapped options:
```tsx
<option value="global">Global / Sin ubicación física</option>
```


---

### Task 4: Update wizard — Step 2 dropdowns and tag-picker

**Files:**
- Modify: `src/components/forms/SubmitWizard.tsx`

**Step 1: Replace `sector` free-text input with a `<select>`**

The `sector` field is currently inside the startup/business/consultory block. Move it **outside** all the `entryType` conditionals so it shows for all types. Replace:

```tsx
<label className="block">
  <span className="text-xs font-mono text-muted uppercase tracking-wider">
    Sector
  </span>
  <input
    type="text"
    value={sector}
    onChange={(e) => setSector(e.target.value)}
    placeholder="ej. Fintech, SaaS, Edtech"
    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
  />
</label>
```

With:
```tsx
<label className="block">
  <span className="text-xs font-mono text-muted uppercase tracking-wider">
    Sector
  </span>
  <select
    value={sector}
    onChange={(e) => setSector(e.target.value)}
    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm focus:outline-hidden focus:border-accent transition-colors"
  >
    <option value="">Selecciona</option>
    {SECTOR_OPTIONS.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
</label>
```

Place this block at the TOP of the `<div className="space-y-3">` in Step 2, before any `entryType` conditionals.

**Step 2: Replace `meetupFrequency` free-text with `<select>`**

Inside the `entryType === "community"` block, replace the `meetupFrequency` `<input type="text">` with:

```tsx
<label className="block">
  <span className="text-xs font-mono text-muted uppercase tracking-wider">
    Frecuencia de meetups
  </span>
  <select
    value={meetupFrequency}
    onChange={(e) => setMeetupFrequency(e.target.value)}
    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm focus:outline-hidden focus:border-accent transition-colors"
  >
    <option value="">Selecciona</option>
    {MEETUP_FREQUENCY_OPTIONS.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
</label>
```

**Step 3: Replace `focusAreas` free-text with a tag-picker**

The `focusAreas` state is now `string[]` (Task 3). Add helper functions near `addTag` / `removeTag`:

```ts
function addFocusArea(area: string) {
  const a = area.trim();
  if (a && !focusAreas.includes(a) && focusAreas.length < 10) {
    setFocusAreas([...focusAreas, a]);
    setFocusAreaInput("");
  }
}

function removeFocusArea(area: string) {
  setFocusAreas(focusAreas.filter((a) => a !== area));
}
```

Replace the `focusAreas` `<input>` inside the community block with:

```tsx
<div className="block">
  <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-1">
    Áreas de enfoque
  </span>
  <div className="flex gap-2 flex-wrap mb-2">
    {FOCUS_AREA_OPTIONS.map((area) => (
      <button
        key={area}
        type="button"
        onClick={() => addFocusArea(area)}
        disabled={focusAreas.includes(area) || focusAreas.length >= 10}
        className={`text-xs font-mono px-2 py-1 rounded border transition-colors disabled:opacity-40 ${
          focusAreas.includes(area)
            ? "border-accent bg-accent/10 text-accent"
            : "border-border bg-card text-muted hover:border-accent/50 hover:text-accent"
        }`}
      >
        {area}
      </button>
    ))}
  </div>
  <div className="flex gap-2">
    <input
      type="text"
      value={focusAreaInput}
      onChange={(e) => setFocusAreaInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") { e.preventDefault(); addFocusArea(focusAreaInput); }
      }}
      placeholder="Otra área personalizada"
      className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
    />
    <button
      type="button"
      onClick={() => addFocusArea(focusAreaInput)}
      disabled={focusAreas.length >= 10}
      className="px-3 py-2 rounded-lg border border-border bg-card text-muted hover:text-accent hover:border-accent transition-colors disabled:opacity-40"
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>
  {focusAreas.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {focusAreas.map((area) => (
        <span
          key={area}
          className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-accent/10 text-accent border border-accent/20"
        >
          {area}
          <button
            type="button"
            onClick={() => removeFocusArea(area)}
            className="hover:text-red-400 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  )}
</div>
```

**Step 4: Add `businessModel` dropdown inside startup/business/consultory block**

After the `hiring` checkbox block, add:

```tsx
<label className="block">
  <span className="text-xs font-mono text-muted uppercase tracking-wider">
    Modelo de negocio
  </span>
  <select
    value={businessModel}
    onChange={(e) => setBusinessModel(e.target.value)}
    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm focus:outline-hidden focus:border-accent transition-colors"
  >
    <option value="">Selecciona</option>
    {BUSINESS_MODEL_OPTIONS.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
</label>
```

**Step 5: Verify build**

```bash
npx astro build 2>&1 | tail -20
```

Expected: build succeeds with no TypeScript errors.


---

### Task 5: Update detail page (`src/pages/[category]/[slug].astro`)

**Files:**
- Modify: `src/pages/[category]/[slug].astro`

**Step 1: Render tagline as a visible lead paragraph**

In the header section, `tagline` is currently only used for SEO meta. It also renders as `<p class="text-lg text-secondary">` — check line ~233. If it already renders there, this step is complete. If not, add it after the `<h1>` block:

```astro
{
  entry.data.tagline && (
    <p class="text-lg text-secondary">{entry.data.tagline}</p>
  )
}
```

(Check the existing code — it may already be there.)

**Step 2: Add person `email` to the `links[]` array**

Find the `links` array definition (around line 95). Add after the `portfolio` entry:

```ts
{
  label: "Email",
  url: entry.data.email ? `mailto:${entry.data.email}` : undefined,
  icon: "mail",
},
```

**Step 3: Add the Mail icon import**

At the top of the file, in the lucide import block, add `Mail` to the list:

```ts
import {
  // ...existing imports...
  Mail,
} from "@lucide/astro";
```

**Step 4: Render the mail icon in both link render locations**

There are two places that render links with icon conditionals — the compact inline strip (around line 310) and the sidebar links card (around line 529). In both places, add:

```astro
{link.icon === "mail" && <Mail class="w-3.5 h-3.5" />}
```
(use `w-4 h-4` in the sidebar version)

**Step 5: Add `businessModel` to the `details[]` array**

In the `details` array (around line 74), add after the `company` entry:

```ts
{ label: "Modelo", value: entry.data.businessModel, icon: Target },
```

`Target` is already imported. This will show in the sidebar details card and compact inline strip for entries that have `businessModel` set.

**Step 6: Final build check**

```bash
npx astro build 2>&1 | tail -30
```

Expected: clean build, no errors.