# Dashboard Redesign & Combined CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge profile + content views into a tab-based dashboard hub, redesign entry/job cards, and replace the main page bottom CTA with a combined wallet/WhatsApp/register section.

**Architecture:** The dashboard page becomes a single client component with 3 tabs (Profile, Projects, Jobs) using `useState`. Profile tab uses two-column layout with form + wallet preview. A new `CombinedCtaSection` replaces `CtaSection` on the home page with three cards.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS, Lucide icons, better-auth (`useSession`), existing `useUserResource` hook.

**Spec:** `docs/superpowers/specs/2026-03-30-dashboard-redesign-design.md`

---

### Task 1: Add Relative Timestamp Utility

**Files:**
- Modify: `src/lib/utils.ts`

- [ ] **Step 1: Add `timeAgo` function to utils.ts**

Add this at the end of `src/lib/utils.ts`:

```typescript
/** Convert an ISO date string to a Spanish relative time string */
export function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return 'hace unos minutos'
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`
  if (diffDays < 30) return `hace ${diffDays} día${diffDays === 1 ? '' : 's'}`
  return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Convert an ISO expiration date to a Spanish countdown/elapsed string */
export function expirationLabel(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = then - now
  const diffDays = Math.floor(Math.abs(diffMs) / 86400000)

  if (diffMs > 0) return `Expira en ${diffDays} día${diffDays === 1 ? '' : 's'}`
  return `Expiró hace ${diffDays} día${diffDays === 1 ? '' : 's'}`
}
```

- [ ] **Step 2: Verify the project builds**

Run: `npx tsc --noEmit`
Expected: no errors related to utils.ts

- [ ] **Step 3: Commit**

```bash
git add src/lib/utils.ts
git commit -m "feat: add timeAgo and expirationLabel date utilities"
```

---

### Task 2: Redesign MyEntries Component

**Files:**
- Modify: `src/components/dashboard/MyEntries.tsx`

- [ ] **Step 1: Rewrite MyEntries with stats bar, richer cards, and monochrome badges**

Replace the entire content of `src/components/dashboard/MyEntries.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { EntryBadge } from '@/components/entries/EntryBadge'
import { getCityName, ENTRY_TYPE_CONFIG, type AtlasEntryType } from '@/config'
import { ENTRY_TYPE_ICON_MAP } from '@/lib/icons'
import { timeAgo } from '@/lib/utils'
import { CheckCircle, Clock, XCircle, Pencil, ExternalLink, Plus } from 'lucide-react'
import { useUserResource } from '@/hooks/useUserResource'

interface Entry {
  id: string
  name: string
  entryType: AtlasEntryType
  city: string
  slug: string
  _status: 'draft' | 'published'
  moderationNote?: string
  updatedAt: string
}

