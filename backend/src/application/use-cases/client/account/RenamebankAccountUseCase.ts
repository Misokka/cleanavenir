import { BankAccount } from "../../../../domain/entities/BankAccount";
import { err, ok, Result } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";

export interface RenameAccountInput {
  accountId: string;
  newName: string;
  userId: string;
}

export class RenameBankAccountUseCase {
  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ) {}

  public async execute(input: RenameAccountInput): Promise<Result<BankAccount, Error>> {
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

    if (bankAccount.clientIdentifier !== input.userId) {
      return err(new Error('Accès non autorisé à ce compte'));
    }

    const existingAccounts = await this.bankAccountRepository.findByOwner(input.userId);
    
    if (existingAccounts.ok) {
      const duplicateName = existingAccounts.value.some(
        (account: any) => 
          account.id !== input.accountId && 
          account.name.toLowerCase() === input.newName.trim().toLowerCase()
      );

      if (duplicateName) {
        return err(new Error('Un compte avec ce nom existe déjà'));
      }
    }

    const result = await this.bankAccountRepository.rename(input.accountId, input.newName.trim());

    if (!result.ok) {
      return err(new Error('Erreur lors du renommage du compte'));
    }

    return ok(result.value);
  }
}