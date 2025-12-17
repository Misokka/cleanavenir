import { eq } from 'drizzle-orm';
import { discussions } from '../../drizzle/schema';
import { ok, Result } from '../../../shared/Result';
import { DiscussionRepository } from '../../../application/ports/repositories/DiscussionRepository';
import { DrizzleClient } from '../../drizzle/client';
import { DrizzleDiscussionMapper } from '../mappers/DrizzleMappers/DrizzleDiscussionMapper';
import { Discussion } from '../../../domain/entities/Discussion';

export class DiscussionRepositoryDrizzle implements DiscussionRepository {
  constructor(
    private db: DrizzleClient,
    private readonly discussionMapper: DrizzleDiscussionMapper
  ) {}

  async save(discussion: Discussion): Promise<Result<Discussion, Error>> {
    try {
      const discussionToPersist = this.discussionMapper.toPersistence(discussion);
      const registeredDissucions = await this.db.insert(discussions).values(discussionToPersist).returning();
      const discussionToDomain = this.discussionMapper.toDomain(registeredDissucions[0])
      return ok(discussionToDomain);
    } catch (e: any) {
      return Result.err(new Error(`Could not insert discussion: ${e.message}`));
    }
  }

  async listForClient(clientId: string): Promise<Result<Discussion[], Error>> {
    try{
      const discussionRows = await this.db.select().from(discussions).where(eq(discussions.clientId, clientId));
      const discussionsToDomain = discussionRows.map((row) => {
        return this.discussionMapper.toDomain(row);
      });

      return ok(discussionsToDomain);
    } catch (error) {
      return Result.err(new Error(`An error occured when fetching discussions for client: ${clientId}`))
    }
  }
}
