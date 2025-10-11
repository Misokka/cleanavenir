import { BankAccount } from "../../../../domain/entities/BankAccount";
import { Client } from "../../../../domain/entities/Client";
import { Iban } from "../../../../domain/value-objects/Iban";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";

export class CreateBankAccount{
  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ){}

  public execute(ibanValue: string, client: Client){
    const newIban = Iban.from(ibanValue)

    if(!newIban.ok){
      throw newIban.error
    }

    const newBankAccount = new BankAccount(newIban.value, client);
    this.bankAccountRepository.save(newBankAccount);
  }
}