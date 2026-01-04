import { randomUUID } from "node:crypto";
import { err, ok, Result } from "../../../../shared/Result";
import { IbanGenerator } from "../../../../infrastructure/adapters/IbanGenerator";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { BankAccount } from "../../../../domain/entities/BankAccount";
import { Iban } from "../../../../domain/value-objects/Iban";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";

export interface CreateBankAccountForClientInput {
  targetUserId: string;
  name: string;
}


export class CreateBankAccountForClientUseCase {
  private readonly ibanGenerator: IbanGenerator;

  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly clientRepository: ClientRepository,
  ) {
    this.ibanGenerator = new IbanGenerator();
  }

  public async execute(input: CreateBankAccountForClientInput): Promise<Result<BankAccount, Error>> {
    if (!input.name || input.name.trim().length === 0) {
      return err(new Error('Le nom du compte est requis'));
    }

    if (input.name.trim().length < 3) {
      return err(new Error('Le nom du compte doit contenir au moins 3 caractères'));
    }
    const clientResult = await this.clientRepository.findByUserId(input.targetUserId);

    if(!clientResult.ok){
      return err(new Error('Client introuvable'));
    }
    const client = clientResult.value;
    const existingAccounts = await this.bankAccountRepository.findByOwner(client.clientIdentifier);
    
    if (existingAccounts.ok) {
      const duplicateName = existingAccounts.value.some(
        (account) => account.label.toLowerCase() === input.name.trim().toLowerCase()
      );

      if (duplicateName) {
        return err(new Error('Un compte avec ce nom existe déjà pour ce client'));
      }
    }
    const generatedIban = this.ibanGenerator.generate();

    let finalIban = generatedIban;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const ibanCheck = await this.bankAccountRepository.findByIban(finalIban);
      if (!ibanCheck.ok) {
        break;
      }
      finalIban = this.ibanGenerator.generate();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return err(new Error('Impossible de générer un IBAN unique'));
    }

    const finalIbanResult = Iban.from(finalIban);
    if (!finalIbanResult.ok) {
      return err(new Error('IBAN généré invalide'));
    }
    const finalIbanObject = finalIbanResult.value;

    const accountId = randomUUID();

    const newBankAccount = BankAccount.create({
      accountIdentifier: accountId,
      clientIdentifier: client.clientIdentifier,
      iban: finalIbanObject,
      label: input.name.trim(),
      balance: 0
    });
    
    const createResult = await this.bankAccountRepository.save(newBankAccount);

    if (!createResult.ok) {
      return err(createResult.error)
    }

    return ok(createResult.value);
  }
}
