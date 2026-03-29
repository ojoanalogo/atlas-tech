import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'

/**
 * One-time migration script.
 * Reads existing markdown entries from the old Astro content directory
 * and creates them as Payload documents.
 *
 * Usage: pnpm seed
 *
 * Assumptions:
 * - The old Astro project's content is accessible at ASTRO_CONTENT_DIR
 * - Image uploads are skipped (to be uploaded manually via admin or a separate script)
 * - Markdown body is stored as a simple Lexical paragraph (rich formatting preserved later)
 */

const ASTRO_CONTENT_DIR = process.env.ASTRO_CONTENT_DIR || '../atlas-tech-astro/src/content/atlas'

interface FrontmatterData {
  [key: string]: unknown
}

function parseFrontmatter(content: string): { data: FrontmatterData; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { data: {}, body: content }

  const yamlStr = match[1]
  const body = match[2].trim()

  // Simple YAML parser for frontmatter (handles our known field types)
  const data: FrontmatterData = {}
  let currentKey = ''
  let inArray = false
  let arrayValues: string[] = []

  for (const line of yamlStr.split('\n')) {
    const trimmed = line.trim()

    // Array item
    if (inArray && trimmed.startsWith('- ')) {
      arrayValues.push(trimmed.slice(2).replace(/^["']|["']$/g, ''))
      continue
    }

    // End previous array
    if (inArray && !trimmed.startsWith('- ')) {
      data[currentKey] = arrayValues
      inArray = false
      arrayValues = []
    }

    // Key-value pair
    const kvMatch = trimmed.match(/^(\w+):\s*(.*)$/)
    if (kvMatch) {
      const [, key, rawVal] = kvMatch
      currentKey = key

      // Inline array: ["a", "b"]
      if (rawVal.startsWith('[')) {
        const items = rawVal
          .replace(/^\[|\]$/g, '')
          .split(',')
          .map((s) => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean)
        data[key] = items
        continue
      }

      // Start of block array
      if (rawVal === '' || rawVal === undefined) {
        // Could be a block array or empty — peek ahead handled by inArray logic
        inArray = true
        arrayValues = []
        continue
      }

      // Boolean
      if (rawVal === 'true') { data[key] = true; continue }
      if (rawVal === 'false') { data[key] = false; continue }

      // Number
      if (/^\d+$/.test(rawVal)) { data[key] = parseInt(rawVal, 10); continue }

      // String (strip quotes)
      data[key] = rawVal.replace(/^["']|["']$/g, '')
    }
  }

  // Flush final array
  if (inArray) {
    data[currentKey] = arrayValues
  }

  return { data, body }
}

/** Convert plain markdown text to a minimal Lexical root with a single paragraph */
function markdownToLexical(text: string) {
  if (!text) return undefined
  return {
    root: {
      type: 'root',
      children: text.split('\n\n').filter(Boolean).map((paragraph) => ({
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: paragraph.replace(/\n/g, ' '),
            version: 1,
          },
        ],
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

async function seed() {
  const payload = await getPayload({ config })

  const contentDir = path.resolve(ASTRO_CONTENT_DIR)

  if (!fs.existsSync(contentDir)) {
    console.error(`Content directory not found: ${contentDir}`)
    console.log('Set ASTRO_CONTENT_DIR env var to the path of your Astro content directory.')
    process.exit(1)
  }

  const dirs = fs.readdirSync(contentDir).filter((d) =>
    fs.statSync(path.join(contentDir, d)).isDirectory()
  )

  console.log(`Found ${dirs.length} entries to migrate.`)

  for (const dir of dirs) {
    const mdPath = path.join(contentDir, dir, 'index.md')
    if (!fs.existsSync(mdPath)) {
      console.warn(`Skipping ${dir}: no index.md found`)
      continue
    }

    const raw = fs.readFileSync(mdPath, 'utf-8')
    const { data, body } = parseFrontmatter(raw)

    // Check if entry already exists
    const existing = await payload.find({
      collection: 'entries',
      where: { slug: { equals: dir } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`Skipping ${dir}: already exists`)
      continue
    }

    // Normalize select field values that may not match Payload options exactly
    const stageMap: Record<string, string> = {
      'Bootstrapping': 'Bootstrap',
      'Boostrap': 'Bootstrap',
      'bootstrapping': 'Bootstrap',
      'bootstrap': 'Bootstrap',
    }
    const teamSizeMap: Record<string, string> = {
      '1': '1-5',
      '2': '1-5',
      '3': '1-5',
      '4': '1-5',
      '5': '1-5',
    }
    const meetupFrequencyMap: Record<string, string> = {
      'Permanente': 'Permanente (online)',
    }

    if (data.stage && stageMap[data.stage as string]) {
      data.stage = stageMap[data.stage as string]
    }
    if (data.teamSize && teamSizeMap[data.teamSize as string]) {
      data.teamSize = teamSizeMap[data.teamSize as string]
    }
    if (data.meetupFrequency && meetupFrequencyMap[data.meetupFrequency as string]) {
      data.meetupFrequency = meetupFrequencyMap[data.meetupFrequency as string]
    }

    // Map tags from string[] to Payload array format
    const tags = Array.isArray(data.tags)
      ? (data.tags as string[]).map((t) => ({ tag: t }))
      : []

    // Map array fields
    const technologies = Array.isArray(data.technologies)
      ? (data.technologies as string[]).map((t) => ({ technology: t }))
      : undefined

    const services = Array.isArray(data.services)
      ? (data.services as string[]).map((s) => ({ service: s }))
      : undefined

    const focusAreas = Array.isArray(data.focusAreas)
      ? (data.focusAreas as string[]).map((a) => ({ area: a }))
      : undefined

    const skills = Array.isArray(data.skills)
      ? (data.skills as string[]).map((s) => ({ skill: s }))
      : undefined

    try {
      await payload.create({
        collection: 'entries',
        data: {
          entryType: data.entryType as string,
          name: data.name as string,
          slug: dir,
          tagline: data.tagline as string | undefined,
          city: data.city as string,
          state: (data.state as string) || 'Sinaloa',
          country: (data.country as string) || 'México',
          tags,
          verified: data.verified as boolean | undefined,
          featured: data.featured as boolean | undefined,
          website: data.website as string | undefined,
          x: data.x as string | undefined,
          instagram: data.instagram as string | undefined,
          linkedin: data.linkedin as string | undefined,
          github: data.github as string | undefined,
          youtube: data.youtube as string | undefined,
          publishDate: data.publishDate as string | undefined,
          body: markdownToLexical(body),
          // Startup/business/consultory
          foundedYear: data.foundedYear as number | undefined,
          stage: data.stage as string | undefined,
          teamSize: data.teamSize as string | undefined,
          sector: data.sector as string | undefined,
          technologies,
          services,
          hiring: data.hiring as boolean | undefined,
          hiringUrl: data.hiringUrl as string | undefined,
          businessModel: data.businessModel as string | undefined,
          // Community
          memberCount: data.memberCount as number | undefined,
          meetupFrequency: data.meetupFrequency as string | undefined,
          discord: data.discord as string | undefined,
          telegram: data.telegram as string | undefined,
          platform: data.platform as string | undefined,
          focusAreas,
          // Person
          role: data.role as string | undefined,
          company: data.company as string | undefined,
          skills,
          availableForHire: data.availableForHire as boolean | undefined,
          availableForMentoring: data.availableForMentoring as boolean | undefined,
          email: data.email as string | undefined,
          portfolio: data.portfolio as string | undefined,
          _status: 'published',
        },
      })
      console.log(`Migrated: ${data.name}`)
    } catch (err) {
      console.error(`Failed to migrate ${dir}:`, err)
    }
  }

  console.log('Seed complete.')
  process.exit(0)
}

seed()
