import { User } from "../../../../domain/entities/User";
import { UserRepository } from "../../../ports/repositories/UserRepository";
import { err, ok, Result } from "../../../../shared/Result";
import { EmailAlreadyUsedError } from "../../../../domain/errors/EmailAlreadyUsedError";
import { PasswordHasher } from "../../../ports/services/PasswordHasher";

type UpdateClientInput = {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export class UpdateClientByDirectorUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  public async execute(input: UpdateClientInput): Promise<Result<User, Error>> {
    
    const userResult = await this.userRepository.findById(input.userId);
    if (!userResult.ok) {
      return err(new Error("Utilisateur introuvable"));
    }

    const user = userResult.value;

    if (user.role !== "CLIENT") {
      return err(new Error("Seuls les comptes clients peuvent être modifiés via cette interface"));
    }

    if (input.email && input.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser.ok && existingUser.value.userIdentifier !== input.userId) {
        return err(new EmailAlreadyUsedError(input.email));
      }
    }
    const updatedUser = User.create({
      userIdentifier: user.userIdentifier,
      firstname: input.firstName ?? user.firstname,
      lastname: input.lastName ?? user.lastname,
      email: input.email ?? user.email,
      password: input.password 
        ? await this.passwordHasher.hash(input.password)
        : user.password,
      role: user.role,
      active: user.active,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt
    });

    const updatedResult = await this.userRepository.update(updatedUser);
    if (!updatedResult.ok) {
      return err(updatedResult.error);
    }

    return ok(updatedResult.value);
  }
}
