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

  async save(user: User): Promise<Result<User, EmailAlreadyUsedError | InvalidRoleError | Error>> {
    try {
      const userToPersist = this.userMapper.toPersistence(user);
      const registeredUserRows = await this.db.insert(users).values(userToPersist).returning();
      const userToDomain = this.userMapper.toDomain(registeredUserRows[0]);
      return ok(userToDomain);
    } catch (e: any) {
      if (e.message?.includes('UNIQUE constraint')) {
        return err(new EmailAlreadyUsedError(user.email));
      }
      console.error('Error saving user:', e);
      return err(new Error(e.message || 'Failed to save user'));
    }
  }

  async getSystemUser(): Promise<Result<User, Error>> {
    try{
      const rows = await this.db.select().from(users).where(eq(users.email, 'sys@example.com'));
      const toDomain = this.userMapper.toDomain(rows[0]);
      return ok(toDomain);
    } catch (error) {
      return err(new Error("System user not found"))
    }
  }

  async update(user: User): Promise<Result<User, UserNotFoundError | EmailAlreadyUsedError | InvalidRoleError | Error>> {
    try {
      const userToPersist = this.userMapper.toPersistence(user);
      const registeredUserRows = await this.db.update(users).set(userToPersist).where(eq(users.id, user.userIdentifier)).returning();
      
      if (!registeredUserRows.length) {
        return err(new UserNotFoundError(user.userIdentifier));
      }
      
      const userToDomain = this.userMapper.toDomain(registeredUserRows[0]);
      return ok(userToDomain);
    } catch (e: any) {
      if (e.message?.includes('UNIQUE constraint')) {
        return err(new EmailAlreadyUsedError(user.email));
      }
      console.error('Error updating user:', e);
      return err(new Error(e.message || 'Failed to update user'));
    }
  }

  async delete(userId: string): Promise<Result<void, UserNotFoundError | Error>> {
    try {
      const result = await this.db.delete(users).where(eq(users.id, userId)).returning();
      
      if (!result.length) {
        return err(new UserNotFoundError(userId));
      }
      
      return ok(undefined);
    } catch (e: any) {
      console.error('Error deleting user:', e);
      return err(new Error(e.message || 'Failed to delete user'));
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

  async listByRole(role: UserRole): Promise<Result<User[], Error>> {
    try {
      const rows = await this.db.select().from(users).where(eq(users.role, role));
      const userList = rows.map((row) => {
        return this.userMapper.toDomain(row)
      }
      );
      return ok(userList);
    } catch (e: any) {
      return err(new Error(`An error occured when fetching user with role: ${role}. \nERROR: ${e}`));
    }
  }
}