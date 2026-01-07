import { createHash } from "node:crypto";
import { EmailVerificationTokenRepository } from "../../../ports/repositories/EmailVerificationTokenRepository";
import { UserRepository } from "../../../ports/repositories/UserRepository";
import { VerificationTokenExpiredError } from "../../../../domain/errors/VerificationTokenExpiredError";
import { VerificationTokenInvalidError } from "../../../../domain/errors/VerificationTokenInvalidError";
import { err, ok, Result } from "../../../../shared/Result";

export class VerifyEmailUseCase {
  constructor(
    private readonly tokenRepository: EmailVerificationTokenRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(rawToken: string): Promise<Result<{ email: string }, Error>> {
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    const tokenResult = await this.tokenRepository.findByTokenHash(tokenHash);
    if (!tokenResult.ok) {
      return err(new VerificationTokenInvalidError());
    }

    const token = tokenResult.value;

    if (token.isUsed()) {
      return err(new VerificationTokenInvalidError());
    }

    if (token.isExpired()) {
      return err(new VerificationTokenExpiredError());
    }

    const userResult = await this.userRepository.findById(token.userIdentifier);
    if (!userResult.ok) {
      return err(new VerificationTokenInvalidError());
    }

    const user = userResult.value;

    user.emailVerifiedAt = new Date();
    const updateResult = await this.userRepository.update(user);
    if (!updateResult.ok) {
      return err(updateResult.error);
    }

    await this.tokenRepository.markAsUsed(token.tokenIdentifier);

    return ok({ email: user.email });
  }
}
