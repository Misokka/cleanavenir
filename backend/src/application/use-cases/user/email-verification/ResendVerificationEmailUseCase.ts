import { UserRepository } from "../../../ports/repositories/UserRepository";
import { EmailVerificationTokenRepository } from "../../../ports/repositories/EmailVerificationTokenRepository";
import { EmailService } from "../../../ports/services/EmailService";
import { SendVerificationEmailUseCase } from "./SendVerificationEmailUseCase";
import { err, ok, Result } from "../../../../shared/Result";

export class ResendVerificationEmailUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: EmailVerificationTokenRepository,
    private readonly emailService: EmailService
  ) {}

  async execute(email: string): Promise<Result<void, Error>> {
    const userResult = await this.userRepository.findByEmail(email.toLowerCase());
    if (!userResult.ok) {
      return ok(undefined);
    }

    const user = userResult.value;

    if (user.emailVerifiedAt) {
      return ok(undefined);
    }

    const sendUseCase = new SendVerificationEmailUseCase(
      this.tokenRepository,
      this.emailService
    );

    return sendUseCase.execute(user.userIdentifier, user.email);
  }
}
