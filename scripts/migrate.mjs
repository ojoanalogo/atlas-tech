import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URI })
const db = drizzle(pool)

console.log('Running migrations...')
await migrate(db, { migrationsFolder: './drizzle' })
console.log('Migrations complete')

await pool.end()
