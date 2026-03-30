import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const profiles = pgTable('profiles', {
  userId: text('user_id').primaryKey(),
  name: text('name').notNull(),
  title: text('title'),
  company: text('company'),
  email: text('email'),
  phone: text('phone'),
  website: text('website'),
  photo: text('photo'),
  linkedin: text('linkedin'),
  x: text('x'),
  github: text('github'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
