import { eq } from 'drizzle-orm';
import { discussions } from '../../drizzle/schema';
import { Result } from '../../../shared/Result';
import { DiscussionRepository } from '../../../application/ports/repositories/DiscussionRepository';
import { DrizzleClient } from '../../drizzle/client';

export class DiscussionRepositoryDrizzle implements DiscussionRepository {
  constructor(private db: DrizzleClient) {}

  async save(discussion: any) {
    try {
      await this.db.insert(discussions).values(discussion);
      return Result.ok(discussion);
    } catch (e: any) {
      return Result.err(new Error(`Could not insert discussion: ${e.message}`));
    }
  }

  async listForClient(clientId: string) {
    try {
      const rows = await this.db.select().from(discussions).where(eq(discussions.clientId, clientId));
      return Result.ok(rows);
    } catch (e: any) {
      return Result.err(new Error(`Could not list discussions: ${e.message}`));
    }
  }
}
