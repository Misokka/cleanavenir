import { BankAccount } from "../../../../domain/entities/BankAccount";
import { err, ok, Result } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";

export interface RenameAccountInput {
  accountId: string;
  newName: string;
  userId: string;
}

export class RenameBankAccountUseCase {
  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  public async execute(input: RenameAccountInput): Promise<Result<BankAccount, Error>> {
    if (!input.newName || input.newName.trim().length === 0) {
      return err(new Error('Le nouveau nom est requis'));
    }

    if (input.newName.trim().length < 3) {
      return err(new Error('Le nom doit contenir au moins 3 caractères'));
    }

    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(clientResult.error);
    }
    const client = clientResult.value;

    const maybeBankAccount = await this.bankAccountRepository.findById(input.accountId);

    if (!maybeBankAccount.ok) {
      return err(new Error('Compte introuvable'));
    }

    const bankAccount = maybeBankAccount.value;

    if (bankAccount.clientIdentifier !== client.clientIdentifier) {
      return err(new Error('Accès non autorisé à ce compte'));
    }

    const existingAccounts = await this.bankAccountRepository.findByOwner(client.clientIdentifier);
    
    if (existingAccounts.ok) {
      const duplicateName = existingAccounts.value.some(
        (account) => 
          account.accountIdentifier !== input.accountId && 
          account.label.toLowerCase() === input.newName.trim().toLowerCase()
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