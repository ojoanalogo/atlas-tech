'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { EntryBadge } from '@/components/entries/EntryBadge'
import { XCircle, X, Plus, ArrowLeft, Save, CheckCircle } from 'lucide-react'
import {
  SINALOA_CITIES,
  STAGE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  SECTOR_OPTIONS,
  MEETUP_FREQUENCY_OPTIONS,
  PLATFORM_OPTIONS,
  FOCUS_AREA_OPTIONS,
  BUSINESS_MODEL_OPTIONS,
  ENTRY_TYPE_CONFIG,
  isStartupLike,
  type AtlasEntryType,
} from '@/config'

const cities = [
  { id: 'global', name: 'Global (sin ubicacion especifica)' },
  ...SINALOA_CITIES.map((m) => ({ id: m.id, name: m.name })),
]

const inputClass =
  'mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors'
const selectClass =
  'mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm focus:outline-hidden focus:border-accent transition-colors'
const labelClass = 'text-xs font-mono text-muted uppercase tracking-wider'
const checkboxClass = 'w-4 h-4 rounded border-border text-accent focus:ring-accent'

interface EntryData {
  id: string
  entryType: AtlasEntryType
  name: string
  slug: string
  tagline?: string
  city: string
  website?: string
  x?: string
  instagram?: string
  linkedin?: string
  github?: string
  youtube?: string
  discord?: string
  telegram?: string
  tags?: { tag: string; id?: string }[]
  _status: 'draft' | 'published'
  moderationNote?: string
  // startup-like
  foundedYear?: number
  stage?: string
  teamSize?: string
  sector?: string
  services?: { service: string; id?: string }[]
  technologies?: { technology: string; id?: string }[]
  hiring?: boolean
  hiringUrl?: string
  businessModel?: string
  // community
  memberCount?: number
  meetupFrequency?: string
  platform?: string
  focusAreas?: { area: string; id?: string }[]
  // person
  role?: string
  company?: string
  skills?: { skill: string; id?: string }[]
  email?: string
  portfolio?: string
  availableForHire?: boolean
  availableForMentoring?: boolean
}

