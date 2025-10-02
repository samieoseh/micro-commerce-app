import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from "drizzle-orm/pglite/migrator";

export async function setupTestDb() {
  const client = new PGlite();
  const db = drizzle({ client });

   await migrate(db, { migrationsFolder: "./drizzle" });
  return db;
}
