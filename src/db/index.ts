import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema/profiles'

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
})

export const db = drizzle(pool, { schema })
