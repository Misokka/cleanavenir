import { randomUUID } from "node:crypto";
import { err, ok, Result } from "../../../../shared/Result";
import { IbanGenerator } from "../../../../infrastructure/adapters/IbanGenerator";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";

export interface CreateBankAccountInput {
  ownerId: string;
  name: string;
}

export class CreateBankAccountUseCase {
  private readonly ibanGenerator: IbanGenerator;

  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ) {
    this.ibanGenerator = new IbanGenerator();
  }

  public async execute(input: CreateBankAccountInput): Promise<Result<any, Error>> {
    if (!input.name || input.name.trim().length === 0) {
      return err(new Error('Le nom du compte est requis'));
    }

    if (input.name.trim().length < 3) {
      return err(new Error('Le nom du compte doit contenir au moins 3 caractères'));
    }

    const existingAccounts = await this.bankAccountRepository.findByOwner(input.ownerId);
    
    if (existingAccounts.ok) {
      const duplicateName = existingAccounts.value.some(
        (account: any) => account.name.toLowerCase() === input.name.trim().toLowerCase()
      );

      if (duplicateName) {
        return err(new Error('Un compte avec ce nom existe déjà'));
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

    const accountId = randomUUID();
    const createResult = await this.bankAccountRepository.create({
      id: accountId,
      iban: finalIban,
      name: input.name.trim(),
      ownerId: input.ownerId,
      balance: 0,
    });

    if (!createResult.ok) {
      return err(new Error('Erreur lors de la création du compte'));
    }

    return ok({
      id: accountId,
      iban: finalIban,
      label: input.name.trim(),
      ownerId: input.ownerId,
      balance: 0,
      currency: 'EUR',
    });
  }
}