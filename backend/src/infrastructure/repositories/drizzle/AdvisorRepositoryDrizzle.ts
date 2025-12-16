import { eq } from 'drizzle-orm';
import { ok, err, Result } from '../../../shared/Result';
import { Advisor } from '../../../domain/entities/Advisor';
import { AdvisorRepository } from '../../../application/ports/repositories/AdvisorRepository';
import { InvalidRoleError } from '../../../domain/errors/InvalidRoleError';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import { users } from '../../drizzle/schema';
import { DrizzleClient } from '../../drizzle/client';

export class AdvisorRepositoryDrizzle implements AdvisorRepository {
  constructor(private readonly db: DrizzleClient) {}

  async save(advisor: Advisor): Promise<Result<Advisor, InvalidRoleError>> {
    try {
      const userRow = await this.db
        .select()
        .from(users)
        .where(eq(users.id, advisor.userIdentifier))
        .limit(1);

      if (!userRow.length || userRow[0].role !== 'ADVISOR') {
        return err(new InvalidRoleError(advisor.userIdentifier));
      }

      return ok(advisor);
    } catch (e: any) {
      return err(new InvalidRoleError(advisor.userIdentifier));
    }
  }

  async findById(userIdentifier: string): Promise<Result<Advisor, UserNotFoundError>> {
    try {
      const userRow = await this.db
        .select()
        .from(users)
        .where(eq(users.id, userIdentifier))
        .limit(1);

      if (!userRow.length || userRow[0].role !== 'ADVISOR') {
        return err(new UserNotFoundError(userIdentifier));
      }

      const advisor = Advisor.create({
        advisorIdentifier: userRow[0].id,
        userIdentifier
      });
      return ok(advisor);
    } catch (e: any) {
      return err(new UserNotFoundError(userIdentifier));
    }
  }
}
