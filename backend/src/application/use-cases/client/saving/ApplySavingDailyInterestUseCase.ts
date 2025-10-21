import { SavingAccount } from "../../../../domain/entities/SavingAccount";
import { Transaction } from "../../../../domain/entities/Transaction";
import { err, ok, Result } from "../../../../shared/Result";
import { SavingAccountRepository } from "../../../ports/repositories/SavingAccountRepository";
import { SavingProductRepository } from "../../../ports/repositories/SavingProductRepository";
import { TransactionRepository } from "../../../ports/repositories/TransactionRepository";

export class ApplySavingDailyInterestUseCase{
  constructor(
    private readonly savingProductRepository: SavingProductRepository,
    private readonly savingAccountRepository: SavingAccountRepository,
    private readonly transactionRepository: TransactionRepository,
  ){}

  public async execute(): Promise<Result<boolean, Error>>{
    const allSavingProducts = await this.savingProductRepository.all();
    if(!allSavingProducts.ok){
      return err(allSavingProducts.error);
    }

    const allSavingAccounts = await this.savingAccountRepository.all();
    if(!allSavingAccounts.ok){
      return err(allSavingAccounts.error);
    }

    const interestTransactions: Transaction[] = []
    const updatedSavingAccounts: SavingAccount[] = []

    for(const savingAccount of allSavingAccounts.value){
      const savingProduct = allSavingProducts.value.find(savingProduct => savingAccount.productIdentifier === savingProduct.savingProductIdentifier );
      const transaction = savingAccount.applyDailyInterest(savingProduct?.rate as number);
      if(transaction){
        interestTransactions.push(transaction);
        updatedSavingAccounts.push(savingAccount);
      }
    }

    const savedInterestTransactions = await this.transactionRepository.saveAll(interestTransactions);
    if(!savedInterestTransactions.ok){
      return err(savedInterestTransactions.error);
    }

    const savedUpdatedeSavingAccounts = await this.savingAccountRepository.saveAll(updatedSavingAccounts);
    if(!savedUpdatedeSavingAccounts.ok){
      return err(savedUpdatedeSavingAccounts.error);
    }

    return ok(true);
  }

}