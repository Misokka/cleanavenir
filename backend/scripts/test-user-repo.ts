import 'dotenv/config';
import { db } from '../src/infrastructure/drizzle/client';
import { UserRepositoryDrizzle } from '../src/infrastructure/repositories/drizzle/UserRepositoryDrizzle';
import { randomUUID } from 'crypto';
import { User } from '../src/domain/entities/User';

async function run() {
  const repo = new UserRepositoryDrizzle(db);
  const id = randomUUID();
  const user = new User(id, 'Test', 'Repo', `test+${id}@example.com`, 'pwd', 'CLIENT');

  // save
  const saved = await repo.save(user);
  console.log('save ->', saved);

  // findById
  const found = await repo.findById(id);
  console.log('findById ->', found);

  // findByEmail
  const foundByEmail = await repo.findByEmail(user.email);
  console.log('findByEmail ->', foundByEmail);

  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});