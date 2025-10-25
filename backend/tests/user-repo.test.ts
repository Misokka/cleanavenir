import { describe, it, expect } from 'vitest';
import { randomUUID } from 'crypto';
import { db } from '../src/infrastructure/drizzle/client';
import { users } from '../src/infrastructure/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('User repository smoke', () => {
  it('can insert and find a user', async () => {
    const id = randomUUID();
    const now = new Date().toISOString();
    const user = {
      id,
      firstname: 'Test',
      lastname: 'User',
      email: `test+${id}@example.com`,
      password: 'x',
      role: 'CLIENT',
      isActive: 1,
      emailVerifiedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    // retry insert in case of transient SQLITE_BUSY
    for (let i = 0; i < 5; i++) {
      try {
        await db.insert(users).values(user);
        break;
      } catch (e: any) {
        if (e?.code === 'SQLITE_BUSY' && i < 4) {
          await new Promise((res) => setTimeout(res, 50));
          continue;
        }
        throw e;
      }
    }

  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows[0].email).toBe(user.email);

    // cleanup
  await db.delete(users).where(eq(users.id, id));
  });
});
