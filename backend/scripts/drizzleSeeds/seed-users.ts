import 'dotenv/config';
import { randomUUID } from 'crypto';
import { db } from '../../src/infrastructure/drizzle/client';
import { SimplePasswordHasher } from '../../src/infrastructure/adapters/SimplePasswordHasher';
import { directors, NewDirectorDrizzle, NewUserDrizzle, users } from '../../src/infrastructure/drizzle/schema';
import { eq } from 'drizzle-orm';

async function seedDirector(now: string){
  try{
    const directorUserRows = await db.select().from(users).where(eq(users.role, "DIRECTOR")).limit(1);
    const directorUser = directorUserRows[0];

    const director: NewDirectorDrizzle = {
      id: randomUUID(),
      userId: directorUser.id,
      createdAt: now,
      updatedAt: now
    } 

    await db.insert(directors).values(director);
    console.log("director created")
  } catch (error) {
    console.error('Could not create director user');
    return
  }
}

async function seed() {
  const now = new Date().toISOString();
  const hasher = new SimplePasswordHasher();
  const defaultPlainPassword = 'password';
  const hashedDefaultPassword = await hasher.hash(defaultPlainPassword);

  const rows: NewUserDrizzle[] = [
    {
      id: randomUUID(),
      firstname: 'Alice',
      lastname: 'Dupont',
      email: 'alice@example.com',
      password: hashedDefaultPassword,
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
      password: hashedDefaultPassword,
      role: 'CLIENT',
      isActive: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      firstname: 'Tom',
      lastname: 'François',
      email: 'tom@example.com',
      password: hashedDefaultPassword,
      role: 'ADVISOR',
      isActive: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      firstname: 'Didier',
      lastname: 'Douglas',
      email: 'didier@example.com',
      password: hashedDefaultPassword,
      role: 'ADVISOR',
      isActive: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      firstname: 'Patrick',
      lastname: 'Leboss',
      email: 'pat@example.com',
      password: hashedDefaultPassword,
      role: 'DIRECTOR',
      isActive: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      firstname: 'SYSTEM',
      lastname: 'SYSTEM',
      email: 'sys@example.com',
      password: hashedDefaultPassword,
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

  await seedDirector(now)

  console.log('Seeding done');
  process.exit(0);
}

seed().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});