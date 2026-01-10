import { eq } from "drizzle-orm";
import { EmailVerificationTokenRepository } from "../../../application/ports/repositories/EmailVerificationTokenRepository";
import { EmailVerificationToken } from "../../../domain/entities/EmailVerificationToken";
import { Result, ok, err } from "../../../shared/Result";
import { emailVerificationTokens } from "../../drizzle/schema";
import { DrizzleEmailVerificationTokenMapper } from "../mappers/DrizzleMappers/DrizzleEmailVerificationTokenMapper";
import { DrizzleClient } from "../../drizzle/client";
import { EmailVerificationTokenNotFoundError } from "../../../domain/errors/EmailVerificationTokenNotFoundError";


export class EmailVerificationTokenRepositoryDrizzle implements EmailVerificationTokenRepository {
  constructor(private readonly db: DrizzleClient) {}

  async save(token: EmailVerificationToken): Promise<Result<EmailVerificationToken, Error>> {
    try {
      const row = DrizzleEmailVerificationTokenMapper.toPersistence(token);
      await this.db.insert(emailVerificationTokens).values(row);
      return ok(token);
    } catch (error) {
      return err(error instanceof Error ? error : new Error("Failed to save verification token"));
    }
  }

  async findByTokenHash(tokenHash: string): Promise<Result<EmailVerificationToken, EmailVerificationTokenNotFoundError>> {
    try {
      const rows = await this.db.select().from(emailVerificationTokens).where(eq(emailVerificationTokens.tokenHash, tokenHash));
      if (!rows.length) {
        return err(new EmailVerificationTokenNotFoundError(`Token with hash ${tokenHash} not found`));
      }
      return ok(DrizzleEmailVerificationTokenMapper.toDomain(rows[0]));
    } catch (error) {
      return err(new EmailVerificationTokenNotFoundError(`Token with hash ${tokenHash} not found`));
    }
  }

  async findByUserId(userId: string): Promise<Result<EmailVerificationToken | null, Error>> {
    try {
      const rows = await this.db.select().from(emailVerificationTokens).where(eq(emailVerificationTokens.userId, userId));
      if (!rows.length) {
        return ok(null);
      }
      return ok(DrizzleEmailVerificationTokenMapper.toDomain(rows[0]));
    } catch (error) {
      return err(error instanceof Error ? error : new Error("Failed to find token by user ID"));
    }
  }

  async markAsUsed(tokenId: string): Promise<Result<void, Error>> {
    try {
      const now = new Date().toISOString();
      await this.db.update(emailVerificationTokens)
        .set({ usedAt: now })
        .where(eq(emailVerificationTokens.id, tokenId));
      return ok(undefined);
    } catch (error) {
      return err(error instanceof Error ? error : new Error("Failed to mark token as used"));
    }
  }

  async update(token: EmailVerificationToken): Promise<Result<EmailVerificationToken, Error>> {
    try {
      const row = DrizzleEmailVerificationTokenMapper.toPersistence(token);
      await this.db.update(emailVerificationTokens).set(row).where(eq(emailVerificationTokens.id, token.tokenIdentifier));
      return ok(token);
    } catch (error) {
      return err(error instanceof Error ? error : new Error("Failed to update verification token"));
    }
  }

  async deleteByUserId(userId: string): Promise<Result<void, Error>> {
    try {
      await this.db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.userId, userId));
      return ok(undefined);
    } catch (error) {
      return err(error instanceof Error ? error : new Error("Failed to delete verification tokens"));
    }
  }
}
