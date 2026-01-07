import { EmailVerificationToken } from "../../../../domain/entities/EmailVerificationToken";
import { EmailVerificationTokenDrizzle, NewEmailVerificationTokenDrizzle } from "../../../drizzle/schema";

export class DrizzleEmailVerificationTokenMapper {
  static toDomain(row: EmailVerificationTokenDrizzle): EmailVerificationToken {
    return EmailVerificationToken.create({
      tokenIdentifier: row.id,
      userIdentifier: row.userId,
      tokenHash: row.tokenHash,
      expiresAt: new Date(row.expiresAt),
      createdAt: new Date(row.createdAt),
      usedAt: row.usedAt ? new Date(row.usedAt) : null,
    });
  }

  static toPersistence(token: EmailVerificationToken): NewEmailVerificationTokenDrizzle {
    return {
      id: token.tokenIdentifier,
      userId: token.userIdentifier,
      tokenHash: token.tokenHash,
      expiresAt: token.expiresAt.toISOString(),
      createdAt: token.createdAt.toISOString(),
      usedAt: token.usedAt ? token.usedAt.toISOString() : null,
    };
  }
}
