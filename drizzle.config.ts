import * as dotenv from "dotenv"
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: ".env.local" });
const DATABASE_URL = process.env.DATABASE_URL;

export default defineConfig({
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL ?? ''
  }
});