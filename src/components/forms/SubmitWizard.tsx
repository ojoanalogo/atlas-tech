import { useState, useRef } from "react";
import {
  Rocket,
  Users,
  Briefcase,
  User,
  ArrowLeft,
  ArrowRight,
  Send,
  X,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
  LayoutGrid,
  FileText,
  SlidersHorizontal,
  Globe,
  UserCircle,
} from "lucide-react";
import {
  ENTRY_TYPES as ALL_ENTRY_TYPES,
  ENTRY_TYPE_CONFIG,
  N8N_WEBHOOK_URL,
  STAGE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  PLATFORM_OPTIONS,
  SECTOR_OPTIONS,
  MEETUP_FREQUENCY_OPTIONS,
  FOCUS_AREA_OPTIONS,
  BUSINESS_MODEL_OPTIONS,
  type AtlasEntryType,
} from "../../config";

type EntryType = AtlasEntryType;

interface CityOption {
  id: string;
  name: string;
}

interface Props {
  cities: CityOption[];
}

const ICON_MAP: Record<string, typeof Rocket> = {
  rocket: Rocket,
  users: Users,
  briefcase: Briefcase,
  user: User,
};

const ENTRY_TYPES = ALL_ENTRY_TYPES.map((type) => ({
  type,
  label: ENTRY_TYPE_CONFIG[type].label,
  desc: ENTRY_TYPE_CONFIG[type].description,
  icon: ICON_MAP[ENTRY_TYPE_CONFIG[type].icon] || Rocket,
}));

const STEPS = [
  { label: "Tipo", icon: LayoutGrid },
  { label: "Información", icon: FileText },
  { label: "Detalles", icon: SlidersHorizontal },
  { label: "Enlaces", icon: Globe },
  { label: "Contacto", icon: UserCircle },
  { label: "Envío", icon: Send },
];

const TYPE_COPY: Record<
  EntryType,
  {
    entityName: string;
    namePlaceholder: string;
    taglinePlaceholder: string;
    descriptionPlaceholder: string;
    successTitle: string;
    successMessage: string;
  }
> = {
  startup: {
    entityName: "startup",
    namePlaceholder: "Nombre de la startup",
    taglinePlaceholder: "Una frase corta que describe tu startup",
    descriptionPlaceholder: "Describe tu startup en detalle",
    successTitle: "Startup enviada",
    successMessage:
      "Tu startup ha sido recibida. La revisaremos y la agregaremos al directorio pronto.",
  },
  business: {
    entityName: "empresa",
    namePlaceholder: "Nombre de la empresa",
    taglinePlaceholder: "Una frase corta que describe tu empresa",
    descriptionPlaceholder: "Describe tu empresa en detalle",
    successTitle: "Empresa enviada",
    successMessage:
      "Tu empresa ha sido recibida. La revisaremos y la agregaremos al directorio pronto.",
  },
  consultory: {
    entityName: "consultoría",
    namePlaceholder: "Nombre de la consultoría",
    taglinePlaceholder: "Una frase corta que describe tu consultoría",
    descriptionPlaceholder: "Describe tu consultoría en detalle",
    successTitle: "Consultoría enviada",
    successMessage:
      "Tu consultoría ha sido recibida. La revisaremos y la agregaremos al directorio pronto.",
  },
  community: {
    entityName: "comunidad",
    namePlaceholder: "Nombre de la comunidad",
    taglinePlaceholder: "Una frase corta que describe tu comunidad",
    descriptionPlaceholder: "Describe tu comunidad en detalle",
    successTitle: "Comunidad enviada",
    successMessage:
      "Tu comunidad ha sido recibida. La revisaremos y la agregaremos al directorio pronto.",
  },
  person: {
    entityName: "perfil",
    namePlaceholder: "Tu nombre completo",
    taglinePlaceholder: "Tu título profesional o especialidad",
    descriptionPlaceholder: "Cuéntanos sobre ti, tu experiencia y lo que haces",
    successTitle: "Perfil enviado",
    successMessage:
      "Tu perfil ha sido recibido. Lo revisaremos y lo agregaremos al directorio pronto.",
  },
};

