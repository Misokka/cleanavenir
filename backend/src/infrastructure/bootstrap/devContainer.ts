import { db } from '../drizzle/client';
import { UserRepositoryDrizzle } from '../repositories/drizzle/UserRepositoryDrizzle';
import { ClientRepositoryDrizzle } from '../repositories/drizzle/ClientRepositoryDrizzle';
import { DirectorRepositoryDrizzle } from '../repositories/drizzle/DirectorRepositoryDrizzle';
import { AdvisorRepositoryDrizzle } from '../repositories/drizzle/AdvisorRepositoryDrizzle';
import { SimplePasswordHasher } from '../adapters/SimplePasswordHasher';
import { ProfileManager } from '../../application/ports/services/ProfileFetcher';
import { RegisterUseCase } from '../../application/use-cases/user/auth/RegisterUseCase';

export function createDevContainer() {
  const userRepo = new UserRepositoryDrizzle(db);
  const clientRepo = new ClientRepositoryDrizzle(db);
  const directorRepo = new DirectorRepositoryDrizzle(db);
  const advisorRepo = new AdvisorRepositoryDrizzle(db);

  const passwordHasher = new SimplePasswordHasher();
  const profileManager = new ProfileManager(clientRepo, directorRepo, advisorRepo);

  const register = new RegisterUseCase(userRepo, profileManager, passwordHasher);

  return { userRepo, clientRepo, directorRepo, advisorRepo, register, passwordHasher, profileManager };
}