import { eq, desc } from 'drizzle-orm';
import { messages } from '../../drizzle/schema';
import { ok, err, Result } from '../../../shared/Result';
import { MessageRepository } from '../../../application/ports/repositories/MessageRepository';
import { DrizzleClient } from '../../drizzle/client';
import { DrizzleMessageMapper } from '../mappers/DrizzleMappers/DrizzleMessageMapper';
import { Message } from '../../../domain/entities/Message';
import { MessageNotFoundError } from '../../../domain/errors/MessageNotFoundError';

export class MessageRepositoryDrizzle implements MessageRepository {
  constructor(
    private db: DrizzleClient,
    private readonly messageMapper: DrizzleMessageMapper
  ) {}

  async save(message: Message): Promise<Result<Message, Error>> {
    try {
      const messageToPersist = this.messageMapper.toPersistence(message);
      const savedMessages = await this.db.insert(messages).values(messageToPersist).returning();
      const messageToDomain = this.messageMapper.toDomain(savedMessages[0]);
      return ok(messageToDomain);
    } catch (e: any) {
      return err(new Error(`Could not insert message: ${e.message}`));
    }
  }

  async findById(messageId: string): Promise<Result<Message, Error>> {
    try {
      const rows = await this.db.select().from(messages).where(eq(messages.id, messageId));
      if (rows.length === 0) {
        return err(new MessageNotFoundError(messageId));
      }
      return ok(this.messageMapper.toDomain(rows[0]));
    } catch (e: any) {
      return err(new Error(`Could not find message: ${e.message}`));
    }
  }

  async listForDiscussion(discussionId: string): Promise<Result<Message[], Error>> {
    try {
      const messageRows = await this.db
        .select()
        .from(messages)
        .where(eq(messages.discussionId, discussionId))
        .orderBy(messages.createdAt);
      const messagesToDomain = messageRows.map((row) => this.messageMapper.toDomain(row));
      return ok(messagesToDomain);
    } catch (error) {
      return err(new Error(`An error occurred when fetching messages for discussion: ${discussionId}`));
    }
  }
}
