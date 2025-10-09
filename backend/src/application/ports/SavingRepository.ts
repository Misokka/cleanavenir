import { Result } from "../../shared/Result";
import { SavingAccountDTO } from "../dtos/SavingAccountDTO";
import { SavingRateDTO } from "../dtos/SavingRateDTO";
import { AccountNotFoundError } from "../../domain/errors/AccountNotFoundError";
import { AlreadyHasSavingAccountError } from "../../domain/errors/AlreadyHasSavingAccountError";
import { SavingAccountNotFoundError } from "../../domain/errors/SavingAccountNotFoundError";
import { SavingRateNotSetError } from "../../domain/errors/SavingRateNotSetError";

export interface SavingRepository {
    openForAccount(AccountId: string): Promise<
        Result<SavingAccountDTO, AccountNotFoundError | AlreadyHasSavingAccountError>
    >;

    findByAccountId(AccountId: string): Promise<
        Result<SavingAccountDTO, SavingAccountNotFoundError>
    >;

    setActive(AccountId: string, active: boolean): Promise<
        Result<SavingAccountDTO, SavingAccountNotFoundError>
    >;

    setGlobalRate(value: number): Promise<Result<SavingRateDTO, never>>;
    getGlobalRate(): Promise<Result<SavingRateDTO, SavingRateNotSetError>>;
}