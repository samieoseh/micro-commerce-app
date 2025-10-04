import 'dotenv/config';
import * as schema from "./db/schema"
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const DATABASE_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}` +
  `@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle<schema.Schema>(pool, { schema: schema.schema });