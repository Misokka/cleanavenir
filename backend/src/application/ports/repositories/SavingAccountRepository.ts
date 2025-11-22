import { Result } from "../../../shared/Result";
import { SavingAccountDTO } from "../../dtos/SavingAccountDTO";
import { SavingRateDTO } from "../../dtos/SavingRateDTO";
import { AlreadyHasSavingAccountError } from "../../../domain/errors/AlreadyHasSavingAccountError";
import { SavingRateNotSetError } from "../../../domain/errors/SavingRateNotSetError";
import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";
import { SavingBankAccountNotFoundError } from "../../../domain/errors/SavingAccountNotFoundError";
import { SavingAccount } from "../../../domain/entities/SavingAccount";

export interface SavingAccountRepository {
    save(savingAccount: SavingAccount): Promise<Result<SavingAccount, Error>>;
    saveAll(savingAccounts: SavingAccount[]): Promise<Result<SavingAccount[], Error>>
    all(): Promise<Result<SavingAccount[], Error>>;

    openForAccount(AccountId: string): Promise<
        Result<SavingAccountDTO, BankAccountNotFoundError | AlreadyHasSavingAccountError>
    >;

    findByAccountId(AccountId: string): Promise<
        Result<SavingAccountDTO, SavingBankAccountNotFoundError>
    >;

    setActive(AccountId: string, active: boolean): Promise<
        Result<SavingAccountDTO, SavingBankAccountNotFoundError>
    >;

    setGlobalRate(value: number): Promise<Result<SavingRateDTO, never>>;
    getGlobalRate(): Promise<Result<SavingRateDTO, SavingRateNotSetError>>;
}