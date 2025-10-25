import 'dotenv/config';
import { randomUUID } from 'crypto';
import { db } from '../src/infrastructure/drizzle/client';
import { users } from '../src/infrastructure/drizzle/schema';

async function seed() {
  const now = new Date().toISOString();
  const rows = [
    {
      id: randomUUID(),
      firstname: 'Alice',
      lastname: 'Dupont',
      email: 'alice@example.com',
      password: 'hashedpassword',
      role: 'CLIENT',
      isActive: 1,
      emailVerifiedAt: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      firstname: 'Bob',
      lastname: 'Martin',
      email: 'bob@example.com',
      password: 'hashedpassword',
      role: 'CLIENT',
      isActive: 1,
      emailVerifiedAt: null,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const r of rows) {
    try {
      await db.insert(users).values(r);
      console.log(`Inserted ${r.email}`);
    } catch (e: any) {
      console.warn(`Could not insert ${r.email}:`, e.message);
    }
  }

  console.log('Seeding done');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});