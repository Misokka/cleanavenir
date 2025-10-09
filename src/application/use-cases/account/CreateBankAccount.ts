import { BankAccount } from "../../../domain/entities/BankAccount";
import { Result } from "../../../shared/Result";
import { BankAccountRepository } from "../../ports/repositories/BankAccountRepository";

export class CreateBankAccount{
  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ){}

  public execute(){
    
  }
}