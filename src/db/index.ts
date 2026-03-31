import { drizzle } from 'drizzle-orm/node-postgres'
import { pool } from './pool'
import * as schema from './schema/profiles'

export const db = drizzle(pool, { schema })
