import { eq } from 'drizzle-orm';
import { users } from '../../drizzle/schema';
import { ok, err, Result } from '../../../shared/Result';
import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../application/ports/repositories/UserRepository';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import { EmailAlreadyUsedError } from '../../../domain/errors/EmailAlreadyUsedError';
import { InvalidRoleError } from '../../../domain/errors/InvalidRoleError';
import { UserRole } from '../../../application/dtos/UserDTO';
import { DrizzleClient } from '../../drizzle/client';
import { DrizzleUserMapper } from '../mappers/DrizzleMappers/DrizzleUserMapper';

export class UserRepositoryDrizzle implements UserRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly userMapper: DrizzleUserMapper
  ) {}

  async save(user: User): Promise<Result<User, EmailAlreadyUsedError | InvalidRoleError>> {
    try {
      const userToPersist = this.userMapper.toPersistence(user);
      const registeredUserRows = await this.db.insert(users).values(userToPersist).returning();
      const userToDomain = this.userMapper.toDomain(registeredUserRows[0]);
      return ok(userToDomain);
    } catch (e: any) {
      if (e.message?.includes('UNIQUE constraint')) {
        return err(new EmailAlreadyUsedError(user.email));
      }
      return err(new InvalidRoleError(user.userIdentifier));
    }
  }

  async update(user: User): Promise<Result<User, UserNotFoundError | EmailAlreadyUsedError | InvalidRoleError | Error>> {
    try {
      const userToPersist = this.userMapper.toPersistence(user);
      const registeredUserRows = await this.db.update(users).set(userToPersist).where(eq(users.id, user.userIdentifier)).returning();
      const userToDomain = this.userMapper.toDomain(registeredUserRows[0]);
      return ok(userToDomain);
    } catch (e: any) {
      if (e.message?.includes('UNIQUE constraint')) {
        return err(new EmailAlreadyUsedError(user.email));
      }
      return err(new InvalidRoleError(user.userIdentifier));
    }
  }

  async findById(id: string): Promise<Result<User, UserNotFoundError>> {
    try {
      const rows = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
      if (!rows.length) return err(new UserNotFoundError(id));
      const userToDomain = this.userMapper.toDomain(rows[0]);
      return ok(userToDomain);
    } catch (e: any) {
      return err(new UserNotFoundError(id));
    }
  }

  async findByEmail(email: string): Promise<Result<User, UserNotFoundError>> {
    try {
      const rows = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!rows.length) return err(new UserNotFoundError(email));
      const userToDomain = this.userMapper.toDomain(rows[0]);
      return ok(userToDomain);
    } catch (e: any) {
      return err(new UserNotFoundError(email));
    }
  }

  async listByRole(role: UserRole): Promise<Result<User[], never>> {
    try {
      const rows = await this.db.select().from(users).where(eq(users.role, role));
      const userList = rows.map((row) => {
        return this.userMapper.toDomain(row)
      }
      );
      return ok(userList);
    } catch (e: any) {
      return ok([]);
    }
  }
}