import { desc } from 'drizzle-orm';
import { db } from '../drizzle/client';
import { groupMessages, GroupMessageDrizzle, NewGroupMessageDrizzle } from '../drizzle/schema';
import { GroupMessageRepository } from '../../application/ports/repositories/GroupMessageRepository';
import { GroupMessage } from '../../domain/entities/GroupMessage';
import { Result, ok, err } from '../../shared/Result';

export class DrizzleGroupMessageRepository implements GroupMessageRepository {
  async save(message: GroupMessage): Promise<Result<GroupMessage, Error>> {
    try {
      const newMessage: NewGroupMessageDrizzle = {
        id: message.messageIdentifier,
        senderId: message.senderIdentifier,
        senderRole: message.senderRole,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
      };

      await db.insert(groupMessages).values(newMessage);
      return ok(message);
    } catch (error) {
      return err(new Error(`Failed to save group message: ${error}`));
    }
  }

  async findAll(limit = 50, offset = 0): Promise<Result<GroupMessage[], Error>> {
    try {
      const rows = await db
        .select()
        .from(groupMessages)
        .orderBy(desc(groupMessages.createdAt))
        .limit(limit)
        .offset(offset);

      const messageList = rows.map(row => this.toDomain(row));
      return ok(messageList);
    } catch (error) {
      return err(new Error(`Failed to find group messages: ${error}`));
    }
  }

  async findRecent(limit: number): Promise<Result<GroupMessage[], Error>> {
    try {
      const rows = await db
        .select()
        .from(groupMessages)
        .orderBy(desc(groupMessages.createdAt))
        .limit(limit);

      const messageList = rows.map(row => this.toDomain(row));
      return ok(messageList);
    } catch (error) {
      return err(new Error(`Failed to find recent group messages: ${error}`));
    }
  }

  private toDomain(row: GroupMessageDrizzle): GroupMessage {
    return new GroupMessage(
      row.id,
      row.senderId,
      row.senderRole as 'ADVISOR' | 'DIRECTOR',
      row.content,
      new Date(row.createdAt)
    );
  }
}
