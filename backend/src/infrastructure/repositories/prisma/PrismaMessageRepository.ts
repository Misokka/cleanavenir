import { PrismaClient } from "@prisma/client";
import { MessageRepository } from "../../../application/ports/repositories/MessageRepository";
import { PrismaMessageMapper } from "../mappers/PrismaMappers/PrismaMessageMapper";
import { Message } from "../../../domain/entities/Message";
import Result, { err, ok } from "../../../shared/Result";

export class PrismaMessageRepository implements MessageRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaMessageMapper: PrismaMessageMapper
  ){}

  async save(message: Message): Promise<Result<Message, Error>> {
    try{
      const messageToPersist = this.prismaMessageMapper.toPersistence(message);
      const savedMessage = await this.prismaClient.message.create({
        data: messageToPersist
      });
      if(!savedMessage) return err(new Error(`Couldn't save message: ${message.messageIdentifier}`));
      const toDomain = this.prismaMessageMapper.toDomain(savedMessage);
      return ok(toDomain);
    } catch (error: any) {
      return err(new Error(`An error occured when saving message: ${message.messageIdentifier}. Message: ${error.message}`));
    }
  }

  async findById(messageId: string): Promise<Result<Message, Error>> {
    try{
      const message = await this.prismaClient.message.findUnique({
        where: {
          messageIdentifier: messageId
        }
      });
      if(!message) return err(new Error(`Message ${messageId} not found.`));
      const toDomain = this.prismaMessageMapper.toDomain(message);
      return ok(toDomain);
    } catch (error: any) {
      return err(new Error(`An error occured when retrieving message: ${messageId}. Message: ${error.message}`));
    }
  }

  async listForDiscussion(discussionId: string): Promise<Result<Message[], Error>> {
    try{
      const messages = await this.prismaClient.message.findMany({
        where: {
          discussionIdentifier: discussionId
        }
      });
      if(!messages) return err(new Error(`Couldn't' find messages for discussion ${discussionId}`));
      const toDomain = messages.map(message => this.prismaMessageMapper.toDomain(message));
      return ok(toDomain);
    } catch (error: any) {
      return err(new Error(``));
    }
  }
}