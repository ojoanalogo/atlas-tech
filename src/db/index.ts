import { drizzle } from 'drizzle-orm/node-postgres'
import { pool } from './pool'
import * as profiles from './schema/profiles'
import * as auth from './schema/auth'

export const db = drizzle(pool, { schema: { ...profiles, ...auth } })
