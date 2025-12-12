import { PrismaClient } from "@prisma/client";
import { DiscussionRepository } from "../../../application/ports/repositories/DiscussionRepository";
import { Discussion } from "../../../domain/entities/Discussion";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaDiscussionMapper } from "../mappers/PrismaMappers/PrismaDiscussionMapper";

export class PrismaDiscussionRepository implements DiscussionRepository{
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaDiscussionMapper: PrismaDiscussionMapper,
  ){}

  async save(discussion: Discussion): Promise<Result<Discussion, Error>> {
    try{
      const discussionToPersistence = this.prismaDiscussionMapper.toPersistence(discussion)
      const registeredDiscussion = await this.prismaClient.discussion.create({
        data: {
          ...discussionToPersistence
        }
      });

      const discussionToDomain = this.prismaDiscussionMapper.toDomain(registeredDiscussion)
      return ok(discussionToDomain);

    } catch (error){
      return err(new Error("Error occured when creating a discussion"))
    }
  }

  async listForClient(clientIdentifier: string): Promise<Result<Discussion[], Error>> {
    try{
      const userDiscussionList = await this.prismaClient.discussion.findMany({
        where: {
          clientIdentifier: clientIdentifier
        }
      });

      return ok(userDiscussionList as Discussion[]);
    } catch (error){
      return err(new Error("Error when fetching disuccions."))
    }
  }
}