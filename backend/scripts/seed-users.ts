import 'dotenv/config';
import { randomUUID } from 'crypto';
import { db } from '../src/infrastructure/drizzle/client';
import { users } from '../src/infrastructure/drizzle/schema';
import { eq } from 'drizzle-orm';

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
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const r of rows) {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existing = await db.select().from(users).where(eq(users.email, r.email));
      
      if (existing.length > 0) {
        console.log(`User ${r.email} already exists, skipping`);
        continue;
      }

      await db.insert(users).values(r);
      console.log(`Inserted ${r.email}`);
    } catch (e: any) {
      console.error(`Could not insert ${r.email}:`, e);
      console.error('Full error details:', JSON.stringify(e, null, 2));
    }
  }

  console.log('Seeding done');
  process.exit(0);
}

seed().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});