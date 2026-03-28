import type { CollectionConfig } from 'payload'
import { isAdminOrModerator, publicRead } from '../access/roles'
import { CITY_SELECT_OPTIONS } from '../config'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'modality', '_status', 'expiresAt'],
    listSearchableFields: ['title', 'compensation'],
  },
  access: {
    create: isAdminOrModerator,
    read: publicRead,
    update: isAdminOrModerator,
    delete: isAdminOrModerator,
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  fields: [
    {
      name: 'title',
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
        description: 'URL slug. Auto-generated from title if left empty.',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (!value && siblingData?.title) {
              const base = (siblingData.title as string)
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
              // Append timestamp to avoid slug collisions (jobs can share titles)
              return `${base}-${Date.now().toString(36)}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Tiempo completo', value: 'full-time' },
        { label: 'Medio tiempo', value: 'part-time' },
        { label: 'Contrato', value: 'contract' },
        { label: 'Freelance', value: 'freelance' },
        { label: 'Voluntariado', value: 'volunteer' },
      ],
    },
    {
      name: 'modality',
      type: 'select',
      required: true,
      options: [
        { label: 'Remoto', value: 'remote' },
        { label: 'Presencial', value: 'in-person' },
        { label: 'Híbrido', value: 'hybrid' },
      ],
    },
    {
      name: 'city',
      type: 'select',
      options: CITY_SELECT_OPTIONS,
      admin: {
        condition: (_, siblingData) =>
          ['in-person', 'hybrid'].includes(siblingData.modality as string),
      },
    },
    {
      name: 'compensation',
      type: 'text',
      admin: { description: 'Flexible format: "$15k/mo", "Voluntario", "Equity", etc.' },
    },
    {
      name: 'tags',
      type: 'array',
      maxRows: 10,
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    {
      name: 'contactUrl',
      type: 'text',
      required: true,
      admin: { description: 'URL or email for applicants to contact' },
    },
    {
      name: 'postedBy',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'better-auth user ID of the poster',
      },
    },
    {
      name: 'entry',
      type: 'relationship',
      relationTo: 'entries',
      admin: {
        position: 'sidebar',
        description: 'Link to the company/org that posted this job (optional)',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Job listing expiration date (default: 30 days from creation)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              const thirtyDays = new Date()
              thirtyDays.setDate(thirtyDays.getDate() + 30)
              return thirtyDays.toISOString()
            }
            return value
          },
        ],
      },
    },
  ],
}
