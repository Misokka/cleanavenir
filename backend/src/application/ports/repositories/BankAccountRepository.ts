import { Result } from "../../../shared/Result";

import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";
import { BankAccount } from "../../../domain/entities/BankAccount";
import { UnexpectedBankAccountError } from "../../../domain/errors/UnexpectedBankAccountError";

export interface BankAccountRepository {
    save(bankAccount: BankAccount): Promise<Result<BankAccount, Error>>;
    findById(accountIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError | UnexpectedBankAccountError>>;
    findDefaultAccountByClientId(clientIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError | UnexpectedBankAccountError>>;
    getSystemBankAccount(): Promise<Result<BankAccount, Error>>
    findByOwner(clientIdentifier: string): Promise<Result<BankAccount[], UnexpectedBankAccountError>>;
    findByIban(iban: string): Promise<Result<BankAccount, BankAccountNotFoundError | UnexpectedBankAccountError>>;
    all(): Promise<Result<BankAccount[], Error>>;
    updateBalance(accountIdentifier: string, newBalance: number): Promise<Result<number, BankAccountNotFoundError | UnexpectedBankAccountError>>;
    rename(accountIdentifier: string, label: string): Promise<Result<BankAccount, BankAccountNotFoundError | UnexpectedBankAccountError>>;
    remove(accountIdentifier: string): Promise<Result<true, BankAccountNotFoundError | UnexpectedBankAccountError>>;
    delete(accountIdentifier: string): Promise<Result<boolean, Error>>;
}