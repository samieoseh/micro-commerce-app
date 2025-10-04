const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${env}` });

const DATABASE_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}` +
  `@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

import bcrypt from 'bcrypt';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '../modules/users/schema/user.schema';

// Setup your DB connection
const pool = new Pool({
  connectionString: DATABASE_URL!
});

const db = drizzle(pool);

async function seedUsers() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Check if users already exist
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log('Users already exist, skipping seeding...');
    process.exit(0);
  }

  await db.insert(users).values([
    { email: 'admin@example.com', password: passwordHash, role: 'admin' },
    { email: 'user@example.com', password: passwordHash, role: 'user' },
  ]);

  console.log('Users seeded successfully');
  process.exit(0);
}

seedUsers().catch((err) => {
  console.error('Error seeding users:', err);
  process.exit(1);
});
