import { PrismaClient } from "@prisma/client";
import { DiscussionTransferRepository } from "../../../application/ports/repositories/DiscussionTransferRepository";
import { DiscussionTransfer } from "../../../domain/entities/DiscussionTransfer";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaDiscussionTransferMapper } from "../mappers/PrismaMappers/PrismaDiscussionTransferMapper";


export class PrismaDiscussionTransferRepository implements DiscussionTransferRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaDiscussionTranferMapper: PrismaDiscussionTransferMapper
  ){}
  async save(transfer: DiscussionTransfer): Promise<Result<DiscussionTransfer, Error>> {
    try{
      const transferToPersist = this.prismaDiscussionTranferMapper.toPersistence(transfer);
      const savedTransfer = await this.prismaClient.discussionTransfer.create({
        data: {...transferToPersist}
      });
      if(!savedTransfer) return err(new Error(`Couldn't save discussion transfer: ${transfer.transferIdentifier}`));
      const toDomain = this.prismaDiscussionTranferMapper.toDomain(savedTransfer);
      return ok(toDomain);
    } catch (error) {
      return err(new Error(`An error when saving discussion transfer ${transfer.transferIdentifier}`))
    }
  }

  async listForDiscussion(discussionId: string): Promise<Result<DiscussionTransfer[], Error>> {
    try{
      const transfers = await this.prismaClient.discussionTransfer.findMany({
        where: {
          discussionIdentifier: discussionId
        }
      });
      if(!transfers) return err(new Error(`Couldn't list tranfers for discussion : ${discussionId}`));
      const toDomain = transfers.map((transfer) => this.prismaDiscussionTranferMapper.toDomain(transfer));
      return ok(toDomain);
    } catch (error: any) {
      return err(new Error(`An error occured when listing transfers for discussion : ${discussionId}`))
    }
  }
}