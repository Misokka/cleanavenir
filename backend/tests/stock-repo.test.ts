import { describe, it, expect } from 'vitest';
import { randomUUID } from 'crypto';
import { createTestDb } from './helpers/createTestDb';
import { stocks } from '../src/infrastructure/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Stock repository smoke', () => {
  it('can insert and find a stock', async () => {
    const db = await createTestDb();
    const id = randomUUID();
    const now = new Date().toISOString();
    const s = { id, symbol: `TST${id.slice(0,6)}`, companyName: 'Test Co', createdAt: now, updatedAt: now };

    await db.insert(stocks).values(s);

    const rows = await db.select().from(stocks).where(eq(stocks.id, id)).limit(1);
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows[0].symbol).toBe(s.symbol);
  });
});
