import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL manquante');
}

const client = postgres(process.env.DATABASE_URL, { prepare: false });

// 👇 IMPÉRATIF : "export const", PAS "export default"
export const db = drizzle(client, { schema });