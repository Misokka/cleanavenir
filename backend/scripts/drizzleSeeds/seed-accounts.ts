import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { db } from '../../src/infrastructure/drizzle/client';
import { bankAccounts, users } from '../../src/infrastructure/drizzle/schema';

async function seed() {
  const now = new Date().toISOString();

  // try to pick an existing user as owner
  const found = await db.select().from(users).limit(1);
  const ownerId = found && found.length ? found[0].id : 'owner-placeholder';

  const rows = [
    {
      id: randomUUID(),
      iban: 'FR76 3000 6000 0112 3456 7890 189',
      name: 'Courant Principal',
      ownerId,
      balance: 100000, // in cents
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      iban: 'FR14 4000 6000 0212 3456 7890 456',
      name: 'Epargne',
      ownerId,
      balance: 500000,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const r of rows) {
    try {
      await db.insert(bankAccounts).values(r);
      console.log(`Inserted account ${r.iban}`);
    } catch (e: any) {
      console.warn(`Could not insert ${r.iban}:`, e.message);
    }
  }

  console.log('Seeding accounts done');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
