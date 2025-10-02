import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';

export async function setupTestDb(
  migrationsFolder = './drizzle',
  image = 'postgres:15' 
) {
  const container = await new PostgreSqlContainer(image).start();

  const client = new Client({
    host: container.getHost(),
    port: container.getPort(),
    user: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
  });
  await client.connect();

  const db = drizzle(client);
  await migrate(db, { migrationsFolder });

  async function cleanup() {
    await client.end();
    await container.stop();
  }

  return { db, client, container, cleanup };
}
