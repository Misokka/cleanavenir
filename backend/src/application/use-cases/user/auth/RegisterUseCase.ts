import { randomUUID } from "crypto";
import { User } from "../../../../domain/entities/User";
import { PasswordDoNotMatchError } from "../../../../domain/errors/PasswordDoNotMatchError";
import { UserRole } from "../../../dtos/UserDTO";
import { UserRepository } from "../../../ports/repositories/UserRepository";
import { err, ok } from "../../../../shared/Result";
import { EmailAlreadyUsedError } from "../../../../domain/errors/EmailAlreadyUsedError";
import { PasswordHasher } from "../../../ports/services/PasswordHasher";
import { ProfileManager } from "../../../ports/services/ProfileFetcher";


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
  ){

    if(password !== confirmation){
      throw new PasswordDoNotMatchError("Passwords don't match");
    }

    const userIdentifier = randomUUID()
    const existingUser = await this.userRepository.findByEmail(email);
    
    
    if(existingUser.ok){
      return err(new EmailAlreadyUsedError(email))
    }
    
    const hashedPassword = await this.passwordHasher.hash(password);
    const newUser = new User(userIdentifier, firstname, lastname, email, hashedPassword, role);

    this.userRepository.save(newUser);
    const newProfile = await this.profileManager.create(newUser.userIndentifier, newUser.role);

    return ok(newProfile);
  }
}