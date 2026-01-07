import { eq } from 'drizzle-orm';
import { discussionTransfers } from '../../drizzle/schema';
import { ok, err, Result } from '../../../shared/Result';
import { DiscussionTransferRepository } from '../../../application/ports/repositories/DiscussionTransferRepository';
import { DrizzleClient } from '../../drizzle/client';
import { DrizzleDiscussionTransferMapper } from '../mappers/DrizzleMappers/DrizzleDiscussionTransferMapper';
import { DiscussionTransfer } from '../../../domain/entities/DiscussionTransfer';

export class DiscussionTransferRepositoryDrizzle implements DiscussionTransferRepository {
  constructor(
    private db: DrizzleClient,
    private readonly transferMapper: DrizzleDiscussionTransferMapper
  ) {}

  async save(transfer: DiscussionTransfer): Promise<Result<DiscussionTransfer, Error>> {
    try {
      const transferToPersist = this.transferMapper.toPersistence(transfer);
      const savedTransfers = await this.db.insert(discussionTransfers).values(transferToPersist).returning();
      const transferToDomain = this.transferMapper.toDomain(savedTransfers[0]);
      return ok(transferToDomain);
    } catch (e: any) {
      return err(new Error(`Could not insert discussion transfer: ${e.message}`));
    }
  }

  async listForDiscussion(discussionId: string): Promise<Result<DiscussionTransfer[], Error>> {
    try {
      const transferRows = await this.db
        .select()
        .from(discussionTransfers)
        .where(eq(discussionTransfers.discussionId, discussionId))
        .orderBy(discussionTransfers.createdAt);
      const transfersToDomain = transferRows.map((row) => this.transferMapper.toDomain(row));
      return ok(transfersToDomain);
    } catch (error) {
      return err(new Error(`An error occurred when fetching transfers for discussion: ${discussionId}`));
    }
  }
}
