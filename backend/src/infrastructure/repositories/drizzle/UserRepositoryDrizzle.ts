import { eq } from 'drizzle-orm';
import { users } from '../../drizzle/schema';
import { ok, err, Result } from '../../../shared/Result';
import { User } from '../../../domain/entities/User';

// any pour le db, pour éviter les imports de types complexes
export class UserRepositoryDrizzle {
  constructor(private readonly db: any) {}

  async save(user: User): Promise<Result<User, Error>> {
    try {
      const now = new Date().toISOString();
      const isActive = (user as any).isActive ? 1 : 0;
      const emailVerifiedAt = (user as any).emailVerifiedAt ?? null;
      const createdAt = (user as any).createdAt ?? now;
      const updatedAt = (user as any).updatedAt ?? now;

      await this.db.insert(users).values({
        id: user.userIndentifier,
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
      return err(e);
    }
  }

  async findById(id: string): Promise<Result<User, Error>> {
    try {
      const rows = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
      if (!rows.length) return err(new Error('User not found'));
      const r = rows[0];
      const u = new User(r.id, r.firstname, r.lastname, r.email, r.password, r.role);
      return ok(u);
    } catch (e: any) {
      return err(e);
    }
  }

  async findByEmail(email: string): Promise<Result<User, Error>> {
    try {
      const rows = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!rows.length) return err(new Error('User not found'));
      const r = rows[0];
      const u = new User(r.id, r.firstname, r.lastname, r.email, r.password, r.role);
      return ok(u);
    } catch (e: any) {
      return err(e);
    }
  }
}