import { eq } from 'drizzle-orm';
import { ok, err, Result } from '../../../shared/Result';
import { Director } from '../../../domain/entities/Director';
import { DirectorRepository } from '../../../application/ports/repositories/DirectorRepository';
import { InvalidRoleError } from '../../../domain/errors/InvalidRoleError';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import { users } from '../../drizzle/schema';

export class DirectorRepositoryDrizzle implements DirectorRepository {
  constructor(private readonly db: any) {}

  async save(director: Director): Promise<Result<Director, InvalidRoleError>> {
    try {
      const userRow = await this.db
        .select()
        .from(users)
        .where(eq(users.id, director.userIdentifier))
        .limit(1);

      if (!userRow.length || userRow[0].role !== 'DIRECTOR') {
        return err(new InvalidRoleError(director.userIdentifier));
      }

      return ok(director);
    } catch (e: any) {
      return err(new InvalidRoleError(director.userIdentifier));
    }
  }

  async findById(userIdentifier: string): Promise<Result<Director, UserNotFoundError>> {
    try {
      const userRow = await this.db
        .select()
        .from(users)
        .where(eq(users.id, userIdentifier))
        .limit(1);

      if (!userRow.length || userRow[0].role !== 'DIRECTOR') {
        return err(new UserNotFoundError(userIdentifier));
      }

      const director = Director.create({
        directorIdentifier: userRow[0].id,
        userIdentifier
      });
      return ok(director);
    } catch (e: any) {
      return err(new UserNotFoundError(userIdentifier));
    }
  }
}
