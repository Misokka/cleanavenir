import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const DB_URL = process.env.DB_FILE_NAME;
if (!DB_URL) throw new Error('DB_FILE_NAME non défini dans backend/.env');

const client = createClient({ url: DB_URL });
export const db = drizzle({ client });