import { err, ok, Result } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";

export interface DeleteBankAccountByDirectorInput {
  accountId: string;
}

export class DeleteBankAccountByDirectorUseCase {
  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
  ) {}

  public async execute(input: DeleteBankAccountByDirectorInput): Promise<Result<true, Error>> {
    const bankAccount = await this.bankAccountRepository.findById(input.accountId);
    
    if (!bankAccount.ok) {
      return err(new Error('Compte introuvable'));
    }

    if (bankAccount.value.balance !== 0) {
      return err(new Error('Impossible de supprimer un compte avec un solde non nul'));
    }

    const deletedBankAccount = await this.bankAccountRepository.remove(input.accountId);
    
    if (!deletedBankAccount.ok) {
      return err(new Error('Erreur lors de la suppression du compte'));
    }

    return ok(true);
  }
}
