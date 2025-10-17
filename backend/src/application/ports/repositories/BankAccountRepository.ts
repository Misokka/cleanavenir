import { Result } from "../../../shared/Result";

import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";
import { BankAccount } from "../../../domain/entities/BankAccount";

export interface BankAccountRepository {
    save(bankAccount: BankAccount): Promise<Result<BankAccount, BankAccountNotFoundError>>;
    findById(accountIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError>>;
    findDefaultAccountByClientId(clientIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError>>;
    rename(accountIdentifier: string, label: string): Promise<Result<BankAccount, BankAccountNotFoundError>>;
    remove(accountIdentifier: string): Promise<Result<true, BankAccountNotFoundError>>;
}