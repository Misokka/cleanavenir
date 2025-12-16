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

export class UserRepositoryDrizzle implements UserRepository {
  constructor(private readonly db: DrizzleClient) {}

  async save(user: User): Promise<Result<User, EmailAlreadyUsedError | InvalidRoleError>> {
    try {
      const now = new Date().toISOString();
      const isActive = (user as any).active ? 1 : 0;
      
      let emailVerifiedAt = now;
      const userEmailVerified = (user as any).emailVerifiedAt;
      if (userEmailVerified) {
        emailVerifiedAt = userEmailVerified instanceof Date 
          ? userEmailVerified.toISOString() 
          : userEmailVerified;
      }
      
      const createdAt = (user as any).createdAt ?? now;
      const updatedAt = (user as any).updatedAt ?? now;

      await this.db.insert(users).values({
        id: user.userIdentifier,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
        role: user.role,
        isActive,
        emailVerifiedAt,
        createdAt,
        updatedAt,
      });
      return ok(user);
    } catch (e: any) {
      if (e.message?.includes('UNIQUE constraint')) {
        return err(new EmailAlreadyUsedError(user.email));
      }
      return err(new InvalidRoleError(user.userIdentifier));
    }
  }

  async update(user: User): Promise<Result<User, UserNotFoundError | EmailAlreadyUsedError | InvalidRoleError | Error>> {
    try {
      const now = new Date().toISOString();
      const isActive = (user as any).active ? 1 : 0;

      let emailVerifiedAt = null;
      const userEmailVerified = (user as any).emailVerifiedAt;
      if (userEmailVerified) {
        emailVerifiedAt = userEmailVerified instanceof Date 
          ? userEmailVerified.toISOString() 
          : userEmailVerified;
      }

      await this.db
        .update(users)
        .set({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
          role: user.role,
          isActive,
          emailVerifiedAt,
          updatedAt: now,
        })
        .where(eq(users.id, user.userIdentifier));

      return this.findById(user.userIdentifier);
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
      const r = rows[0];
      const u = User.create({userIdentifier: r.id, firstname: r.firstname, lastname: r.lastname, email: r.email, password: r.password, role: r.role});
      (u as any).id = r.id;
      (u as any).isActive = r.isActive;
      (u as any).emailVerifiedAt = r.emailVerifiedAt;
      (u as any).createdAt = r.createdAt;
      (u as any).updatedAt = r.updatedAt;
      return ok(u);
    } catch (e: any) {
      return err(new UserNotFoundError(id));
    }
  }

  async findByEmail(email: string): Promise<Result<User, UserNotFoundError>> {
    try {
      const rows = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!rows.length) return err(new UserNotFoundError(email));
      const r = rows[0];
      const u = User.create({userIdentifier: r.id, firstname: r.firstname, lastname: r.lastname, email: r.email, password: r.password, role: r.role});
      (u as any).id = r.id;
      (u as any).isActive = r.isActive;
      (u as any).emailVerifiedAt = r.emailVerifiedAt;
      (u as any).createdAt = r.createdAt;
      (u as any).updatedAt = r.updatedAt;
      return ok(u);
    } catch (e: any) {
      return err(new UserNotFoundError(email));
    }
  }

  async setRole(id: string, role: UserRole): Promise<Result<User, UserNotFoundError | InvalidRoleError>> {
    try {
      const now = new Date().toISOString();
      await this.db
        .update(users)
        .set({ role, updatedAt: now })
        .where(eq(users.id, id));

      return this.findById(id);
    } catch (e: any) {
      return err(new InvalidRoleError(id));
    }
  }

  async setActive(id: string, active: boolean): Promise<Result<User, UserNotFoundError>> {
    try {
      const now = new Date().toISOString();
      await this.db
        .update(users)
        .set({ isActive: active ? 1 : 0, updatedAt: now })
        .where(eq(users.id, id));

      return this.findById(id);
    } catch (e: any) {
      return err(new UserNotFoundError(id));
    }
  }

  async setEmailVerified(id: string, whenISO: string): Promise<Result<User, UserNotFoundError>> {
    try {
      const now = new Date().toISOString();
      await this.db
        .update(users)
        .set({ emailVerifiedAt: whenISO, updatedAt: now })
        .where(eq(users.id, id));

      return this.findById(id);
    } catch (e: any) {
      return err(new UserNotFoundError(id));
    }
  }

  async listByRole(role: UserRole): Promise<Result<User[], never>> {
    try {
      const rows = await this.db.select().from(users).where(eq(users.role, role));
      const userList = rows.map((r: any) => 
        User.create({userIdentifier: r.id, firstname: r.firstname, lastname: r.lastname, email: r.email, password: r.password, role: r.role})
      );
      return ok(userList);
    } catch (e: any) {
      return ok([]);
    }
  }
}