export default function SubmitWizard({ cities }: Props) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  // Step 0: Tipo
  const [entryType, setEntryType] = useState<EntryType | "">("");
  const copy = entryType ? TYPE_COPY[entryType] : null;

  // Step 1: Info básica + Ubicación
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");

  // Step 2: Detalles (type-specific)
  const [foundedYear, setFoundedYear] = useState("");
  const [stage, setStage] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [sector, setSector] = useState("");
  const [services, setServices] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [hiring, setHiring] = useState(false);
  const [hiringUrl, setHiringUrl] = useState("");
  const [memberCount, setMemberCount] = useState("");
  const [meetupFrequency, setMeetupFrequency] = useState("");
  const [platform, setPlatform] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [focusAreaInput, setFocusAreaInput] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [email, setEmail] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [availableForHire, setAvailableForHire] = useState(false);
  const [availableForMentoring, setAvailableForMentoring] = useState(false);

  // Step 3: Enlaces + Etiquetas
  const [website, setWebsite] = useState("");
  const [x, setX] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [youtube, setYoutube] = useState("");
  const [discord, setDiscord] = useState("");
  const [telegram, setTelegram] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Step 4: Contacto (submitter info)
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [submitterPhone, setSubmitterPhone] = useState("");

  // Step 5: Imágenes & envío
  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  function handleFilePreview(
    file: File | undefined,
    setter: (url: string | null) => void,
  ) {
    if (file) {
      const url = URL.createObjectURL(file);
      setter(url);
    } else {
      setter(null);
    }
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0:
        return entryType !== "";
      case 1:
        return name.trim() !== "" && description.trim() !== "" && city !== "";
      case 4:
        return submitterName.trim() !== "" && submitterEmail.trim() !== "";
      default:
        return true;
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

  function csvToArray(value: string): string[] | undefined {
    const arr = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return arr.length > 0 ? arr : undefined;
  }

  function buildPayload() {
    return {
      entryType,
      name,
      tagline: tagline || undefined,
      description,
      city,
      // Flat link fields (match Astro schema)
      website: website || undefined,
      x: x || undefined,
      instagram: instagram || undefined,
      linkedin: linkedin || undefined,
      github: github || undefined,
      youtube: youtube || undefined,
      discord: discord || undefined,
      telegram: telegram || undefined,
      tags: tags.length > 0 ? tags : undefined,
      foundedYear: foundedYear ? Number(foundedYear) : undefined,
      stage: stage || undefined,
      teamSize: teamSize || undefined,
      sector: sector || undefined,
      services: csvToArray(services),
      technologies: csvToArray(technologies),
      hiring: hiring || undefined,
      hiringUrl: hiringUrl || undefined,
      memberCount: memberCount ? Number(memberCount) : undefined,
      meetupFrequency: meetupFrequency || undefined,
      platform: platform || undefined,
      focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
      businessModel: businessModel || undefined,
      role: role || undefined,
      company: company || undefined,
      skills: csvToArray(skills),
      email: email || undefined,
      portfolio: portfolio || undefined,
      availableForHire: availableForHire || undefined,
      availableForMentoring: availableForMentoring || undefined,
      submitter: {
        name: submitterName,
        email: submitterEmail,
        phone: submitterPhone || undefined,
      },
    };
  }

  async function handleSubmit() {
    setSubmitting(true);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("payload", JSON.stringify(buildPayload()));

      const logoFile = logoRef.current?.files?.[0];
      const coverFile = coverRef.current?.files?.[0];
      if (logoFile) fd.append("logo", logoFile);
      if (coverFile) fd.append("coverImage", coverFile);

      const res = await fetch(N8N_WEBHOOK_URL, {
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
          {copy?.successTitle ?? "Registro enviado"}
        </h2>
        <p className="text-secondary max-w-md mx-auto">
          {copy?.successMessage ??
            "Tu registro ha sido recibido. Lo revisaremos y lo agregaremos al directorio pronto."}
        </p>
        <a
          href="/directorio"
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
          Hubo un problema al enviar tu registro. Por favor intenta de nuevo.
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

  const CurrentStepIcon = STEPS[step].icon;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {/* Step header */}
      <div className="space-y-4">
        {/* Progress bars */}
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  i <= step ? "bg-accent" : "bg-border"
                }`}
              />
            </div>
          ))}
        </div>
        {/* Step info with icon */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <CurrentStepIcon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <span className="text-xs font-mono text-muted block leading-tight">
              PASO {step + 1} DE {STEPS.length}
            </span>
            <span className="text-sm font-mono font-semibold text-accent tracking-wide">
              {STEPS[step].label.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Step 0: Tipo */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-sans font-bold text-primary">
            Tipo de registro
          </h2>
          <p className="text-sm text-secondary">
            Selecciona la categoría que mejor te describe.
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

      {/* Step 1: Información (básica + ubicación) */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-sans font-bold text-primary">
            Información
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
                placeholder={copy?.namePlaceholder ?? "Nombre"}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
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
                placeholder={
                  copy?.taglinePlaceholder ?? "Una frase corta descriptiva"
                }
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Acerca de *
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder={
                  copy?.descriptionPlaceholder ?? "Describe en detalle"
                }
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors resize-y"
              />
              <p className="text-xs text-muted mt-1 font-mono">
                Este texto será el contenido principal de tu entrada en el
                directorio.
              </p>
            </label>
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Municipio *
              </span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm focus:outline-hidden focus:border-accent transition-colors"
              >
                <option value="">Selecciona un municipio</option>
                {cities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Detalles */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-sans font-bold text-primary">Detalles</h2>
          <p className="text-sm text-secondary">
            {entryType === "person"
              ? "Información sobre tu perfil profesional. Todos opcionales."
              : entryType === "community"
                ? "Información sobre tu comunidad. Todos opcionales."
                : "Campos específicos según el tipo de proyecto. Todos opcionales."}
          </p>
          <div className="space-y-3">
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
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
                  />
                </label>
                {entryType === "startup" && (
                  <label className="block">
                    <span className="text-xs font-mono text-muted uppercase tracking-wider">
                      Etapa
                    </span>
                    <select
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm focus:outline-hidden focus:border-accent transition-colors"
                    >
                      <option value="">Selecciona</option>
                      {STAGE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Tamaño del equipo
                  </span>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm focus:outline-hidden focus:border-accent transition-colors"
                  >
                    <option value="">Selecciona</option>
                    {TEAM_SIZE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Servicios
                  </span>
                  <input
                    type="text"
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    placeholder="ej. Desarrollo web, Consultoría IT (separados por coma)"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Tecnologías
                  </span>
                  <input
                    type="text"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder="ej. React, Python, AWS (separadas por coma)"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
                  />
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={hiring}
                    onChange={(e) => setHiring(e.target.checked)}
                    id="hiring"
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <label
                    htmlFor="hiring"
                    className="text-xs font-mono text-muted uppercase tracking-wider"
                  >
                    Está contratando
                  </label>
                </div>
                {hiring && (
                  <label className="block">
                    <span className="text-xs font-mono text-muted uppercase tracking-wider">
                      URL de vacantes
                    </span>
                    <input
                      type="url"
                      value={hiringUrl}
                      onChange={(e) => setHiringUrl(e.target.value)}
                      placeholder="https://tu-empresa.com/careers"
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
                    />
                  </label>
                )}
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
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
                  />
                </label>
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
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Plataforma principal
                  </span>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm focus:outline-hidden focus:border-accent transition-colors"
                  >
                    <option value="">Selecciona</option>
                    {PLATFORM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-1">
                    Áreas de enfoque
                  </span>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {FOCUS_AREA_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => addFocusArea(o.value)}
                        disabled={
                          focusAreas.includes(o.value) ||
                          focusAreas.length >= 10
                        }
                        className={`text-xs font-mono px-2 py-1 rounded border transition-colors disabled:opacity-40 ${
                          focusAreas.includes(o.value)
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border bg-card text-muted hover:border-accent/50 hover:text-accent"
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
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addFocusArea(focusAreaInput);
                        }
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
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
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
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
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
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
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
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    Portafolio
                  </span>
                  <input
                    type="url"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://tu-portafolio.com"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
                  />
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={availableForHire}
                    onChange={(e) => setAvailableForHire(e.target.checked)}
                    id="availableForHire"
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <label
                    htmlFor="availableForHire"
                    className="text-xs font-mono text-muted uppercase tracking-wider"
                  >
                    Disponible para contratación
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={availableForMentoring}
                    onChange={(e) => setAvailableForMentoring(e.target.checked)}
                    id="availableForMentoring"
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <label
                    htmlFor="availableForMentoring"
                    className="text-xs font-mono text-muted uppercase tracking-wider"
                  >
                    Disponible para mentoría
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Enlaces + Etiquetas */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-sans font-bold text-primary">
              Enlaces
            </h2>
            <p className="text-sm text-secondary">
              Todos los campos son opcionales.
            </p>
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
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
                />
              </label>
              <label className="block">
                <span className="text-xs font-mono text-muted uppercase tracking-wider">
                  X
                </span>
                <input
                  type="text"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  placeholder="@usuario"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
                />
              </label>
              <label className="block">
                <span className="text-xs font-mono text-muted uppercase tracking-wider">
                  Instagram
                </span>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@usuario"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
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
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
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
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
                />
              </label>
              <label className="block">
                <span className="text-xs font-mono text-muted uppercase tracking-wider">
                  YouTube
                </span>
                <input
                  type="url"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@canal"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
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
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
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
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-border" />

          <div className="space-y-4">
            <h3 className="text-lg font-sans font-bold text-primary">
              Etiquetas
            </h3>
            <p className="text-sm text-secondary">
              Agrega hasta 10 etiquetas que describan tu{" "}
              {copy?.entityName ?? "registro"}.
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
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
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
        </div>
      )}

      {/* Step 4: Contacto (submitter info) */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-sans font-bold text-primary">
            Datos de contacto
          </h2>
          <p className="text-sm text-secondary">
            Tu información para que podamos comunicarnos contigo sobre este
            registro.
          </p>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Tu nombre *
              </span>
              <input
                type="text"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                required
                placeholder="Nombre completo"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Tu email *
              </span>
              <input
                type="email"
                value={submitterEmail}
                onChange={(e) => setSubmitterEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Tu teléfono
              </span>
              <input
                type="tel"
                value={submitterPhone}
                onChange={(e) => setSubmitterPhone(e.target.value)}
                placeholder="+52 667 123 4567"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors"
              />
            </label>
          </div>
        </div>
      )}

      {/* Step 5: Imágenes & envío */}
      {step === 5 && (
        <div className="space-y-6">
          <h2 className="text-xl font-sans font-bold text-primary">
            Imágenes y envío
          </h2>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-1">
                Logo
              </span>
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFilePreview(e.target.files?.[0], setLogoPreview)
                }
                className="w-full text-sm text-muted font-mono file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:text-sm file:font-mono file:font-semibold file:bg-card file:text-primary hover:file:border-accent file:transition-colors file:cursor-pointer"
              />
              {logoPreview && (
                <div className="mt-2 relative w-20 h-20">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-20 h-20 rounded-lg border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview(null);
                      if (logoRef.current) logoRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div>
              <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-1">
                Imagen de portada
              </span>
              <input
                ref={coverRef}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFilePreview(e.target.files?.[0], setCoverPreview)
                }
                className="w-full text-sm text-muted font-mono file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:text-sm file:font-mono file:font-semibold file:bg-card file:text-primary hover:file:border-accent file:transition-colors file:cursor-pointer"
              />
              {coverPreview && (
                <div className="mt-2 relative">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full max-h-48 rounded-lg border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverPreview(null);
                      if (coverRef.current) coverRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Review summary */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-3">
              Resumen
            </h3>
            <SummaryRow
              label="Tipo"
              value={ENTRY_TYPES.find((t) => t.type === entryType)?.label}
            />
            <SummaryRow label="Nombre" value={name} />
            {tagline && <SummaryRow label="Tagline" value={tagline} />}
            <SummaryRow
              label="Municipio"
              value={cities.find((m) => m.id === city)?.name}
            />
            {website && <SummaryRow label="Web" value={website} />}
            {tags.length > 0 && (
              <SummaryRow label="Etiquetas" value={tags.join(", ")} />
            )}
            <SummaryRow label="Contacto" value={submitterName} />
            <SummaryRow label="Email" value={submitterEmail} />
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
                ENVIAR
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
