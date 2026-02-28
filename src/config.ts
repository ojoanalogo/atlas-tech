export const SITE_TITLE = "TECH_ATLAS";

export const EVENTS_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfpcM8hS7F6d7EZjYZe_IeM31VjNE-MarfJxjuK6BlAZPvsZJzVV5up-vnsejfnnSzrx4TLoe5jVG_/pub?output=csv";
export const SITE_DESCRIPTION =
  "Directorio del ecosistema tecnológico de Sinaloa — startups, consultorías, comunidades y personas.";

export const ENTRY_TYPES = [
  "startup",
  "community",
  "business",
  "consultory",
  "person",
] as const;

export type AtlasEntryType = (typeof ENTRY_TYPES)[number];

export interface EntryTypeConfig {
  label: string;
  labelPlural: string;
  description: string;
  badgeColor: string;
  icon: string;
  slug: string;
}

export const ENTRY_TYPE_CONFIG: Record<AtlasEntryType, EntryTypeConfig> = {
  startup: {
    label: "Startup",
    labelPlural: "Startups",
    description: "Empresas emergentes de tecnología en Sinaloa",
    badgeColor: "bg-emerald-500/90 text-emerald-50 border-emerald-500/60",
    icon: "rocket",
    slug: "startups",
  },
  community: {
    label: "Comunidad",
    labelPlural: "Comunidades",
    description: "Grupos y comunidades de tecnología locales",
    badgeColor: "bg-blue-500/90 text-blue-50 border-blue-500/60",
    icon: "users",
    slug: "comunidades",
  },
  business: {
    label: "Empresa",
    labelPlural: "Empresas",
    description: "Empresas establecidas de tecnología",
    badgeColor: "bg-purple-500/90 text-purple-50 border-purple-500/60",
    icon: "briefcase",
    slug: "empresas",
  },
  consultory: {
    label: "Consultoría",
    labelPlural: "Consultorías",
    description: "Empresas de consultoría y servicios tecnológicos",
    badgeColor: "bg-amber-500/90 text-amber-50 border-amber-500/60",
    icon: "briefcase",
    slug: "consultoras",
  },
  person: {
    label: "Persona",
    labelPlural: "Personas",
    description: "Talento tech destacado de la región",
    badgeColor: "bg-pink-500/90 text-pink-50 border-pink-500/60",
    icon: "user",
    slug: "personas",
  },
};

/** Helper to create a zeroed-out Record<AtlasEntryType, number> */
export function emptyTypeCounts(): Record<AtlasEntryType, number> {
  return Object.fromEntries(
    ENTRY_TYPES.map((t) => [t, 0]),
  ) as Record<AtlasEntryType, number>;
}

// --- Derived lookups (backward-compatible) ---

export const CATEGORY_URL_MAP: Record<AtlasEntryType, string> =
  Object.fromEntries(
    Object.entries(ENTRY_TYPE_CONFIG).map(([k, v]) => [k, v.slug]),
  ) as Record<AtlasEntryType, string>;

export const URL_CATEGORY_MAP: Record<string, AtlasEntryType> =
  Object.fromEntries(
    Object.entries(CATEGORY_URL_MAP).map(([k, v]) => [v, k as AtlasEntryType]),
  ) as Record<string, AtlasEntryType>;

export function getEntryUrl(entryType: AtlasEntryType, slug: string): string {
  return `/${CATEGORY_URL_MAP[entryType]}/${slug}`;
}

export interface NavLink {
  title: string;
  id?: string;
  url?: string;
  redirect?: string;
  tooltip?: string;
}

export const NAV_LINKS: NavLink[] = [
  ...ENTRY_TYPES.map((type) => {
    const c = ENTRY_TYPE_CONFIG[type];
    return {
      title: c.slug.toUpperCase(),
      id: c.slug,
      url: `/${c.slug}`,
      tooltip: c.description,
    };
  }),
  {
    title: "MAPA",
    id: "mapa",
    url: "/#map",
    tooltip: "Mapa interactivo",
  },
];

/** Main display categories (excludes "business" which groups with startup) */
export interface AtlasCategory {
  type: AtlasEntryType;
  label: string;
  description: string;
  icon: string;
  slug: string;
}

const DISPLAY_CATEGORIES: AtlasEntryType[] = [
  "startup",
  "consultory",
  "community",
  "person",
];

export const ATLAS_CATEGORIES: AtlasCategory[] = DISPLAY_CATEGORIES.map(
  (type) => ({
    type,
    label: ENTRY_TYPE_CONFIG[type].labelPlural,
    description: ENTRY_TYPE_CONFIG[type].description,
    icon: ENTRY_TYPE_CONFIG[type].icon,
    slug: ENTRY_TYPE_CONFIG[type].slug,
  }),
);

export interface Municipality {
  id: string;
  name: string;
}

export const SINALOA_MUNICIPALITIES: Municipality[] = [
  { id: "ahome", name: "Ahome" },
  { id: "angostura", name: "Angostura" },
  { id: "badiraguato", name: "Badiraguato" },
  { id: "choix", name: "Choix" },
  { id: "concordia", name: "Concordia" },
  { id: "cosala", name: "Cosalá" },
  { id: "culiacan", name: "Culiacán" },
  { id: "el-fuerte", name: "El Fuerte" },
  { id: "elota", name: "Elota" },
  { id: "escuinapa", name: "Escuinapa" },
  { id: "guasave", name: "Guasave" },
  { id: "mazatlan", name: "Mazatlán" },
  { id: "mocorito", name: "Mocorito" },
  { id: "navolato", name: "Navolato" },
  { id: "rosario", name: "Rosario" },
  {
    id: "salvador-alvarado",
    name: "Salvador Alvarado",
  },
  { id: "san-ignacio", name: "San Ignacio" },
  {
    id: "sinaloa-de-leyva",
    name: "Sinaloa de Leyva",
  },
];

export const MUNICIPALITY_IDS = SINALOA_MUNICIPALITIES.map((m) => m.id);

/** All valid municipality IDs including "global" for non-location-specific entries */
export const ALL_MUNICIPALITY_IDS = ["global", ...MUNICIPALITY_IDS];

/** Get display name for a municipality ID */
export function getMunicipalityName(id: string): string {
  if (id === "global") return "Global";
  return SINALOA_MUNICIPALITIES.find((m) => m.id === id)?.name ?? id;
}

export type SocialPlatform = "x" | "github" | "instagram" | "linkedin";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "x",
    url: "https://x.com/techatlas_mx",
    label: "X",
  },
  {
    platform: "github",
    url: "https://github.com/techatlas-mx",
    label: "Github",
  },
  {
    platform: "linkedin",
    url: "https://linkedin.com/company/techatlas",
    label: "Linkedin",
  },
];