export function EditEntryForm() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [entry, setEntry] = useState<EntryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form fields
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [city, setCity] = useState('')
  const [website, setWebsite] = useState('')
  const [x, setX] = useState('')
  const [instagram, setInstagram] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [youtube, setYoutube] = useState('')
  const [discord, setDiscord] = useState('')
  const [telegram, setTelegram] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  // startup-like
  const [foundedYear, setFoundedYear] = useState('')
  const [stage, setStage] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [sector, setSector] = useState('')
  const [services, setServices] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [hiring, setHiring] = useState(false)
  const [hiringUrl, setHiringUrl] = useState('')
  const [businessModel, setBusinessModel] = useState('')
  // community
  const [memberCount, setMemberCount] = useState('')
  const [meetupFrequency, setMeetupFrequency] = useState('')
  const [platform, setPlatform] = useState('')
  const [focusAreas, setFocusAreas] = useState<string[]>([])
  const [focusAreaInput, setFocusAreaInput] = useState('')
  // person
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [skills, setSkills] = useState('')
  const [email, setEmail] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [availableForHire, setAvailableForHire] = useState(false)
  const [availableForMentoring, setAvailableForMentoring] = useState(false)

  // Fetch entry
  useEffect(() => {
    async function fetchEntry() {
      try {
        const res = await fetch(`/api/submissions/entries?id=${id}`)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.error || 'No se pudo cargar la entrada')
          return
        }
        const data: EntryData = await res.json()
        setEntry(data)

        // Populate form
        setName(data.name || '')
        setTagline(data.tagline || '')
        setCity(data.city || '')
        setWebsite(data.website || '')
        setX(data.x || '')
        setInstagram(data.instagram || '')
        setLinkedin(data.linkedin || '')
        setGithub(data.github || '')
        setYoutube(data.youtube || '')
        setDiscord(data.discord || '')
        setTelegram(data.telegram || '')
        setTags(data.tags?.map((t) => t.tag) || [])
        setFoundedYear(data.foundedYear?.toString() || '')
        setStage(data.stage || '')
        setTeamSize(data.teamSize || '')
        setSector(data.sector || '')
        setServices(data.services?.map((s) => s.service).join(', ') || '')
        setTechnologies(data.technologies?.map((t) => t.technology).join(', ') || '')
        setHiring(data.hiring || false)
        setHiringUrl(data.hiringUrl || '')
        setBusinessModel(data.businessModel || '')
        setMemberCount(data.memberCount?.toString() || '')
        setMeetupFrequency(data.meetupFrequency || '')
        setPlatform(data.platform || '')
        setFocusAreas(data.focusAreas?.map((f) => f.area) || [])
        setRole(data.role || '')
        setCompany(data.company || '')
        setSkills(data.skills?.map((s) => s.skill).join(', ') || '')
        setEmail(data.email || '')
        setPortfolio(data.portfolio || '')
        setAvailableForHire(data.availableForHire || false)
        setAvailableForMentoring(data.availableForMentoring || false)
      } catch {
        setError('Error de conexion')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchEntry()
  }, [id])

  function csvToArray(value: string) {
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t])
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  function addFocusArea(area: string) {
    const a = area.trim()
    if (a && !focusAreas.includes(a) && focusAreas.length < 10) {
      setFocusAreas([...focusAreas, a])
      setFocusAreaInput('')
    }
  }

  function removeFocusArea(area: string) {
    setFocusAreas(focusAreas.filter((a) => a !== area))
  }

  const handleSave = useCallback(async () => {
    if (!entry) return
    setSaving(true)
    setSaved(false)

    const body: Record<string, unknown> = {
      id: entry.id,
      name,
      tagline: tagline || undefined,
      city,
      website: website || undefined,
      x: x || undefined,
      instagram: instagram || undefined,
      linkedin: linkedin || undefined,
      github: github || undefined,
      youtube: youtube || undefined,
      tags: tags.length > 0 ? tags.map((t) => ({ tag: t })) : undefined,
    }

    if (isStartupLike(entry.entryType)) {
      body.foundedYear = foundedYear ? Number(foundedYear) : undefined
      body.stage = stage || undefined
      body.teamSize = teamSize || undefined
      body.sector = sector || undefined
      const svcArr = csvToArray(services)
      body.services = svcArr.length > 0 ? svcArr.map((s) => ({ service: s })) : undefined
      const techArr = csvToArray(technologies)
      body.technologies = techArr.length > 0 ? techArr.map((t) => ({ technology: t })) : undefined
      body.hiring = hiring
      body.hiringUrl = hiring && hiringUrl ? hiringUrl : undefined
      body.businessModel = businessModel || undefined
    }

    if (entry.entryType === 'community') {
      body.memberCount = memberCount ? Number(memberCount) : undefined
      body.meetupFrequency = meetupFrequency || undefined
      body.platform = platform || undefined
      body.focusAreas = focusAreas.length > 0 ? focusAreas.map((a) => ({ area: a })) : undefined
      body.discord = discord || undefined
      body.telegram = telegram || undefined
    }

    if (entry.entryType === 'person') {
      body.role = role || undefined
      body.company = company || undefined
      const skillArr = csvToArray(skills)
      body.skills = skillArr.length > 0 ? skillArr.map((s) => ({ skill: s })) : undefined
      body.email = email || undefined
      body.portfolio = portfolio || undefined
      body.availableForHire = availableForHire
      body.availableForMentoring = availableForMentoring
    }

    try {
      const res = await fetch('/api/submissions/entries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setSaved(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Error al guardar')
      }
    } catch {
      setError('Error de conexion al guardar')
    } finally {
      setSaving(false)
    }
  }, [
    entry, name, tagline, city, website, x, instagram, linkedin, github, youtube,
    discord, telegram, tags, foundedYear, stage, teamSize, sector, services,
    technologies, hiring, hiringUrl, businessModel, memberCount, meetupFrequency,
    platform, focusAreas, role, company, skills, email, portfolio,
    availableForHire, availableForMentoring,
  ])

  return (
    <AuthGuard>
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Mis Proyectos', href: '/dashboard' },
              { label: 'Editar' },
            ]}
          />

          {loading && (
            <div className="space-y-4">
              <div className="animate-pulse h-8 w-48 bg-elevated rounded" />
              <div className="animate-pulse h-64 bg-elevated rounded-lg" />
            </div>
          )}

          {error && !loading && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-sm text-primary font-medium mb-2">Error</p>
              <p className="text-xs text-muted font-mono mb-4">{error}</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-xs font-mono text-accent hover:underline"
              >
                Volver al dashboard
              </button>
            </div>
          )}

          {!loading && !error && entry && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="p-1.5 rounded-md hover:bg-elevated transition-colors text-muted hover:text-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h1 className="text-xl font-bold text-primary">Editar entrada</h1>
                    <EntryBadge entryType={entry.entryType} />
                  </div>
                  <p className="text-xs text-muted font-mono">
                    {ENTRY_TYPE_CONFIG[entry.entryType]?.label} &middot; {entry.slug}
                  </p>
                </div>
              </div>

              {/* Moderation note */}
              {entry.moderationNote && entry._status === 'draft' && (
                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-xs uppercase font-mono mb-1">Nota de moderacion</p>
                    <p>{entry.moderationNote}</p>
                  </div>
                </div>
              )}

              {/* Success message */}
              {saved && (
                <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-xs uppercase font-mono mb-1">Cambios guardados</p>
                    <p>Tu entrada ha sido actualizada y sera revisada nuevamente por el equipo de moderacion.</p>
                  </div>
                </div>
              )}

              <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 md:p-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSave()
                  }}
                  className="space-y-8"
                >
                  {/* ── Basic info ── */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-sans font-bold text-primary">Informacion basica</h2>
                    <div className="space-y-3">
                      <label className="block">
                        <span className={labelClass}>Nombre *</span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className={labelClass}>Tagline</span>
                        <input
                          type="text"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          placeholder="Una frase corta descriptiva"
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className={labelClass}>Municipio *</span>
                        <select
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Selecciona un municipio</option>
                          {cities.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className={labelClass}>Sitio web</span>
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://tu-sitio.com"
                          className={inputClass}
                        />
                      </label>
                    </div>
                  </div>

                  {/* ── Type-specific: Startup-like ── */}
                  {isStartupLike(entry.entryType) && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-sans font-bold text-primary">Detalles</h2>
                      <div className="space-y-3">
                        <label className="block">
                          <span className={labelClass}>Sector</span>
                          <select value={sector} onChange={(e) => setSector(e.target.value)} className={selectClass}>
                            <option value="">Selecciona</option>
                            {SECTOR_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className={labelClass}>Ano de fundacion</span>
                          <input
                            type="number"
                            value={foundedYear}
                            onChange={(e) => setFoundedYear(e.target.value)}
                            placeholder="2024"
                            min="1900"
                            max="2100"
                            className={inputClass}
                          />
                        </label>
                        {entry.entryType === 'startup' && (
                          <label className="block">
                            <span className={labelClass}>Etapa</span>
                            <select value={stage} onChange={(e) => setStage(e.target.value)} className={selectClass}>
                              <option value="">Selecciona</option>
                              {STAGE_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                              ))}
                            </select>
                          </label>
                        )}
                        <label className="block">
                          <span className={labelClass}>Tamano del equipo</span>
                          <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className={selectClass}>
                            <option value="">Selecciona</option>
                            {TEAM_SIZE_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className={labelClass}>Servicios</span>
                          <input
                            type="text"
                            value={services}
                            onChange={(e) => setServices(e.target.value)}
                            placeholder="ej. Desarrollo web, Consultoria IT (separados por coma)"
                            className={inputClass}
                          />
                        </label>
                        <label className="block">
                          <span className={labelClass}>Tecnologias</span>
                          <input
                            type="text"
                            value={technologies}
                            onChange={(e) => setTechnologies(e.target.value)}
                            placeholder="ej. React, Python, AWS (separadas por coma)"
                            className={inputClass}
                          />
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={hiring}
                            onChange={(e) => setHiring(e.target.checked)}
                            id="hiring"
                            className={checkboxClass}
                          />
                          <label htmlFor="hiring" className={labelClass}>
                            Esta contratando
                          </label>
                        </div>
                        {hiring && (
                          <label className="block">
                            <span className={labelClass}>URL de vacantes</span>
                            <input
                              type="url"
                              value={hiringUrl}
                              onChange={(e) => setHiringUrl(e.target.value)}
                              placeholder="https://tu-empresa.com/careers"
                              className={inputClass}
                            />
                          </label>
                        )}
                        <label className="block">
                          <span className={labelClass}>Modelo de negocio</span>
                          <select value={businessModel} onChange={(e) => setBusinessModel(e.target.value)} className={selectClass}>
                            <option value="">Selecciona</option>
                            {BUSINESS_MODEL_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* ── Type-specific: Community ── */}
                  {entry.entryType === 'community' && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-sans font-bold text-primary">Detalles de comunidad</h2>
                      <div className="space-y-3">
                        <label className="block">
                          <span className={labelClass}>Numero de miembros</span>
                          <input
                            type="number"
                            value={memberCount}
                            onChange={(e) => setMemberCount(e.target.value)}
                            placeholder="100"
                            className={inputClass}
                          />
                        </label>
                        <label className="block">
                          <span className={labelClass}>Frecuencia de meetups</span>
                          <select value={meetupFrequency} onChange={(e) => setMeetupFrequency(e.target.value)} className={selectClass}>
                            <option value="">Selecciona</option>
                            {MEETUP_FREQUENCY_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className={labelClass}>Plataforma principal</span>
                          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={selectClass}>
                            <option value="">Selecciona</option>
                            {PLATFORM_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </label>
                        <div className="block">
                          <span className={`${labelClass} block mb-1`}>Areas de enfoque</span>
                          <div className="flex gap-2 flex-wrap mb-2">
                            {FOCUS_AREA_OPTIONS.map((o) => (
                              <button
                                key={o.value}
                                type="button"
                                onClick={() => addFocusArea(o.value)}
                                disabled={focusAreas.includes(o.value) || focusAreas.length >= 10}
                                className={`text-xs font-mono px-2 py-1 rounded border transition-colors disabled:opacity-40 ${
                                  focusAreas.includes(o.value)
                                    ? 'border-accent bg-accent/10 text-accent'
                                    : 'border-border bg-card text-muted hover:border-accent/50 hover:text-accent'
                                }`}
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={focusAreaInput}
                              onChange={(e) => setFocusAreaInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  addFocusArea(focusAreaInput)
                                }
                              }}
                              placeholder="Otra area personalizada"
                              className={`flex-1 px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors`}
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
                      </div>
                    </div>
                  )}

                  {/* ── Type-specific: Person ── */}
                  {entry.entryType === 'person' && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-sans font-bold text-primary">Perfil profesional</h2>
                      <div className="space-y-3">
                        <label className="block">
                          <span className={labelClass}>Rol</span>
                          <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="ej. Frontend Developer, CTO"
                            className={inputClass}
                          />
                        </label>
                        <label className="block">
                          <span className={labelClass}>Empresa</span>
                          <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Empresa actual"
                            className={inputClass}
                          />
                        </label>
                        <label className="block">
                          <span className={labelClass}>Habilidades</span>
                          <input
                            type="text"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="ej. React, Node.js, Python (separadas por coma)"
                            className={inputClass}
                          />
                        </label>
                        <label className="block">
                          <span className={labelClass}>Email de contacto</span>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className={inputClass}
                          />
                        </label>
                        <label className="block">
                          <span className={labelClass}>Portafolio</span>
                          <input
                            type="url"
                            value={portfolio}
                            onChange={(e) => setPortfolio(e.target.value)}
                            placeholder="https://tu-portafolio.com"
                            className={inputClass}
                          />
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={availableForHire}
                            onChange={(e) => setAvailableForHire(e.target.checked)}
                            id="availableForHire"
                            className={checkboxClass}
                          />
                          <label htmlFor="availableForHire" className={labelClass}>
                            Disponible para contratacion
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={availableForMentoring}
                            onChange={(e) => setAvailableForMentoring(e.target.checked)}
                            id="availableForMentoring"
                            className={checkboxClass}
                          />
                          <label htmlFor="availableForMentoring" className={labelClass}>
                            Disponible para mentoria
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Social links ── */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-sans font-bold text-primary">Redes sociales</h2>
                    <div className="space-y-3">
                      <label className="block">
                        <span className={labelClass}>X (Twitter)</span>
                        <input
                          type="text"
                          value={x}
                          onChange={(e) => setX(e.target.value)}
                          placeholder="@usuario"
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className={labelClass}>Instagram</span>
                        <input
                          type="text"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          placeholder="@usuario"
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className={labelClass}>LinkedIn</span>
                        <input
                          type="url"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/usuario"
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className={labelClass}>GitHub</span>
                        <input
                          type="text"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="usuario"
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className={labelClass}>YouTube</span>
                        <input
                          type="url"
                          value={youtube}
                          onChange={(e) => setYoutube(e.target.value)}
                          placeholder="https://youtube.com/@canal"
                          className={inputClass}
                        />
                      </label>
                      {entry.entryType === 'community' && (
                        <>
                          <label className="block">
                            <span className={labelClass}>Discord</span>
                            <input
                              type="url"
                              value={discord}
                              onChange={(e) => setDiscord(e.target.value)}
                              placeholder="https://discord.gg/..."
                              className={inputClass}
                            />
                          </label>
                          <label className="block">
                            <span className={labelClass}>Telegram</span>
                            <input
                              type="url"
                              value={telegram}
                              onChange={(e) => setTelegram(e.target.value)}
                              placeholder="https://t.me/..."
                              className={inputClass}
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Tags ── */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-sans font-bold text-primary">Etiquetas</h2>
                    <p className="text-sm text-secondary">Agrega hasta 10 etiquetas descriptivas.</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                        placeholder="Escribe y presiona Enter"
                        className={`flex-1 px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors`}
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        disabled={tags.length >= 10}
                        className="px-3 py-2 rounded-lg border border-border bg-card text-muted hover:text-accent hover:border-accent transition-colors disabled:opacity-40"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-accent/10 text-accent border border-accent/20"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted font-mono">{tags.length}/10 etiquetas</p>
                  </div>

                  {/* ── Submit ── */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <button
                      type="button"
                      onClick={() => router.push('/dashboard')}
                      className="text-xs font-mono text-muted hover:text-primary transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving || !name.trim() || !city}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-mono font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </section>
    </AuthGuard>
  )
}
