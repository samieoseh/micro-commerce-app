const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${env}` });

import { defineConfig } from 'drizzle-kit';

const DATABASE_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}` +
  `@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

  console.log({DATABASE_URL})
export default defineConfig({
  out: './drizzle',
  schema: './src/modules/**/schema/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
