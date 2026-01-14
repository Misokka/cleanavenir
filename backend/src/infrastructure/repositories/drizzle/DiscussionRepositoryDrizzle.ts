import { eq, isNull, and, ne } from 'drizzle-orm';
import { discussions, messages } from '../../drizzle/schema';
import { ok, err, Result } from '../../../shared/Result';
import { DiscussionRepository } from '../../../application/ports/repositories/DiscussionRepository';
import { DrizzleClient } from '../../drizzle/client';
import { DrizzleDiscussionMapper } from '../mappers/DrizzleMappers/DrizzleDiscussionMapper';
import { Discussion } from '../../../domain/entities/Discussion';
import { DiscussionNotFoundError } from '../../../domain/errors/DiscussionNotFoundError';
import { DiscussionAlreadyAssignedError } from '../../../domain/errors/DiscussionAlreadyAssignedError';

export class DiscussionRepositoryDrizzle implements DiscussionRepository {
  constructor(
    private db: DrizzleClient,
    private readonly discussionMapper: DrizzleDiscussionMapper
  ) {}

  async save(discussion: Discussion): Promise<Result<Discussion, Error>> {
    try {
      const discussionToPersist = this.discussionMapper.toPersistence(discussion);
      const registeredDiscussions = await this.db.insert(discussions).values(discussionToPersist).returning();
      const discussionToDomain = this.discussionMapper.toDomain(registeredDiscussions[0]);
      return ok(discussionToDomain);
    } catch (e: any) {
      return err(new Error(`Could not insert discussion: ${e.message}`));
    }
  }

  async findById(discussionId: string): Promise<Result<Discussion, Error>> {
    try {
      const rows = await this.db.select().from(discussions).where(eq(discussions.id, discussionId));
      if (rows.length === 0) {
        return err(new DiscussionNotFoundError(discussionId));
      }
      return ok(this.discussionMapper.toDomain(rows[0]));
    } catch (e: any) {
      return err(new Error(`Could not find discussion: ${e.message}`));
    }
  }

  async listForClient(clientId: string): Promise<Result<Discussion[], Error>> {
    try {
      const discussionRows = await this.db.select().from(discussions).where(eq(discussions.clientId, clientId));
      const discussionsToDomain = discussionRows.map((row) => this.discussionMapper.toDomain(row));
      return ok(discussionsToDomain);
    } catch (error) {
      return err(new Error(`An error occurred when fetching discussions for client: ${clientId}`));
    }
  }

  async listPending(): Promise<Result<Discussion[], Error>> {
    try {
      const discussionRows = await this.db
        .select()
        .from(discussions)
        .where(eq(discussions.status, 'PENDING'));
      const discussionsToDomain = discussionRows.map((row) => this.discussionMapper.toDomain(row));
      return ok(discussionsToDomain);
    } catch (error) {
      return err(new Error('An error occurred when fetching pending discussions'));
    }
  }

  async listForAdvisor(advisorId: string): Promise<Result<Discussion[], Error>> {
    try {
      const discussionRows = await this.db
        .select()
        .from(discussions)
        .where(and(
          eq(discussions.advisorId, advisorId),
          eq(discussions.status, 'ASSIGNED')
        ));
      const discussionsToDomain = discussionRows.map((row) => this.discussionMapper.toDomain(row));
      return ok(discussionsToDomain);
    } catch (error) {
      return err(new Error(`An error occurred when fetching discussions for advisor: ${advisorId}`));
    }
  }

  async update(discussion: Discussion): Promise<Result<Discussion, Error>> {
    try {
      const discussionToPersist = this.discussionMapper.toPersistence(discussion);
      const updatedRows = await this.db
        .update(discussions)
        .set({
          advisorId: discussionToPersist.advisorId,
          subject: discussionToPersist.subject,
          status: discussionToPersist.status,
          updatedAt: discussionToPersist.updatedAt,
        })
        .where(eq(discussions.id, discussion.discussionIdentifier))
        .returning();
      
      if (updatedRows.length === 0) {
        return err(new DiscussionNotFoundError(discussion.discussionIdentifier));
      }
      return ok(this.discussionMapper.toDomain(updatedRows[0]));
    } catch (e: any) {
      return err(new Error(`Could not update discussion: ${e.message}`));
    }
  }

  async claimDiscussion(discussionId: string, advisorId: string): Promise<Result<Discussion, Error>> {
    try {
      const now = new Date().toISOString();
      const updatedRows = await this.db
        .update(discussions)
        .set({
          advisorId: advisorId,
          status: 'ASSIGNED',
          updatedAt: now,
        })
        .where(and(
          eq(discussions.id, discussionId),
          eq(discussions.status, 'PENDING')
        ))
        .returning();

      if (updatedRows.length === 0) {
        const existing = await this.db.select().from(discussions).where(eq(discussions.id, discussionId));
        if (existing.length === 0) {
          return err(new DiscussionNotFoundError(discussionId));
        }
        return err(new DiscussionAlreadyAssignedError(discussionId));
      }

      return ok(this.discussionMapper.toDomain(updatedRows[0]));
    } catch (e: any) {
      return err(new Error(`Could not claim discussion: ${e.message}`));
    }
  }

  async markMessagesAsRead(discussionId: string, readerRole: 'CLIENT' | 'ADVISOR'): Promise<Result<number, Error>> {
    try {
      const now = new Date().toISOString();
      const senderRoleToMark = readerRole === 'CLIENT' ? 'ADVISOR' : 'CLIENT';
      
      const result = await this.db
        .update(messages)
        .set({
          isRead: 1,
          readAt: now,
        })
        .where(and(
          eq(messages.discussionId, discussionId),
          eq(messages.senderRole, senderRoleToMark),
          eq(messages.isRead, 0)
        ));
      
      return ok(result.rowsAffected || 0);
    } catch (e: any) {
      return err(new Error(`Could not mark messages as read: ${e.message}`));
    }
  }
}
