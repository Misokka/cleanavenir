import { describe, it, expect } from 'vitest';
import { randomUUID } from 'crypto';
import { db } from '../src/infrastructure/drizzle/client';
import { stocks } from '../src/infrastructure/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Stock repository smoke', () => {
  it('can insert and find a stock', async () => {
    const id = randomUUID();
    const now = new Date().toISOString();
    const s = { id, symbol: `TST${id.slice(0,6)}`, companyName: 'Test Co', createdAt: now, updatedAt: now };

    // retry insert in case of transient SQLITE_BUSY
    for (let i = 0; i < 5; i++) {
      try {
        await db.insert(stocks).values(s);
        break;
      } catch (e: any) {
        if (e?.code === 'SQLITE_BUSY' && i < 4) {
          await new Promise((res) => setTimeout(res, 50));
          continue;
        }
        throw e;
      }
    }

  const rows = await db.select().from(stocks).where(eq(stocks.id, id)).limit(1);
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows[0].symbol).toBe(s.symbol);

    // cleanup
  await db.delete(stocks).where(eq(stocks.id, id));
  });
});
