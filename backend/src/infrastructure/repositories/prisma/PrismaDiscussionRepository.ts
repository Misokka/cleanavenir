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

  async findById(discussionId: string): Promise<Result<Discussion, Error>> {
    try{
      const discussion = await this.prismaClient.discussion.findUnique({
        where: {discussionIdentifier: discussionId}
      });
      if(!discussion) return err(new Error(`Discussion ${discussionId} not found.`));
      const toDomain = this.prismaDiscussionMapper.toDomain(discussion);
      return ok(toDomain)
    } catch (error) {
      return err(new Error(`An error occured when retrieving discussion: ${discussionId}`))
    }
  }

  async claimDiscussion(discussionId: string, advisorId: string): Promise<Result<Discussion, Error>> {
    try{
      const claimedDiscussion = await this.prismaClient.discussion.update({
        where: {
          discussionIdentifier: discussionId
        },
        data: {
          status: "ASSIGNED",
          advisorIdentifier: advisorId
        }
      });
      if(!claimedDiscussion) return err(new Error(`Couldn't assign discussion ${discussionId} to advisor ${advisorId}`));
      const toDomain = this.prismaDiscussionMapper.toDomain(claimedDiscussion);
      return ok(toDomain);
    } catch (error) {
      return err(new Error(`An error occured whhen assigning discussion ${discussionId} to advisor ${advisorId}`))
    }
  }

  async listForAdvisor(advisorId: string): Promise<Result<Discussion[], Error>> {
    try{
      const discussion = await this.prismaClient.discussion.findMany({
        where: {advisorIdentifier: advisorId}
      });
      if(!discussion) return err(new Error(`Discussions for advisor ${advisorId} not found.`));
      const toDomain = discussion.map((discussion) => this.prismaDiscussionMapper.toDomain(discussion));
      return ok(toDomain)
    } catch (error) {
      return err(new Error(`An error occured when retrieving discussions for advisor ${advisorId}`))
    }
  }

  async listPending(): Promise<Result<Discussion[], Error>> {
    try{
      const discussion = await this.prismaClient.discussion.findMany({
        where: {status: "PENDING"}
      });
      if(!discussion) return err(new Error(`Couldn't retrieve `));
      const toDomain = discussion.map((discussion) => this.prismaDiscussionMapper.toDomain(discussion));
      return ok(toDomain)
    } catch (error) {
      return err(new Error(`An error occured when retrieving pending discussions.`))
    }
  }

  async update(discussion: Discussion): Promise<Result<Discussion, Error>> {
    try{
      const discussionToPersist = this.prismaDiscussionMapper.toPersistence(discussion);
      const updatedDiscussion = await this.prismaClient.discussion.update({
        where: {
          discussionIdentifier: discussion.discussionIdentifier
        },
        data: {...discussionToPersist}
      });
      if(!updatedDiscussion) return err(new Error(`Culdn't updated discussion ${discussion.discussionIdentifier}`));
      const toDomain = this.prismaDiscussionMapper.toDomain(updatedDiscussion);
      return ok(toDomain);
    } catch (error) {
      return err(new Error(`An error occured when updating discussion ${discussion.discussionIdentifier}`))
    }
  }
}