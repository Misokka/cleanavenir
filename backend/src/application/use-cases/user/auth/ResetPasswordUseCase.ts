import { err, ok, Result } from "../../../../shared/Result";
import { UserRepository } from "../../../ports/repositories/UserRepository";
import { PasswordHasher } from "../../../ports/services/PasswordHasher";

type ResetPasswordDto = {
  email: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute({ email, newPassword }: ResetPasswordDto): Promise<Result<boolean, Error>> {
    if (!email || email.length < 1) {
      return err(new Error("Email is required"));
    }

    if (!newPassword || newPassword.length < 8) {
      return err(new Error("Password must be at least 8 characters long"));
    }

    const userResult = await this.userRepository.findByEmail(email);

    if (!userResult.ok) {
      return err(new Error("User not found"));
    }

    const user = userResult.value;

    // Hash the new password
    const hashedPassword = await this.passwordHasher.hash(newPassword);

    // Update user password
    user.password = hashedPassword;

    const updateResult = await this.userRepository.update(user);

    if (!updateResult.ok) {
      return err(new Error("Failed to update password"));
    }

    return ok(true);
  }
}
