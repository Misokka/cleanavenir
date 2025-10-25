import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import { users } from './infrastructure/drizzle/schema';

const db = drizzle(process.env.DB_FILE_NAME!);

async function main() {
  const now = new Date().toISOString();
  const user = {
    id: 'u-1',
    firstname: 'Test',
    lastname: 'User',
    email: 'test.user@example.com',
    password: 'hash',
    role: 'CLIENT',
    isActive: 1,
    emailVerifiedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(users).values(user);
  console.log('New user created');

  const rows = await db.select().from(users);
  console.log('Users:', rows);

  // update
  await db.update(users).set({ lastname: 'Updated' }).where(eq(users.email, user.email));
  console.log('Updated user');

  // delete
  await db.delete(users).where(eq(users.email, user.email));
  console.log('Deleted user');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});