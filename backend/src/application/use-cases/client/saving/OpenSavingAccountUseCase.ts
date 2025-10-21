import { err, ok, Result } from "../../../../shared/Result";
import { SavingAccountRepository } from "../../../ports/repositories/SavingAccountRepository";
import { SavingAccountDTO } from "../../../dtos/SavingAccountDTO";
import { AlreadyHasSavingAccountError } from "../../../../domain/errors/AlreadyHasSavingAccountError";
import { BankAccountNotFoundError } from "../../../../domain/errors/BankAccountNotFoundError";
import { SavingProductRepository } from "../../../ports/repositories/SavingProductRepository";
import { Iban } from "../../../../domain/value-objects/Iban";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { SavingAccount } from "../../../../domain/entities/SavingAccount";
import { randomUUID } from "crypto";

export class OpenSavingAccountUseCase {
  constructor(
    private readonly savingAccountRepository: SavingAccountRepository,
    private readonly savingProductRepository: SavingProductRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(
    clientIdentifier: string,
    productIdentifier: string,
    ibanValue: string,
    label: string,
    balance: number): Promise<Result<SavingAccount, Error>> {
    const client = await this.clientRepository.findById(clientIdentifier);
    if(!client.ok){
      return err(client.error);
    }

    const savingProduct = await this.savingProductRepository.findById(productIdentifier);
    if(!savingProduct.ok){
      return err(savingProduct.error);
    }

    const iban = Iban.from(ibanValue);
    if(!iban.ok){
      return err(iban.error);
    }

    const savingAccountIdentifier = randomUUID();
    const savingAccount = new SavingAccount(savingAccountIdentifier, clientIdentifier, productIdentifier, iban.value, label, balance)
    const saved = await this.savingAccountRepository.save(savingAccount);

    if(!saved.ok){
      return err(saved.error);
    }

    return ok(saved.value);

  }
}