import { randomUUID } from "node:crypto";
import { User } from "../../../../domain/entities/User";
import { UserRepository } from "../../../ports/repositories/UserRepository";
import { err, ok, Result } from "../../../../shared/Result";
import { EmailAlreadyUsedError } from "../../../../domain/errors/EmailAlreadyUsedError";
import { PasswordHasher } from "../../../ports/services/PasswordHasher";
import { ProfileManager } from "../../../ports/services/ProfileFetcher";
import { Client } from "../../../../domain/entities/Client";
import { AdvisorRepository } from "../../../ports/repositories/AdvisorRepository";

type CreateClientResult = {
  user: User;
  profile: Client;
}

export class CreateClientByDirectorUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly advisorRepository: AdvisorRepository,
    private readonly profileManager: ProfileManager,
    private readonly passwordHasher: PasswordHasher
  ) {}

  public async execute(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<Result<CreateClientResult, Error>> {
    
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser.ok) {
      return err(new EmailAlreadyUsedError(email));
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    const userIdentifier = randomUUID();
    const newUser = User.create({
      userIdentifier,
      firstname: firstName,
      lastname: lastName,
      email,
      password: hashedPassword,
      role: "CLIENT",
      createdAt: new Date()
    });

    const savedUser = await this.userRepository.save(newUser);
    if (!savedUser.ok) {
      return err(savedUser.error);
    }

    const randomAdvisorResult = await this.advisorRepository.findRandom();
    if (!randomAdvisorResult.ok) {
      return err(randomAdvisorResult.error);
    }

    const randomAdvisor = randomAdvisorResult.value;
    const newProfile = await this.profileManager.create(
      newUser.userIdentifier,
      "CLIENT",
      randomAdvisor.advisorIdentifier
    );

    if (!newProfile.ok) {
      return err(newProfile.error);
    }

    return ok({
      user: savedUser.value,
      profile: newProfile.value as Client
    });
  }
}
