import { Result } from "../../shared/Result";
import { OperationDTO } from "../dtos/OperationDTO";
import { CompteNotFoundError } from "../../domain/errors/CompteNotFoundError";
import { OperationNotFoundError } from "../../domain/errors/OperationNotFoundError";
import { InsufficientFundsError } from "../../domain/errors/InsufficientFundsError";

export interface OperationRepository {
    createCredit (input: {
        compteId: string;
        amount: number;
        currency: string;
        label: string;
    }): Promise<Result<OperationDTO, CompteNotFoundError>>;

    createDebit (input: {
        compteId: string;
        amount: number;
        currency: string;
        label: string;
    }): Promise<Result<OperationDTO, CompteNotFoundError | InsufficientFundsError>>;
    
    findById (id: string): Promise<Result<OperationDTO, OperationNotFoundError>>; 
    
    listByCompteId (params: {
        compteId: string;
        limit?: number;
        offset?: number;
    }): Promise<Result<OperationDTO[], CompteNotFoundError>>;

    


}