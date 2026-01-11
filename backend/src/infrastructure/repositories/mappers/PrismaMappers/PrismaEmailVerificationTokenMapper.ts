import { EmailVerificationToken as PrismaEmailVerificationToken } from "@prisma/client";
import { Mapper } from "../MapperInterface";
import { EmailVerificationToken } from "../../../../domain/entities/EmailVerificationToken";

type EmailVerificationTokenToPersist = {
  tokenIdentifier: string
  userIdentifier: string
  tokenHash: string
  expiresAt: Date
  createdAt: Date
  usedAt?: Date
}
export class PrismaEmailVerificationTokenMapper implements Mapper<PrismaEmailVerificationToken, EmailVerificationToken, EmailVerificationTokenToPersist>{
  toDomain(raw: PrismaEmailVerificationToken): EmailVerificationToken {
    return EmailVerificationToken.create({
      ...raw
    })
  }

  toPersistence(obj: EmailVerificationToken): EmailVerificationTokenToPersist {
    return {
      ...obj,
      usedAt: obj.usedAt ?? new Date()
    }
  }
}