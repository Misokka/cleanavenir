import { BankAccountNotFoundError } from "../../../../domain/errors/BankAccountNotFoundError";
import { CouldNotDeleteBankAccountError } from "../../../../domain/errors/CouldNotDeleteBankAccountError";
import { err, ok } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";

export class DeleteBankAccountUseCase{
  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ){}

  public async execute(accountIdentifier: string){
    const bankAccount = await this.bankAccountRepository.findById(accountIdentifier);
    if(!bankAccount.ok){
      return err(new BankAccountNotFoundError(accountIdentifier));
    }

    const deletedBankAccount = await this.bankAccountRepository.remove(accountIdentifier);
    if(!deletedBankAccount.ok){
      return err(new CouldNotDeleteBankAccountError(accountIdentifier))
    }

    return ok(deletedBankAccount.value);

  }
}