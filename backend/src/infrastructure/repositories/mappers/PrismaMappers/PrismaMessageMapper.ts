import { Mapper } from "../MapperInterface";
import { $Enums, Message as PrismaMessage } from "@prisma/client";
import { Message } from "../../../../domain/entities/Message";

type MessageToPersist = {
  messageIdentifier: string,
  discussionIdentifier: string,
  senderIdentifier: string,
  senderRole: 'CLIENT' | 'ADVISOR',
  content: string,
  createdAt: Date
}

export class PrismaMessageMapper implements Mapper<PrismaMessage, Message, MessageToPersist>{
  toDomain(raw: PrismaMessage): Message {
    return Message.create({
      ...raw
    })
  }

  toPersistence(obj: Message): MessageToPersist {
    return {
      ...obj
    }
  }
}