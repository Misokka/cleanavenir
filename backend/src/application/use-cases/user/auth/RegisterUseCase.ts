import { randomUUID } from "node:crypto";
import { User } from "../../../../domain/entities/User";
import { PasswordDoNotMatchError } from "../../../../domain/errors/PasswordDoNotMatchError";
import { UserRole } from "../../../dtos/UserDTO";
import { UserRepository } from "../../../ports/repositories/UserRepository";
import { err, ok, Result } from "../../../../shared/Result";
import { EmailAlreadyUsedError } from "../../../../domain/errors/EmailAlreadyUsedError";
import { PasswordHasher } from "../../../ports/services/PasswordHasher";
import { ProfileManager } from "../../../ports/services/ProfileFetcher";
import { Client } from "../../../../domain/entities/Client";
import { Director } from "../../../../domain/entities/Director";
import { Advisor } from "../../../../domain/entities/Advisor";

type RegisterResult = {
  user: User;
  profile: Client | Director | Advisor;
}

export class RegisterUseCase{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileManager: ProfileManager,
    private readonly passwordHasher: PasswordHasher
  ){}

  public async execute(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    confirmation: string,
    role: UserRole
  ): Promise<Result<RegisterResult, Error>>{

    if(password !== confirmation){
      return err(new PasswordDoNotMatchError("Passwords don't match"));
    }

    const userIdentifier = randomUUID()
    const existingUser = await this.userRepository.findByEmail(email);
    
    
    if(existingUser.ok){
      return err(new EmailAlreadyUsedError(email))
    }
    
    const hashedPassword = await this.passwordHasher.hash(password);
    const newUser = User.create({userIdentifier, firstname, lastname, email, password: hashedPassword, role});

    const savedUser = await this.userRepository.save(newUser);
    
    if(!savedUser.ok){
      return err(savedUser.error);
    }

    const newProfile = await this.profileManager.create(newUser.userIdentifier, newUser.role);

    if(!newProfile.ok){
      return err(newProfile.error);
    }

    return ok({
      user: savedUser.value,
      profile: newProfile.value
    });
  }
}