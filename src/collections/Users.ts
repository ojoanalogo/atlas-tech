import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrModerator } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario CMS', plural: 'Usuarios CMS' },
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'createdAt'],
    description: 'Administra los usuarios del panel de administración',
  },
  access: {
    create: isAdmin,
    read: isAdminOrModerator,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Moderador', value: 'moderator' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'displayName',
      label: 'Nombre para mostrar',
      type: 'text',
    },
  ],
}
