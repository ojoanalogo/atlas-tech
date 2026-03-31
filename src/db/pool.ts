import { Pool } from 'pg'

/**
 * Shared PostgreSQL connection pool for auth and Drizzle.
 * Payload CMS maintains its own pool via postgresAdapter (separate schema).
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
})

// Set search_path so better-auth finds its tables in the `auth` schema,
// and Drizzle finds `profiles` in the `public` schema.
pool.on('connect', (client) => {
  client.query('SET search_path TO auth, public')
})

export { pool }
