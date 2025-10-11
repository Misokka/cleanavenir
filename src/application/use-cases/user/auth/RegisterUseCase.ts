import { randomUUID } from "crypto";
import { User } from "../../../../domain/entities/User";
import { PasswordDoNotMatchError } from "../../../../domain/errors/PasswordDoNotMatchError";
import { UserRole } from "../../../dtos/UserDTO";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { UserRepository } from "../../../ports/repositories/UserRepository";
import { err } from "../../../../shared/Result";
import { EmailAlreadyUsedError } from "../../../../domain/errors/EmailAlreadyUsedError";
import { Client } from "../../../../domain/entities/Client";

export class RegisterUseCase{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
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
    const newUser = new User(userIdentifier, firstname, lastname, email, password, role);
    const existingUser = await this.userRepository.findByEmail(newUser.email);

    if(existingUser.ok){
      return err(new EmailAlreadyUsedError(newUser.email))
    }

    this.userRepository.save(newUser);
    const newClient = new Client(newUser.userIndentifier);

    switch(role){
      case "CLIENT":
        this.clientRepository.save(newClient);

    }
  }
}