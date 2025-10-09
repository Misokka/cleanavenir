import { Result } from "../../shared/Result";
import { AccountDTO } from "../dtos/AccountDTO";
import { AccountNotFoundError } from "../../domain/errors/AccountNotFoundError";

export interface AccountRepository {
    create(input: {label: string}): Promise<Result<AccountDTO, AccountNotFoundError>>;
    findById(id: string): Promise<Result<AccountDTO, AccountNotFoundError>>;
    rename(id: string, label: string): Promise<Result<AccountDTO, AccountNotFoundError>>;
    remove(id: string): Promise<Result<true, AccountNotFoundError>>;
}