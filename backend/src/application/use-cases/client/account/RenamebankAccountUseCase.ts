import { err, ok } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";

export class RenameBankAccountUseCase{
  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ){}

  public async exucute(accountIdentifier: string, label: string){
    const maybeBankAccount = await this.bankAccountRepository.findById(accountIdentifier);

    if(!maybeBankAccount.ok){
      return err(maybeBankAccount.error);
    }

    const bankAccount = maybeBankAccount.value;

    bankAccount.label = label;
    await this.bankAccountRepository.save(bankAccount);

    return ok(bankAccount);
  }
}