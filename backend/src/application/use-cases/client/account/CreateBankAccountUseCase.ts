import { randomUUID } from "crypto";
import { BankAccount } from "../../../../domain/entities/BankAccount";
import { Iban } from "../../../../domain/value-objects/Iban";
import { err } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";

export class CreateBankAccountUseCase{
  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ){}

  public async execute(clientIdentifier: string, ibanValue: string, label: string, balance: number){
    const newIban = Iban.from(ibanValue)

    if(!newIban.ok){
      return err(newIban.error)
    }

    const accountIdentifier = randomUUID();
    const newBankAccount = new BankAccount(accountIdentifier, clientIdentifier, newIban.value, label, balance);
    await this.bankAccountRepository.save(newBankAccount);
  }
}