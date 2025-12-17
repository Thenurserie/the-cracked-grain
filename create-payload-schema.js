require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.PAYLOAD_DATABASE_URL || process.env.DATABASE_URL,
});

async function createSchema() {
  try {
    await pool.query('CREATE SCHEMA IF NOT EXISTS payload;');
    console.log('Payload schema created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating schema:', error);
    process.exit(1);
  }
}

createSchema();
