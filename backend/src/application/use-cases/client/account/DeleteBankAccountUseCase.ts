import { err, ok, Result } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";

export interface DeleteAccountInput {
  accountId: string;
  userId: string;
}

export class DeleteBankAccountUseCase {
  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly clientRepository: ClientRepository,
  ) {}

  public async execute(input: DeleteAccountInput): Promise<Result<true, Error>> {

    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if(!clientResult.ok){
      return err(clientResult.error);
    }

    const client = clientResult.value;
    // Vérifier que le compte existe
    const bankAccount = await this.bankAccountRepository.findById(input.accountId);
    
    if (!bankAccount.ok) {
      return err(new Error('Compte introuvable'));
    }

    if (bankAccount.value.clientIdentifier !== client.clientIdentifier) {
      return err(new Error('Accès non autorisé à ce compte'));
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