import { Result } from "../../../shared/Result";
import { EmailVerificationToken } from "../../../domain/entities/EmailVerificationToken";

export interface EmailVerificationTokenNotFoundError extends Error {
  name: "EmailVerificationTokenNotFoundError";
}

export interface EmailVerificationTokenRepository {
  save(token: EmailVerificationToken): Promise<Result<EmailVerificationToken, Error>>;
  findByTokenHash(tokenHash: string): Promise<Result<EmailVerificationToken, EmailVerificationTokenNotFoundError>>;
  findByUserId(userId: string): Promise<Result<EmailVerificationToken | null, Error>>;
  markAsUsed(tokenId: string): Promise<Result<void, Error>>;
  deleteByUserId(userId: string): Promise<Result<void, Error>>;
}
