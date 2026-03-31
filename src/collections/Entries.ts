import type { CollectionConfig } from 'payload'
import { isAdminOrModerator, publishedOrAuthenticated } from '../access/roles'
import { revalidateEntry } from './hooks/revalidateOnPublish'
import {
  CITY_SELECT_OPTIONS,
  ENTRY_TYPES,
  STAGE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  SECTOR_OPTIONS,
  MEETUP_FREQUENCY_OPTIONS,
  PLATFORM_OPTIONS,
  FOCUS_AREA_OPTIONS,
  BUSINESS_MODEL_OPTIONS,
} from '../config'

const entryTypeOptions = ENTRY_TYPES.map((t) => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))

const isStartupLike = (siblingData: Record<string, unknown>) =>
  ['startup', 'business', 'consultory', 'research-center'].includes(siblingData.entryType as string)

const isCommunity = (siblingData: Record<string, unknown>) =>
  siblingData.entryType === 'community'

const isPerson = (siblingData: Record<string, unknown>) =>
  siblingData.entryType === 'person'

export const Entries: CollectionConfig = {
  slug: 'entries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'entryType', 'city', '_status', 'updatedAt'],
    listSearchableFields: ['name', 'tagline', 'tags'],
  },
  access: {
    create: isAdminOrModerator,
    read: publishedOrAuthenticated,
    update: isAdminOrModerator,
    delete: isAdminOrModerator,
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  hooks: {
    afterChange: [revalidateEntry],
  },
  fields: [
    // --- Base fields ---
    {
      name: 'entryType',
      type: 'select',
      required: true,
      options: entryTypeOptions,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier. Auto-generated from name if left empty.',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (!value && siblingData?.name) {
              return (siblingData.name as string)
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'city',
      type: 'select',
      required: true,
      options: CITY_SELECT_OPTIONS,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'state',
      type: 'text',
      defaultValue: 'Sinaloa',
      admin: { position: 'sidebar' },
    },
    {
      name: 'country',
      type: 'text',
      defaultValue: 'México',
      admin: { position: 'sidebar' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tags',
      type: 'array',
      maxRows: 10,
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    // --- Social links ---
    {
      name: 'website',
      type: 'text',
      admin: { description: 'Full URL (https://...)' },
    },
    {
      type: 'row',
      fields: [
        { name: 'x', type: 'text', admin: { width: '50%', description: 'X/Twitter handle' } },
        { name: 'instagram', type: 'text', admin: { width: '50%', description: 'Instagram handle' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'linkedin', type: 'text', admin: { width: '50%', description: 'LinkedIn URL or handle' } },
        { name: 'github', type: 'text', admin: { width: '50%', description: 'GitHub username' } },
      ],
    },
    {
      name: 'youtube',
      type: 'text',
      admin: { description: 'YouTube channel URL' },
    },
    {
      name: 'publishDate',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'owner',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'better-auth user ID of the entry owner',
      },
    },
    {
      name: 'moderationNote',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Rejection reason or feedback for the entry owner',
        condition: (data) => data._status === 'draft',
      },
    },
    // --- Rich text body ---
    {
      name: 'body',
      type: 'richText',
    },

    // --- Startup / Business / Consultory fields ---
    {
      name: 'foundedYear',
      type: 'number',
      admin: {
        condition: (_, siblingData) => isStartupLike(siblingData),
      },
    },
    {
      name: 'stage',
      type: 'select',
      options: STAGE_OPTIONS,
      admin: {
        condition: (_, siblingData) => isStartupLike(siblingData),
      },
    },
    {
      name: 'teamSize',
      type: 'select',
      options: TEAM_SIZE_OPTIONS,
      admin: {
        condition: (_, siblingData) => isStartupLike(siblingData),
      },
    },
    {
      name: 'sector',
      type: 'select',
      options: SECTOR_OPTIONS,
      admin: {
        condition: (_, siblingData) => isStartupLike(siblingData),
      },
    },
    {
      name: 'services',
      type: 'array',
      admin: {
        condition: (_, siblingData) => isStartupLike(siblingData),
      },
      fields: [{ name: 'service', type: 'text', required: true }],
    },
    {
      name: 'technologies',
      type: 'array',
      admin: {
        condition: (_, siblingData) => isStartupLike(siblingData),
      },
      fields: [{ name: 'technology', type: 'text', required: true }],
    },
    {
      name: 'hiring',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => isStartupLike(siblingData),
      },
    },
    {
      name: 'hiringUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => isStartupLike(siblingData) && Boolean(siblingData.hiring),
      },
    },
    {
      name: 'businessModel',
      type: 'select',
      options: BUSINESS_MODEL_OPTIONS,
      admin: {
        condition: (_, siblingData) => isStartupLike(siblingData),
      },
    },

    // --- Community fields ---
    {
      name: 'memberCount',
      type: 'number',
      admin: {
        condition: (_, siblingData) => isCommunity(siblingData),
      },
    },
    {
      name: 'meetupFrequency',
      type: 'select',
      options: MEETUP_FREQUENCY_OPTIONS,
      admin: {
        condition: (_, siblingData) => isCommunity(siblingData),
      },
    },
    {
      name: 'discord',
      type: 'text',
      admin: {
        condition: (_, siblingData) => isCommunity(siblingData),
      },
    },
    {
      name: 'telegram',
      type: 'text',
      admin: {
        condition: (_, siblingData) => isCommunity(siblingData),
      },
    },
    {
      name: 'platform',
      type: 'select',
      options: PLATFORM_OPTIONS,
      admin: {
        condition: (_, siblingData) => isCommunity(siblingData),
      },
    },
    {
      name: 'focusAreas',
      type: 'array',
      admin: {
        condition: (_, siblingData) => isCommunity(siblingData),
      },
      fields: [{ name: 'area', type: 'text', required: true }],
    },

    // --- Person fields ---
    {
      name: 'role',
      type: 'text',
      admin: {
        condition: (_, siblingData) => isPerson(siblingData),
      },
    },
    {
      name: 'company',
      type: 'text',
      admin: {
        condition: (_, siblingData) => isPerson(siblingData),
      },
    },
    {
      name: 'skills',
      type: 'array',
      admin: {
        condition: (_, siblingData) => isPerson(siblingData),
      },
      fields: [{ name: 'skill', type: 'text', required: true }],
    },
    {
      name: 'availableForHire',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => isPerson(siblingData),
      },
    },
    {
      name: 'availableForMentoring',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => isPerson(siblingData),
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        condition: (_, siblingData) => isPerson(siblingData),
      },
    },
    {
      name: 'portfolio',
      type: 'text',
      admin: {
        condition: (_, siblingData) => isPerson(siblingData),
        description: 'Portfolio URL',
      },
    },
  ],
}
