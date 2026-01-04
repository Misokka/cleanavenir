import { BankAccount } from "../../../../domain/entities/BankAccount";
import { err, ok, Result } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";

export interface RenameBankAccountByDirectorInput {
  accountId: string;
  newName: string;
}

/**
 * Use case pour le Director: renommer n'importe quel compte bancaire
 * À la différence du use case client, pas de vérification d'ownership
 */
export class RenameBankAccountByDirectorUseCase {
  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ) {}

  public async execute(input: RenameBankAccountByDirectorInput): Promise<Result<BankAccount, Error>> {
    if (!input.newName || input.newName.trim().length === 0) {
      return err(new Error('Le nouveau nom est requis'));
    }

    if (input.newName.trim().length < 3) {
      return err(new Error('Le nom doit contenir au moins 3 caractères'));
    }

    const maybeBankAccount = await this.bankAccountRepository.findById(input.accountId);

    if (!maybeBankAccount.ok) {
      return err(new Error('Compte introuvable'));
    }

    const bankAccount = maybeBankAccount.value;

    // Vérifier les doublons de nom pour le propriétaire du compte
    const existingAccounts = await this.bankAccountRepository.findByOwner(bankAccount.clientIdentifier);
    
    if (existingAccounts.ok) {
      const duplicateName = existingAccounts.value.some(
        (account) => 
          account.accountIdentifier !== input.accountId && 
          account.label.toLowerCase() === input.newName.trim().toLowerCase()
      );

      if (duplicateName) {
        return err(new Error('Un compte avec ce nom existe déjà pour ce client'));
      }
    }

    const result = await this.bankAccountRepository.rename(input.accountId, input.newName.trim());

    if (!result.ok) {
      return err(new Error('Erreur lors du renommage du compte'));
    }

    return ok(result.value);
  }
}
