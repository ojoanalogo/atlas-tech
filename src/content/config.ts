import { defineCollection, z } from "astro:content";
import { ALL_CITY_IDS, ENTRY_TYPES } from "../config";

const cityEnum = z.enum(
  ALL_CITY_IDS as unknown as readonly [string, ...string[]],
);
const entryTypeEnum = z.enum(ENTRY_TYPES);

const atlasSchema = ({ image }: { image: Function }) =>
  z.object({
    // Base fields (all types)
    entryType: entryTypeEnum,
    name: z.string(),
    tagline: z.string().optional(),
    logo: image().optional(),
    coverImage: image().optional(),
    city: cityEnum,
    state: z.string().default("Sinaloa"),
    country: z.string().default("México"),
    tags: z.array(z.string()).default([]),
    verified: z.boolean().optional(),
    website: z.string().url().optional(),
    x: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    youtube: z.string().optional(),
    publishDate: z.coerce.date().optional(),
    featured: z.boolean().optional(),

    // Startup/business/consultory extras
    foundedYear: z.number().optional(),
    stage: z.string().optional(),
    teamSize: z.string().optional(),
    sector: z.string().optional(),
    services: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    hiring: z.boolean().optional(),
    hiringUrl: z.string().url().optional(),
    businessModel: z.string().optional(),

    // Community extras
    memberCount: z.number().optional(),
    meetupFrequency: z.string().optional(),
    discord: z.string().optional(),
    telegram: z.string().optional(),
    platform: z.string().optional(),
    focusAreas: z.array(z.string()).optional(),

    // Person extras
    role: z.string().optional(),
    company: z.string().optional(),
    skills: z.array(z.string()).optional(),
    availableForHire: z.boolean().optional(),
    availableForMentoring: z.boolean().optional(),
    email: z.string().email().optional(),
    portfolio: z.string().url().optional(),
  });

const atlasCollection = defineCollection({ schema: atlasSchema });

export const collections = {
  atlas: atlasCollection,
};
