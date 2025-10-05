import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${env}` });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool);

async function resetDatabase() {
  console.log('⚠️ Dropping all tables...');
  await db.execute(`
    DO $$ DECLARE
        r RECORD;
    BEGIN
        -- Drop all tables in the public schema
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
  `);

  console.log('✅ All tables dropped successfully.');
  process.exit(0);
}

resetDatabase().catch((err) => {
  console.error('❌ Error resetting database:', err);
  process.exit(1);
});
