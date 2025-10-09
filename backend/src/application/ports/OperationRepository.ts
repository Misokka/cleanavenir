import { Result } from "../../shared/Result";
import { OperationDTO } from "../dtos/OperationDTO";

import { OperationNotFoundError } from "../../domain/errors/OperationNotFoundError";
import { InsufficientFundsError } from "../../domain/errors/InsufficientFundsError";
import { AccountNotFoundError } from "../../domain/errors/AccountNotFoundError";

export interface OperationRepository {
    createCredit (input: {
        AccountId: string;
        amount: number;
        currency: string;
        label: string;
    }): Promise<Result<OperationDTO, AccountNotFoundError>>;

    createDebit (input: {
        AccountId: string;
        amount: number;
        currency: string;
        label: string;
    }): Promise<Result<OperationDTO, AccountNotFoundError | InsufficientFundsError>>;
    
    findById (id: string): Promise<Result<OperationDTO, OperationNotFoundError>>; 
    
    listByAccountId (params: {
        AccountId: string;
        limit?: number;
        offset?: number;
    }): Promise<Result<OperationDTO[], AccountNotFoundError>>;

    


}