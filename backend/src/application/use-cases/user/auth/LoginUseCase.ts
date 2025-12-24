import { InvalidCredentialsError } from "../../../../domain/errors/InvalidCredentialsError";
import { MissingCredentialsError } from "../../../../domain/errors/MissingCredentialsError";
import { err, ok, Result } from "../../../../shared/Result";
import { UserRepository } from "../../../ports/repositories/UserRepository";
import { PasswordHasher } from "../../../ports/services/PasswordHasher";
import { ProfileManager } from "../../../ports/services/ProfileFetcher";
import { User } from "../../../../domain/entities/User";
import { Client } from "../../../../domain/entities/Client";
import { Director } from "../../../../domain/entities/Director";
import { Advisor } from "../../../../domain/entities/Advisor";

type loginDto = {
  email: string,
  password: string
}

type LoginResult = {
  user: User;
  profile: Client | Director | Advisor;
}

export class LoginUseCase{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly profileManager: ProfileManager,
  ){}

  async execute({email, password}: loginDto): Promise<Result<LoginResult, Error>>{
    if(email.length < 1 || password.length < 1){
      return err(new MissingCredentialsError("Enter your email and your password."))
    }

    const user = await this.userRepository.findByEmail(email);

    if(!user.ok){
      return err(new InvalidCredentialsError("Invalid credentials."))
    }

    const passwordMatch = await this.passwordHasher.compare(password, user.value.password);
    if(!passwordMatch){
      return err(new InvalidCredentialsError("Invalid credentials."))
    }

    const profile = await this.profileManager.fetch(user.value.userIdentifier, user.value.role);

    if(!profile.ok){
      return err(profile.error)
    }

    return ok({
      user: user.value,
      profile: profile.value
    });
  }
}