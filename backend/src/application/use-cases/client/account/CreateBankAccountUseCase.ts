import { randomUUID } from "crypto";
import { BankAccount } from "../../../../domain/entities/BankAccount";
import { Client } from "../../../../domain/entities/Client";
import { Iban } from "../../../../domain/value-objects/Iban";
import { err } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";

export class CreateBankAccountUseCase{
  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ){}

  public async execute(ibanValue: string, label: string, client: Client){
    const newIban = Iban.from(ibanValue)

    if(!newIban.ok){
      return err(newIban.error)
    }

    const accountIdentifier = randomUUID();
    const newBankAccount = new BankAccount(accountIdentifier, newIban.value, label, client);
    await this.bankAccountRepository.save(newBankAccount);
  }
}