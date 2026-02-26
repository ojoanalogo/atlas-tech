import { defineCollection, z } from "astro:content";
import { ALL_MUNICIPALITY_IDS } from "../config";

const municipalityEnum = z.enum(ALL_MUNICIPALITY_IDS as [string, ...string[]]);

const atlasSchema = ({ image }: { image: Function }) =>
  z.object({
    // Base fields (all types)
    entryType: z.enum([
      "startup",
      "community",
      "business",
      "consultory",
      "person",
    ]),
    name: z.string(),
    tagline: z.string().optional(),
    description: z.string(),
    logo: image().optional(),
    coverImage: image().optional(),
    municipality: municipalityEnum,
    city: z.string(),
    state: z.string().default("Sinaloa"),
    country: z.string().default("México"),
    tags: z.array(z.string()).default([]),
    verified: z.boolean().optional(),
    website: z.string().url().optional(),
    x: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    publishDate: z.coerce.date().optional(),
    featured: z.boolean().optional(),
    // Startup/business extras
    foundedYear: z.number().optional(),
    stage: z.string().optional(),
    teamSize: z.string().optional(),
    sector: z.string().optional(),
    // Community extras
    memberCount: z.number().optional(),
    meetupFrequency: z.string().optional(),
    discord: z.string().optional(),
    telegram: z.string().optional(),
    // Person extras
    role: z.string().optional(),
    company: z.string().optional(),
    skills: z.array(z.string()).optional(),
    availableForHire: z.boolean().optional(),
    email: z.string().email().optional(),
  });

const atlasCollection = defineCollection({ schema: atlasSchema });

export const collections = {
  atlas: atlasCollection,
};
