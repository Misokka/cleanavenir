import { err, ok, Result } from "../../../../shared/Result";
import { BankAccountRepositoryDrizzle } from "../../../../infrastructure/repositories/drizzle/BankAccountRepositoryDrizzle";

export interface DeleteAccountInput {
  accountId: string;
  userId: string;
}

export class DeleteBankAccountUseCase {
  constructor(
    private readonly bankAccountRepository: BankAccountRepositoryDrizzle
  ) {}

  public async execute(input: DeleteAccountInput): Promise<Result<true, Error>> {
    // Vérifier que le compte existe
    const bankAccount = await this.bankAccountRepository.findById(input.accountId);
    
    if (!bankAccount.ok) {
      return err(new Error('Compte introuvable'));
    }

    if (bankAccount.value.ownerId !== input.userId) {
      return err(new Error('Accès non autorisé à ce compte'));
    }

    if (bankAccount.value.balance !== 0) {
      return err(new Error('Impossible de supprimer un compte avec un solde non nul'));
    }

    const deletedBankAccount = await this.bankAccountRepository.delete(input.accountId);
    
    if (!deletedBankAccount.ok) {
      return err(new Error('Erreur lors de la suppression du compte'));
    }

    return ok(true);
  }
}