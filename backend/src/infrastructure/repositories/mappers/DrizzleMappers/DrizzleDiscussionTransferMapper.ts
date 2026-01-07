import { DiscussionTransfer } from "../../../../domain/entities/DiscussionTransfer";
import { DiscussionTransferDrizzle, NewDiscussionTransferDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleDiscussionTransferMapper implements Mapper<DiscussionTransferDrizzle, DiscussionTransfer, NewDiscussionTransferDrizzle> {
  toDomain(raw: DiscussionTransferDrizzle): DiscussionTransfer {
    return new DiscussionTransfer(
      raw.id,
      raw.discussionId,
      raw.fromAdvisorId,
      raw.toAdvisorId,
      raw.reason ?? null,
      new Date(raw.createdAt),
    );
  }

  toPersistence(entity: DiscussionTransfer): NewDiscussionTransferDrizzle {
    return {
      id: entity.transferIdentifier,
      discussionId: entity.discussionIdentifier,
      fromAdvisorId: entity.fromAdvisorIdentifier,
      toAdvisorId: entity.toAdvisorIdentifier,
      reason: entity.reason ?? null,
      createdAt: entity.createdAt?.toISOString() ?? new Date().toISOString(),
    };
  }
}