export function MyEntries() {
  const { data: entries, loading } = useUserResource<Entry>('/api/user/entries')

  if (loading) return <div className="animate-pulse h-20 bg-elevated rounded-lg" />

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted mb-4">No tienes proyectos registrados.</p>
        <Link
          href="/directorio/submit"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar proyecto
        </Link>
      </div>
    )
  }

  const publishedCount = entries.filter((e) => e._status === 'published').length
  const pendingCount = entries.filter((e) => e._status === 'draft').length

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex gap-3">
        <div className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-center">
          <div className="text-lg font-bold text-accent">{publishedCount}</div>
          <div className="text-2xs font-mono text-muted uppercase">Publicados</div>
        </div>
        <div className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-center">
          <div className="text-lg font-bold text-secondary">{pendingCount}</div>
          <div className="text-2xs font-mono text-muted uppercase">Pendientes</div>
        </div>
      </div>

      {/* Entry cards */}
      {entries.map((entry) => {
        const config = ENTRY_TYPE_CONFIG[entry.entryType]
        const Icon = ENTRY_TYPE_ICON_MAP[config?.icon]
        const entryUrl = `/${config?.slug}/${entry.slug}`

        return (
          <div key={entry.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-elevated border border-border flex items-center justify-center shrink-0">
                {Icon && <Icon className="w-4 h-4 text-muted" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-2xs font-mono text-muted bg-elevated px-2 py-0.5 rounded-full">
                    {config?.label}
                  </span>
                  {entry._status === 'published' ? (
                    <span className="flex items-center gap-1 text-2xs font-mono text-accent">
                      <CheckCircle className="w-3 h-3" /> Publicado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-2xs font-mono text-secondary">
                      <Clock className="w-3 h-3" /> Pendiente
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-primary text-sm">{entry.name}</h3>
                <p className="text-2xs text-muted font-mono">
                  {getCityName(entry.city)} · {timeAgo(entry.updatedAt)}
                </p>
                {entry.moderationNote && entry._status === 'draft' && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400 flex items-start gap-1">
                    <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {entry.moderationNote}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/dashboard/entries/${entry.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary border border-border rounded-md hover:bg-elevated transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Editar
                </Link>
                {entry._status === 'published' && (
                  <Link
                    href={entryUrl}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary border border-border rounded-md hover:bg-elevated transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> Ver
                  </Link>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* Bottom action */}
      <div className="text-center pt-2">
        <Link
          href="/directorio/submit"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar proyecto
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify the project builds**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/MyEntries.tsx
git commit -m "feat: redesign MyEntries with stats bar and richer cards"
```

---

### Task 3: Redesign MyJobs Component

**Files:**
- Modify: `src/components/dashboard/MyJobs.tsx`

- [ ] **Step 1: Rewrite MyJobs with stats bar, expiration info, and dimmed expired cards**

Replace the entire content of `src/components/dashboard/MyJobs.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { getCityName, JOB_TYPE_LABELS, MODALITY_LABELS } from '@/config'
import { timeAgo, expirationLabel } from '@/lib/utils'
import { Clock, CheckCircle, XCircle, Briefcase, ExternalLink, Plus } from 'lucide-react'
import { useUserResource } from '@/hooks/useUserResource'

interface Job {
  id: string
  title: string
  type: string
  modality: string
  city?: string
  slug: string
  _status: 'draft' | 'published'
  moderationNote?: string
  expiresAt: string
  updatedAt: string
}

export function MyJobs() {
  const { data: jobs, loading } = useUserResource<Job>('/api/user/jobs')

  if (loading) return <div className="animate-pulse h-20 bg-elevated rounded-lg" />

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted mb-4">No has publicado empleos.</p>
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium border border-border text-primary rounded-md hover:bg-elevated transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Publicar empleo
        </Link>
      </div>
    )
  }

  const activeCount = jobs.filter((j) => j._status === 'published' && new Date(j.expiresAt) >= new Date()).length
  const expiredCount = jobs.filter((j) => j._status === 'published' && new Date(j.expiresAt) < new Date()).length

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex gap-3">
        <div className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-center">
          <div className="text-lg font-bold text-accent">{activeCount}</div>
          <div className="text-2xs font-mono text-muted uppercase">Activos</div>
        </div>
        <div className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-center">
          <div className="text-lg font-bold text-muted">{expiredCount}</div>
          <div className="text-2xs font-mono text-muted uppercase">Expirados</div>
        </div>
      </div>

      {/* Job cards */}
      {jobs.map((job) => {
        const isExpired = new Date(job.expiresAt) < new Date()
        return (
          <div
            key={job.id}
            className={`bg-card border border-border rounded-lg p-4 ${isExpired ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-elevated border border-border flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-muted" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {job._status === 'published' && !isExpired ? (
                    <span className="flex items-center gap-1 text-2xs font-mono text-accent">
                      <CheckCircle className="w-3 h-3" /> Activo
                    </span>
                  ) : job._status === 'published' && isExpired ? (
                    <span className="flex items-center gap-1 text-2xs font-mono text-muted">
                      <Clock className="w-3 h-3" /> Expirado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-2xs font-mono text-secondary">
                      <Clock className="w-3 h-3" /> Pendiente
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-primary text-sm">{job.title}</h3>
                <p className="text-2xs text-muted font-mono">
                  {JOB_TYPE_LABELS[job.type] || job.type}
                  {job.modality && ` · ${MODALITY_LABELS[job.modality] || job.modality}`}
                  {job.city && ` · ${getCityName(job.city)}`}
                </p>
                <p className="text-2xs text-muted font-mono mt-1">
                  {expirationLabel(job.expiresAt)}
                </p>
                {job.moderationNote && job._status === 'draft' && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400 flex items-start gap-1">
                    <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {job.moderationNote}
                  </div>
                )}
              </div>

              {/* Actions */}
              {job._status === 'published' && !isExpired && (
                <Link
                  href={`/empleos/${job.slug}`}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary border border-border rounded-md hover:bg-elevated transition-colors shrink-0"
                >
                  <ExternalLink className="w-3 h-3" /> Ver
                </Link>
              )}
            </div>
          </div>
        )
      })}

      {/* Bottom action */}
      <div className="text-center pt-2">
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium border border-border text-primary rounded-md hover:bg-elevated transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Publicar empleo
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify the project builds**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/MyJobs.tsx
git commit -m "feat: redesign MyJobs with stats bar and expiration info"
```

---

### Task 4: Rebuild Dashboard Page with Tabs and Welcome Header

**Files:**
- Modify: `src/app/(frontend)/dashboard/page.tsx`

The dashboard page must become a client component with `'use client'` since it uses `useState` for tabs and `useSession` for the welcome header. Move the metadata export to a separate `layout.tsx` if needed, or remove it (dashboard pages are `noindex` anyway — the AuthGuard handles access).

- [ ] **Step 1: Rewrite the dashboard page**

Replace the entire content of `src/app/(frontend)/dashboard/page.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession } from '@/lib/auth-client'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { ProfileForm } from './profile/ProfileForm'
import { MyEntries } from '@/components/dashboard/MyEntries'
import { MyJobs } from '@/components/dashboard/MyJobs'
import { Plus, Briefcase } from 'lucide-react'

type Tab = 'profile' | 'projects' | 'jobs'

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Mi Perfil' },
  { id: 'projects', label: 'Mis Proyectos' },
  { id: 'jobs', label: 'Mis Empleos' },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function getMemberSince(createdAt?: string): string {
  if (!createdAt) return ''
  const date = new Date(createdAt)
  return date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
}

function DashboardContent() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  const user = session?.user
  const firstName = user?.name?.split(' ')[0] || 'Usuario'

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm shrink-0">
              {user?.name ? getInitials(user.name) : '?'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Hola, {firstName}</h1>
              <p className="text-xs font-mono text-muted">
                {user?.email}
                {user?.createdAt && ` · Miembro desde ${getMemberSince(user.createdAt)}`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/directorio/submit"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar proyecto
            </Link>
            <Link
              href="/dashboard/jobs/new"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium border border-border text-primary rounded-md hover:bg-elevated transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" /> Publicar empleo
            </Link>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 p-1 bg-elevated rounded-lg border border-border w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-card text-primary shadow-sm border border-border'
                  : 'text-muted hover:text-secondary border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'profile' && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <ProfileForm />
            </div>
          </div>
        )}
        {activeTab === 'projects' && <MyEntries />}
        {activeTab === 'jobs' && <MyJobs />}
      </div>
    </section>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
```

- [ ] **Step 2: Add metadata via a layout file**

Create or update `src/app/(frontend)/dashboard/layout.tsx` if it doesn't exist, to hold the metadata since the page is now a client component:

Check if `src/app/(frontend)/dashboard/layout.tsx` exists first. If not, create it:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 3: Update ProfileForm to not render the wallet section heading redundantly**

The `ProfileForm` currently renders its own "Digital Wallet Card" section with a full phone mockup. For now, keep it as-is — it already works well within the profile tab. The two-column layout (form + wallet on the right) is handled by the parent dashboard page wrapping `ProfileForm` in a flex container. The `ProfileForm` already includes both the form and wallet section vertically, which works for the single-column mobile view and the wider desktop tab content area.

No changes needed to `ProfileForm.tsx` in this task.

- [ ] **Step 4: Verify the project builds**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/app/(frontend)/dashboard/page.tsx src/app/(frontend)/dashboard/layout.tsx
git commit -m "feat: rebuild dashboard with tabs and welcome header"
```

---

### Task 5: Redirect /dashboard/profile to /dashboard

**Files:**
- Modify: `src/app/(frontend)/dashboard/profile/page.tsx`

- [ ] **Step 1: Replace profile page with a redirect**

Replace the entire content of `src/app/(frontend)/dashboard/profile/page.tsx`:

```tsx
import { redirect } from 'next/navigation'

export default function ProfileRedirect() {
  redirect('/dashboard')
}
```

- [ ] **Step 2: Verify the project builds**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/(frontend)/dashboard/profile/page.tsx
git commit -m "feat: redirect /dashboard/profile to /dashboard"
```

---

### Task 6: Create Combined CTA Section

**Files:**
- Create: `src/components/sections/CombinedCtaSection.tsx`
- Modify: `src/app/(frontend)/page.tsx`

- [ ] **Step 1: Create the CombinedCtaSection component**

Create `src/components/sections/CombinedCtaSection.tsx`:

```tsx
import Link from 'next/link'
import { Plus, CreditCard, MessageCircle, ArrowRight } from 'lucide-react'
import { WHATSAPP_URL } from '@/config'

export function CombinedCtaSection() {
  return (
    <section className="py-4 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-primary uppercase">
            Pon a Sinaloa en el mapa
          </h2>
          <p className="text-sm text-secondary mt-3 max-w-xl mx-auto">
            Únete al ecosistema tech de Sinaloa. Registra tu proyecto, crea tu tarjeta digital, y conecta con la comunidad.
          </p>
        </div>

        {/* Three cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Register */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
              <Plus className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-sm font-bold text-primary mb-2">Registra tu proyecto</h3>
            <p className="text-xs text-muted leading-relaxed flex-1">
              Ya seas startup, consultoría, comunidad o profesional tech — si estás
              construyendo desde Sinaloa, mereces ser visible.
            </p>
            <Link
              href="/directorio/submit"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground font-mono font-semibold text-xs rounded-md hover:bg-accent/90 transition-colors w-fit"
            >
              Agregar proyecto
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Wallet */}
          <div className="bg-gradient-to-br from-accent/5 to-card border border-accent/15 rounded-xl p-6 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-accent" />
              </div>
              <span className="text-2xs font-mono font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Nuevo
              </span>
            </div>
            <h3 className="text-sm font-bold text-primary mb-2">Tu tarjeta digital</h3>
            <p className="text-xs text-muted leading-relaxed flex-1">
              Crea tu tarjeta de presentación para Apple Wallet y Google Wallet. Comparte tu perfil tech con un tap.
            </p>

            {/* Mini card preview */}
            <div className="mt-4 mb-4 bg-card/80 border border-border rounded-lg p-3 flex items-center gap-3">
              <div className="w-9 h-12 bg-elevated border border-border rounded-md flex flex-col items-center justify-center shrink-0">
                <div className="w-4 h-4 rounded-sm bg-accent/20 mb-1" />
                <div className="w-5 h-0.5 bg-border rounded" />
                <div className="w-3.5 h-0.5 bg-border rounded mt-0.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-secondary">Tu Nombre</div>
                <div className="text-2xs text-muted font-mono">Tu título · Tu empresa</div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-accent/30 text-accent font-mono font-semibold text-xs rounded-md hover:bg-accent/10 transition-colors w-fit"
            >
              Regístrate para obtenerla
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: WhatsApp */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
              <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
            </div>
            <h3 className="text-sm font-bold text-primary mb-2">Únete a la comunidad</h3>
            <p className="text-xs text-muted leading-relaxed flex-1">
              Comparte ideas, encuentra colaboradores y entérate de todo lo que pasa en el ecosistema tech de Sinaloa.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 border border-green-500/20 text-green-600 dark:text-green-500 font-mono font-semibold text-xs rounded-md hover:bg-green-500/10 transition-colors w-fit"
            >
              Unirme al grupo
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom explore link */}
        <p className="text-center text-xs text-muted mt-6">
          O{' '}
          <Link href="/directorio" className="text-secondary hover:text-primary underline">
            explora el directorio
          </Link>{' '}
          para ver quién ya está aquí.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace CtaSection with CombinedCtaSection on the home page**

In `src/app/(frontend)/page.tsx`, replace the import and usage:

Replace:
```tsx
import { CtaSection } from '@/components/sections/CtaSection'
```
With:
```tsx
import { CombinedCtaSection } from '@/components/sections/CombinedCtaSection'
```

Replace:
```tsx
      <CtaSection />
```
With:
```tsx
      <CombinedCtaSection />
```

- [ ] **Step 3: Verify the project builds**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/CombinedCtaSection.tsx src/app/\(frontend\)/page.tsx
git commit -m "feat: add combined CTA section with wallet and WhatsApp cards"
```

---

### Task 7: Visual Verification and Cleanup

**Files:**
- No new files — verification only

- [ ] **Step 1: Run the dev server and verify**

Run: `npm run dev`

Verify the following pages:
1. `/` — scroll to bottom, confirm the three-card CTA section renders (register, wallet, WhatsApp)
2. `/dashboard` — confirm welcome header, tab switching works, profile form loads in the Profile tab, wallet preview appears below the form, Projects tab shows redesigned cards with stats, Jobs tab shows redesigned cards with expiration info
3. `/dashboard/profile` — confirm it redirects to `/dashboard`

- [ ] **Step 2: Check for TypeScript errors**

Run: `npx tsc --noEmit`
Expected: clean build, no errors

- [ ] **Step 3: Final commit if any adjustments were needed**

If any fixes were made during verification:

```bash
git add -A
git commit -m "fix: visual adjustments from dashboard redesign verification"
```
