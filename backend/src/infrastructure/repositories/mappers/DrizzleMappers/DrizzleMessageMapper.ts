import { Message, SenderRole } from "../../../../domain/entities/Message";
import { MessageDrizzle, NewMessageDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleMessageMapper implements Mapper<MessageDrizzle, Message, NewMessageDrizzle> {
  toDomain(raw: MessageDrizzle): Message {
    return new Message(
      raw.id,
      raw.discussionId,
      raw.senderId,
      raw.senderRole as SenderRole,
      raw.content,
      new Date(raw.createdAt),
    );
  }

  toPersistence(entity: Message): NewMessageDrizzle {
    return {
      id: entity.messageIdentifier,
      discussionId: entity.discussionIdentifier,
      senderId: entity.senderIdentifier,
      senderRole: entity.senderRole,
      content: entity.content,
      createdAt: entity.createdAt?.toISOString() ?? new Date().toISOString(),
    };
  }
}
