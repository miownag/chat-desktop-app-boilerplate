import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from './schema';

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://localhost:5432/bricks';

// @ts-expect-error - postgres default export issue
const client = postgres.default(connectionString);

export const db = drizzle(client, { schema });
