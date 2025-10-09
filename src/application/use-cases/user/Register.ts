import { PasswordDoNotMatchError } from "../../../domain/errors/PasswordDoNotMatchError";
import { ClientRepository } from "../../ports/repositories/ClientRepository";
import { UserRepository } from "../../ports/repositories/UserRepository";

export class Register{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
  ){}

  public async execute(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    confirmation: string
  ){

    if(password !== confirmation){
      throw new PasswordDoNotMatchError("Passwords don't match");
    }

    
  }
}