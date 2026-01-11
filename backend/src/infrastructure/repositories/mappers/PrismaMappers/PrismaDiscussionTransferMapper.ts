import { Mapper } from "../MapperInterface";
import { DiscussionTransfer as PrismaDiscussionTransfer } from "@prisma/client";
import { DiscussionTransfer } from "../../../../domain/entities/DiscussionTransfer";

type DiscussionTransferToPersist = {
  transferIdentifier: string,
  discussionIdentifier: string,
  fromAdvisorIdentifier: string,
  toAdvisorIdentifier: string,
  reason?: string,
  createdAt: Date
}

export class PrismaDiscussionTransferMapper implements Mapper<PrismaDiscussionTransfer, DiscussionTransfer, DiscussionTransferToPersist> {
  toDomain(raw: PrismaDiscussionTransfer): DiscussionTransfer {
    return DiscussionTransfer.create({
      ...raw
    })
  }

  toPersistence(obj: DiscussionTransfer): DiscussionTransferToPersist {
    return {
      ...obj,
      reason: obj.reason as string | undefined
    }
  }
}