import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

export async function createTestDb() {
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
  const id = randomUUID();
  const file = `./tmp/test_${id}.sqlite`;
  const url = `file:${file}`;

  // create client
  const client = createClient({ url });
  const db = drizzle({ client });

  // read generated SQL from drizzle output
  const drizzleSqlPath = path.join(process.cwd(), 'drizzle', '0000_amazing_overlord.sql');
  const sql = fs.readFileSync(drizzleSqlPath, 'utf8');

  // split on statement-breakpoint markers inserted by drizzle
  const stmts = sql.split('--> statement-breakpoint').map((s) => s.trim()).filter(Boolean);

  for (const s of stmts) {
    const statement = s.trim();
    if (!statement) continue;
    // ensure trailing semicolon removed, client.execute expects full SQL
    try {
      await client.execute(statement);
    } catch (e: any) {
      // if statement ends with a semicolon, try executing without it
      const alt = statement.replace(/;\s*$/s, '');
      try {
        await client.execute(alt);
      } catch (err) {
        // rethrow for debugging
        throw err;
      }
    }
  }

  return db;
}
