const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${env}` });

import bcrypt from 'bcrypt';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '../modules/users/schema/user.schema';

// Setup your DB connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!
});

const db = drizzle(pool);

async function seedUsers() {
  const passwordHash = await bcrypt.hash('Password@123', 10);

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
