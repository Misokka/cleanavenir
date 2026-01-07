import { randomUUID, createHash } from "node:crypto";
import { EmailVerificationToken } from "../../../../domain/entities/EmailVerificationToken";
import { EmailVerificationTokenRepository } from "../../../ports/repositories/EmailVerificationTokenRepository";
import { EmailService } from "../../../ports/services/EmailService";
import { err, ok, Result } from "../../../../shared/Result";

const TOKEN_EXPIRY_HOURS = 24;

export class SendVerificationEmailUseCase {
  constructor(
    private readonly tokenRepository: EmailVerificationTokenRepository,
    private readonly emailService: EmailService
  ) {}

  async execute(userId: string, email: string): Promise<Result<void, Error>> {
    try {
      await this.tokenRepository.deleteByUserId(userId);
      const rawToken = randomUUID();
      const tokenHash = createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date();

      expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);

      const token = EmailVerificationToken.create({
        tokenIdentifier: randomUUID(),
        userIdentifier: userId,
        tokenHash,
        expiresAt,
        createdAt: new Date(),
      });

      const saveResult = await this.tokenRepository.save(token);
      if (!saveResult.ok) {
        return err(saveResult.error);
      }

      await this.emailService.sendConfirmationEmail(email, rawToken);

      return ok(undefined);
    } catch (error) {
      return err(error instanceof Error ? error : new Error("Failed to send verification email"));
    }
  }
}
