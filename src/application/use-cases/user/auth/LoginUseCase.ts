import { InvalidCredentialsError } from "../../../../domain/errors/InvalidCredentialsError";
import { MissingCredentialsError } from "../../../../domain/errors/MissingCredentialsError";
import { err, ok } from "../../../../shared/Result";
import { UserRepository } from "../../../ports/repositories/UserRepository";
import { PasswordHasher } from "../../../ports/services/PasswordHasher";
import { ProfileManager } from "../../../ports/services/ProfileFetcher";

type loginDto = {
  email: string,
  password: string
}
export class LoginUseCase{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly profileManager: ProfileManager,
  ){}

  async execute({email, password}: loginDto){
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

    const profile = await this.profileManager.fetch(user.value.userIndentifier, user.value.role);

    if(!profile.ok){
      return profile.error
    }

    return ok(profile.value);
  }
}