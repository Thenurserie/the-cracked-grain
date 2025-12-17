import { Pool } from 'pg'

// Create a custom PostgreSQL pool that properly handles DigitalOcean's SSL
export const payloadPool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? {
    rejectUnauthorized: false,
  } : undefined,
})
