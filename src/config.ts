export const SITE_TITLE = "TECH_ATLAS";

export const EVENTS_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfpcM8hS7F6d7EZjYZe_IeM31VjNE-MarfJxjuK6BlAZPvsZJzVV5up-vnsejfnnSzrx4TLoe5jVG_/pub?output=csv";
export const SITE_DESCRIPTION =
  "Directorio del ecosistema tecnológico de Sinaloa — startups, consultorías, comunidades y personas.";

export type AtlasEntryType =
  | "startup"
  | "community"
  | "business"
  | "consultory"
  | "person";

export interface NavLink {
  title: string;
  id?: string;
  url?: string;
  redirect?: string;
  tooltip?: string;
}

export const CATEGORY_URL_MAP: Record<AtlasEntryType, string> = {
  startup: "startups",
  consultory: "consultoras",
  community: "comunidades",
  person: "personas",
  business: "empresas",
};

export const URL_CATEGORY_MAP: Record<string, AtlasEntryType> =
  Object.fromEntries(
    Object.entries(CATEGORY_URL_MAP).map(([k, v]) => [v, k as AtlasEntryType]),
  ) as Record<string, AtlasEntryType>;

export function getEntryUrl(entryType: AtlasEntryType, slug: string): string {
  return `/${CATEGORY_URL_MAP[entryType]}/${slug}`;
}

export const NAV_LINKS: NavLink[] = [
  {
    title: "STARTUPS",
    id: "startups",
    url: "/directorio#type=startup",
    tooltip: "Startups de Sinaloa",
  },
  {
    title: "CONSULTORAS",
    id: "consultoras",
    url: "/directorio#type=consultory",
    tooltip: "Consultorías tech",
  },
  {
    title: "PERSONAS",
    id: "personas",
    url: "/directorio#type=person",
    tooltip: "Talento local",
  },
  {
    title: "COMUNIDADES",
    id: "comunidades",
    url: "/directorio#type=community",
    tooltip: "Comunidades tech",
  },
  {
    title: "MAPA",
    id: "mapa",
    url: "/#map",
    tooltip: "Mapa interactivo",
  },
];

export interface AtlasCategory {
  type: AtlasEntryType;
  label: string;
  description: string;
  icon: string;
}

export const ATLAS_CATEGORIES: AtlasCategory[] = [
  {
    type: "startup",
    label: "Startups",
    description: "Empresas emergentes de tecnología en Sinaloa",
    icon: "rocket",
  },
  {
    type: "consultory",
    label: "Consultorías",
    description: "Empresas de consultoría y servicios tecnológicos",
    icon: "briefcase",
  },
  {
    type: "community",
    label: "Comunidades",
    description: "Grupos y comunidades de tecnología locales",
    icon: "users",
  },
  {
    type: "person",
    label: "Personas",
    description: "Talento tech destacado de la región",
    icon: "heart",
  },
];

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
