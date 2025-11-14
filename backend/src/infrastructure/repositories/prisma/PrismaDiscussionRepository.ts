import { PrismaClient } from "@prisma/client";
import { DiscussionRepository } from "../../../application/ports/repositories/DiscussionRepository";
import { Discussion } from "../../../domain/entities/Discussion";
import Result, { err, ok } from "../../../shared/Result";

export class PrismaDiscussionRepository implements DiscussionRepository{
  constructor(
    private readonly prismaClient: PrismaClient
  ){}

  async save(discussion: Discussion): Promise<Result<Discussion, Error>> {
    try{
      const registeredDiscussion = await this.prismaClient.discussion.create({
        data: {
          discussionIdentifier: discussion.discussionIdentifier,
          clientIdentifier: discussion.clientIdentifier,
          subject: discussion.subject,
          createdAt: new Date()
        }
      });

      return ok(registeredDiscussion as Discussion);

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