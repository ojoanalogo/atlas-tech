import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { db } from '@/db'
import * as authSchema from '@/db/schema/auth'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
