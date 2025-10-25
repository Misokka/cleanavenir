import { describe, it, expect } from 'vitest';
import { randomUUID } from 'crypto';
import { createTestDb } from './helpers/createTestDb';
import { users } from '../src/infrastructure/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('User repository smoke', () => {
  it('can insert and find a user', async () => {
    const db = await createTestDb();
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
    await db.insert(users).values(user);

    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows[0].email).toBe(user.email);
  });
});
