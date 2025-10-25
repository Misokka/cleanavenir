import { db } from '../drizzle/client';
import { UserRepositoryDrizzle } from '../repositories/drizzle/UserRepositoryDrizzle';
import { RegisterUseCase } from '../../application/use-cases/user/auth/RegisterUseCase';

export function createDevContainer() {
  const userRepo = new UserRepositoryDrizzle(db);
  const register = new RegisterUseCase(userRepo /*, autres deps */);
  return { userRepo, register };
}