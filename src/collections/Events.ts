import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publicRead } from '../access/roles'
import { revalidateEntry } from './hooks/revalidateOnPublish'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'modality', 'organizer', '_status'],
    listSearchableFields: ['title', 'organizer', 'location'],
  },
  access: {
    create: isAdminOrEditor,
    read: publicRead,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
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
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'organizer',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'text',
          admin: { width: '50%', description: 'e.g. 10:00 AM' },
        },
        {
          name: 'endTime',
          type: 'text',
          admin: { width: '50%', description: 'e.g. 12:00 PM' },
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
      admin: { description: 'Venue name or address' },
    },
    {
      name: 'mapsUrl',
      type: 'text',
      admin: { description: 'Google Maps link' },
    },
    {
      name: 'modality',
      type: 'select',
      required: true,
      defaultValue: 'in-person',
      options: [
        { label: 'Presencial', value: 'in-person' },
        { label: 'En línea', value: 'online' },
        { label: 'Híbrido', value: 'hybrid' },
      ],
    },
    {
      name: 'meetLink',
      type: 'text',
      admin: {
        description: 'Video call link (Zoom, Meet, etc.)',
        condition: (_, siblingData) =>
          ['online', 'hybrid'].includes(siblingData.modality as string),
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: { description: 'Event page URL' },
    },
    {
      name: 'registerUrl',
      type: 'text',
      admin: { description: 'Registration link' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
