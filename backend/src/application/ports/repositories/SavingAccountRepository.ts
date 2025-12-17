import { Result } from "../../../shared/Result";
import { SavingBankAccountNotFoundError } from "../../../domain/errors/SavingAccountNotFoundError";
import { SavingAccount } from "../../../domain/entities/SavingAccount";

export interface SavingAccountRepository {
    save(savingAccount: SavingAccount): Promise<Result<SavingAccount, Error>>;
    saveAll(savingAccounts: SavingAccount[]): Promise<Result<SavingAccount[], Error>>
    all(): Promise<Result<SavingAccount[], Error>>;

    findById(accountId: string): Promise<
        Result<SavingAccount, SavingBankAccountNotFoundError>
    >;

    findByAccountIds(accountIds: string[]): Promise<Result<SavingAccount[], Error>>;
}