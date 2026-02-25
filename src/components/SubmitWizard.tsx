import { useState, useRef } from "react";
const BASE = import.meta.env.BASE_URL;

import {
  Rocket,
  Users,
  Briefcase,
  GraduationCap,
  User,
  ArrowLeft,
  ArrowRight,
  Send,
  X,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const FORMCARRY_URL = "https://formcarry.com/s/0SLLJVV-2qL";

type EntryType = "startup" | "community" | "business" | "consultory" | "person";

interface MunicipalityOption {
  id: string;
  name: string;
}

interface Props {
  municipalities: MunicipalityOption[];
}

const ENTRY_TYPES: { type: EntryType; label: string; desc: string; icon: typeof Rocket }[] = [
  { type: "startup", label: "Startup", desc: "Empresa emergente de tecnología", icon: Rocket },
  { type: "community", label: "Comunidad", desc: "Grupo o comunidad tech", icon: Users },
  { type: "business", label: "Empresa", desc: "Empresa establecida", icon: Briefcase },
  { type: "consultory", label: "Consultoría", desc: "Servicios de consultoría tech", icon: GraduationCap },
  { type: "person", label: "Persona", desc: "Talento tech individual", icon: User },
];

const STEPS = [
  "Tipo",
  "Info básica",
  "Ubicación",
  "Enlaces",
  "Detalles",
  "Etiquetas",
  "Envío",
];

export default function SubmitWizard({ municipalities }: Props) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  // Step 0: Tipo
  const [entryType, setEntryType] = useState<EntryType | "">("");

  // Step 1: Info básica
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Ubicación
  const [municipality, setMunicipality] = useState("");

  // Step 3: Enlaces
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [discord, setDiscord] = useState("");
  const [telegram, setTelegram] = useState("");

  // Step 4: Detalles
  const [foundedYear, setFoundedYear] = useState("");
  const [stage, setStage] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [sector, setSector] = useState("");
  const [memberCount, setMemberCount] = useState("");
  const [meetupFrequency, setMeetupFrequency] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [email, setEmail] = useState("");

  // Step 5: Etiquetas
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Step 6: Imágenes
  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  function canAdvance(): boolean {
    switch (step) {
      case 0: return entryType !== "";
      case 1: return name.trim() !== "" && description.trim() !== "";
      case 2: return municipality !== "";
      default: return true;
    }
  }

  function next() {
    if (canAdvance() && step < STEPS.length - 1) setStep(step + 1);
  }

  function prev() {
    if (step > 0) setStep(step - 1);
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("entryType", entryType);
      fd.append("name", name);
      if (tagline) fd.append("tagline", tagline);
      fd.append("description", description);
      fd.append("municipality", municipality);
      if (website) fd.append("website", website);
      if (twitter) fd.append("twitter", twitter);
      if (linkedin) fd.append("linkedin", linkedin);
      if (github) fd.append("github", github);
      if (discord) fd.append("discord", discord);
      if (telegram) fd.append("telegram", telegram);

      // Type-specific fields
      if (entryType === "startup" || entryType === "business" || entryType === "consultory") {
        if (foundedYear) fd.append("foundedYear", foundedYear);
        if (stage) fd.append("stage", stage);
        if (teamSize) fd.append("teamSize", teamSize);
        if (sector) fd.append("sector", sector);
      }
      if (entryType === "community") {
        if (memberCount) fd.append("memberCount", memberCount);
        if (meetupFrequency) fd.append("meetupFrequency", meetupFrequency);
      }
      if (entryType === "person") {
        if (role) fd.append("role", role);
        if (company) fd.append("company", company);
        if (skills) fd.append("skills", skills);
        if (email) fd.append("email", email);
      }

      if (tags.length > 0) fd.append("tags", tags.join(", "));

      const logoFile = logoRef.current?.files?.[0];
      const coverFile = coverRef.current?.files?.[0];
      if (logoFile) fd.append("logo", logoFile);
      if (coverFile) fd.append("coverImage", coverFile);

      const res = await fetch(FORMCARRY_URL, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setResult("success");
      } else {
        setResult("error");
      }
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  if (result === "success") {
    return (
      <div className="text-center py-16 space-y-4">
        <CheckCircle className="w-16 h-16 mx-auto text-accent" />
        <h2 className="text-2xl font-sans font-bold text-primary">
          Proyecto enviado
        </h2>
        <p className="text-secondary max-w-md mx-auto">
          Tu proyecto ha sido recibido. Lo revisaremos y lo agregaremos al
          directorio pronto.
        </p>
        <a
          href={`${BASE}directorio`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-mono font-semibold text-sm rounded-lg hover:bg-accent/90 transition-colors mt-4"
        >
          VER DIRECTORIO
        </a>
      </div>
    );
  }

  if (result === "error") {
    return (
      <div className="text-center py-16 space-y-4">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
        <h2 className="text-2xl font-sans font-bold text-primary">
          Error al enviar
        </h2>
        <p className="text-secondary max-w-md mx-auto">
          Hubo un problema al enviar tu proyecto. Por favor intenta de nuevo.
        </p>
        <button
          onClick={() => setResult(null)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-mono font-semibold text-sm rounded-lg hover:bg-accent/90 transition-colors mt-4"
        >
          INTENTAR DE NUEVO
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div
              className={`h-1.5 rounded-full flex-1 transition-colors ${
                i <= step ? "bg-accent" : "bg-border"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted">
          PASO {step + 1} DE {STEPS.length}
        </span>
        <span className="text-xs font-mono text-accent">{STEPS[step]}</span>
      </div>

      {/* Step 0: Tipo */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-sans font-bold text-primary">
            Tipo de proyecto
          </h2>
          <p className="text-sm text-secondary">
            Selecciona la categoría que mejor describe tu proyecto.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {ENTRY_TYPES.map(({ type, label, desc, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setEntryType(type)}
                className={`flex items-start gap-3 p-4 rounded-lg border text-left transition-colors ${
                  entryType === type
                    ? "border-accent bg-accent/10"
                    : "border-border bg-card hover:border-accent/30"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    entryType === type ? "text-accent" : "text-muted"
                  }`}
                />
                <div>
                  <div
                    className={`font-mono text-sm font-semibold ${
                      entryType === type ? "text-accent" : "text-primary"
                    }`}
                  >
                    {label}
                  </div>
                  <div className="text-xs text-muted mt-0.5">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Info básica */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-sans font-bold text-primary">
            Información básica
          </h2>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Nombre *
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Nombre del proyecto"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Tagline
              </span>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Una frase corta que describe tu proyecto"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Descripción *
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Describe tu proyecto en detalle"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors resize-y"
              />
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Ubicación */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-sans font-bold text-primary">
            Ubicación
          </h2>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Municipio *
              </span>
              <select
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">Selecciona un municipio</option>
                {municipalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      {/* Step 3: Enlaces */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-sans font-bold text-primary">Enlaces</h2>
          <p className="text-sm text-secondary">Todos los campos son opcionales.</p>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Sitio web
              </span>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://tu-sitio.com"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Twitter
              </span>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@usuario"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                LinkedIn
              </span>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/usuario"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                GitHub
              </span>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="usuario"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </label>
            {entryType === "community" && (
              <>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Discord
                  </span>
                  <input
                    type="url"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    placeholder="https://discord.gg/..."
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Telegram
                  </span>
                  <input
                    type="url"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="https://t.me/..."
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                  />
                </label>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Detalles */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-sans font-bold text-primary">
            Detalles
          </h2>
          <p className="text-sm text-secondary">
            Campos específicos según el tipo de proyecto. Todos opcionales.
          </p>
          <div className="space-y-3">
            {(entryType === "startup" ||
              entryType === "business" ||
              entryType === "consultory") && (
              <>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Año de fundación
                  </span>
                  <input
                    type="number"
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(e.target.value)}
                    placeholder="2024"
                    min="1900"
                    max="2100"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Etapa
                  </span>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="">Selecciona</option>
                    <option value="Idea">Idea</option>
                    <option value="Pre-seed">Pre-seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Serie A">Serie A</option>
                    <option value="Serie B+">Serie B+</option>
                    <option value="Establecida">Establecida</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Tamaño del equipo
                  </span>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="">Selecciona</option>
                    <option value="1-5">1-5</option>
                    <option value="6-15">6-15</option>
                    <option value="16-50">16-50</option>
                    <option value="51-200">51-200</option>
                    <option value="200+">200+</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Sector
                  </span>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="ej. Fintech, SaaS, Edtech"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                  />
                </label>
              </>
            )}
            {entryType === "community" && (
              <>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Número de miembros
                  </span>
                  <input
                    type="number"
                    value={memberCount}
                    onChange={(e) => setMemberCount(e.target.value)}
                    placeholder="100"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Frecuencia de meetups
                  </span>
                  <input
                    type="text"
                    value={meetupFrequency}
                    onChange={(e) => setMeetupFrequency(e.target.value)}
                    placeholder="ej. Semanal, Mensual, Permanente"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                  />
                </label>
              </>
            )}
            {entryType === "person" && (
              <>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Rol
                  </span>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="ej. Frontend Developer, CTO"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Empresa
                  </span>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Empresa actual"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Habilidades
                  </span>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="ej. React, Node.js, Python (separadas por coma)"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Email de contacto
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                  />
                </label>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 5: Etiquetas */}
      {step === 5 && (
        <div className="space-y-4">
          <h2 className="text-xl font-sans font-bold text-primary">
            Etiquetas
          </h2>
          <p className="text-sm text-secondary">
            Agrega hasta 10 etiquetas que describan tu proyecto.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Escribe y presiona Enter"
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
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
          <p className="text-xs text-muted font-mono">
            {tags.length}/10 etiquetas
          </p>
        </div>
      )}

      {/* Step 6: Imágenes & envío */}
      {step === 6 && (
        <div className="space-y-6">
          <h2 className="text-xl font-sans font-bold text-primary">
            Imágenes y envío
          </h2>

          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Logo
              </span>
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                className="mt-1 w-full text-sm text-muted font-mono file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:text-sm file:font-mono file:font-semibold file:bg-card file:text-primary hover:file:border-accent file:transition-colors file:cursor-pointer"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Imagen de portada
              </span>
              <input
                ref={coverRef}
                type="file"
                accept="image/*"
                className="mt-1 w-full text-sm text-muted font-mono file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:text-sm file:font-mono file:font-semibold file:bg-card file:text-primary hover:file:border-accent file:transition-colors file:cursor-pointer"
              />
            </label>
          </div>

          {/* Review summary */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-3">
              Resumen
            </h3>
            <SummaryRow label="Tipo" value={ENTRY_TYPES.find((t) => t.type === entryType)?.label} />
            <SummaryRow label="Nombre" value={name} />
            {tagline && <SummaryRow label="Tagline" value={tagline} />}
            <SummaryRow label="Municipio" value={municipalities.find((m) => m.id === municipality)?.name} />
            {website && <SummaryRow label="Web" value={website} />}
            {tags.length > 0 && (
              <SummaryRow label="Etiquetas" value={tags.join(", ")} />
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        {step > 0 ? (
          <button
            type="button"
            onClick={prev}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-primary font-mono font-semibold text-xs rounded-lg hover:border-accent/50 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            ANTERIOR
          </button>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground font-mono font-semibold text-xs rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            SIGUIENTE
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground font-mono font-semibold text-xs rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                ENVIANDO...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                ENVIAR PROYECTO
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-muted shrink-0">{label}</span>
      <span className="text-xs font-mono text-primary text-right">{value}</span>
    </div>
  );
}
