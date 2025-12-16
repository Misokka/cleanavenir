import { Result } from "../../../shared/Result";
import { OperationDTO } from "../../dtos/OperationDTO";

import { OperationNotFoundError } from "../../../domain/errors/OperationNotFoundError";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";
import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";

export interface OperationFilters {
  type?: string[]; // ['CREDIT', 'DEBIT', 'TRANSFER', 'INTEREST']
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
  amountMin?: number; // en centimes
  amountMax?: number; // en centimes
  accountId?: string; // filtrer par compte spécifique
}

export interface OperationRepository {
    createCredit (input: {
        AccountId: string;
        amount: number;
        currency: string;
        label: string;
    }): Promise<Result<OperationDTO, BankAccountNotFoundError>>;

    createDebit (input: {
        AccountId: string;
        amount: number;
        currency: string;
        label: string;
    }): Promise<Result<OperationDTO, BankAccountNotFoundError | InsufficientFundsError>>;
    
    findById (id: string): Promise<Result<OperationDTO, OperationNotFoundError>>; 
    
    listByAccountId (params: {
        AccountId: string;
        limit?: number;
        offset?: number;
    }): Promise<Result<OperationDTO[], BankAccountNotFoundError>>;

    listWithFilters(accountIds: string[], filters: OperationFilters): Promise<Result<any[], Error>>;
    listRecentForUser(userAccountIds: string[], limit: number): Promise<Result<any[], Error>>;
    listForAccount(accountIdentifier: string): Promise<Result<any[], Error>>;
}