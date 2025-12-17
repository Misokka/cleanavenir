import { eq } from 'drizzle-orm';
import { ok, err, Result } from '../../../shared/Result';
import { Advisor } from '../../../domain/entities/Advisor';
import { AdvisorRepository } from '../../../application/ports/repositories/AdvisorRepository';
import { InvalidRoleError } from '../../../domain/errors/InvalidRoleError';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import { advisors } from '../../drizzle/schema';
import { DrizzleClient } from '../../drizzle/client';
import { DrizzleAdvisorMapper } from '../mappers/DrizzleMappers/DrizzleAdvisorMapper';

export class AdvisorRepositoryDrizzle implements AdvisorRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly advisorMapper: DrizzleAdvisorMapper
  ) {}

  async save(advisor: Advisor): Promise<Result<Advisor, InvalidRoleError>> {
    try {
      const advisorToPersist = this.advisorMapper.toPersistence(advisor);
      const registeredAdvisors = await this.db.insert(advisors).values(advisorToPersist).returning();
      const toDomainAdvisor = this.advisorMapper.toDomain(registeredAdvisors[0]);
      return ok(toDomainAdvisor);
    } catch (e: any) {
      return err(new InvalidRoleError(advisor.userIdentifier));
    }
  }

  async findById(advisorIdentifier: string): Promise<Result<Advisor, UserNotFoundError>> {
    try {
      const advisorRows = await this.db
        .select()
        .from(advisors)
        .where(eq(advisors.id, advisorIdentifier))
        .limit(1);

      if (!advisorRows.length) {
        return err(new UserNotFoundError(advisorIdentifier));
      }

      const advisorToDomain = this.advisorMapper.toDomain(advisorRows[0])
      
      return ok(advisorToDomain);
    } catch (e: any) {
      return err(new UserNotFoundError(advisorIdentifier));
    }
  }
}
