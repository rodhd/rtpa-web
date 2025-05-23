import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import * as schema from '@/lib/schema';

const connectionStringSchema = z.coerce.string()
const connectionString = connectionStringSchema.parse(process.env.DATABASE_URL)

export const client = neon(connectionString);
export const db = drizzle(client, {schema});