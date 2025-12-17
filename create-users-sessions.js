require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.PAYLOAD_DATABASE_URL || process.env.DATABASE_URL,
});

async function createUsersSessions() {
  try {
    // Create users_sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "payload"."users_sessions" (
        "id" serial PRIMARY KEY NOT NULL,
        "_parent_id" integer NOT NULL,
        "_order" integer NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "expires_at" timestamp(3) with time zone NOT NULL,
        CONSTRAINT "users_sessions_parent_fk" FOREIGN KEY ("_parent_id")
          REFERENCES "payload"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      );
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "users_sessions_parent_idx"
        ON "payload"."users_sessions" USING btree ("_parent_id");
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS "users_sessions_order_idx"
        ON "payload"."users_sessions" USING btree ("_order");
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS "users_sessions_created_at_idx"
        ON "payload"."users_sessions" USING btree ("created_at");
    `);

    console.log('✓ users_sessions table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating table:', error);
    process.exit(1);
  }
}

createUsersSessions();
