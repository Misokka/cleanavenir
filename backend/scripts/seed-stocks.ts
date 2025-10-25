import 'dotenv/config';
import { randomUUID } from 'crypto';
import { db } from '../src/infrastructure/drizzle/client';
import { stocks } from '../src/infrastructure/drizzle/schema';

async function seed() {
  const now = new Date().toISOString();
  const rows = [
    { id: randomUUID(), symbol: 'AAPL', companyName: 'Apple Inc.', createdAt: now, updatedAt: now },
    { id: randomUUID(), symbol: 'MSFT', companyName: 'Microsoft Corporation', createdAt: now, updatedAt: now },
    { id: randomUUID(), symbol: 'AMZN', companyName: 'Amazon.com, Inc.', createdAt: now, updatedAt: now },
    { id: randomUUID(), symbol: 'GOOGL', companyName: 'Alphabet Inc.', createdAt: now, updatedAt: now },
    { id: randomUUID(), symbol: 'TSLA', companyName: 'Tesla, Inc.', createdAt: now, updatedAt: now },
  ];

  for (const r of rows) {
    try {
      await db.insert(stocks).values(r);
      console.log(`Inserted ${r.symbol}`);
    } catch (e: any) {
      console.warn(`Could not insert ${r.symbol}:`, e.message);
    }
  }

  console.log('Stock seeding done');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
