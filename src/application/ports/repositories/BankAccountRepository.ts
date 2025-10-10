import { Result } from "../../../shared/Result";

import { BankAccountNotFoundError } from "../../../domain/errors/AccountNotFoundError";
import { BankAccount } from "../../../domain/entities/BankAccount";

export interface BankAccountRepository {
    save(bankAccount: BankAccount): Promise<Result<BankAccount, BankAccountNotFoundError>>;
    findById(iban: string): Promise<Result<BankAccount, BankAccountNotFoundError>>;
    rename(iban: string, label: string): Promise<Result<BankAccount, BankAccountNotFoundError>>;
    remove(iban: string): Promise<Result<true, BankAccountNotFoundError>>;
}