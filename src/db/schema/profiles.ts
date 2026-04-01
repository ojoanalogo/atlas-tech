import { pgSchema, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const appSchema = pgSchema('app')

export const profiles = appSchema.table('profiles', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title'),
  company: text('company'),
  phone: text('phone'),
  website: text('website'),
  linkedin: text('linkedin'),
  x: text('x'),
  github: text('github'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
