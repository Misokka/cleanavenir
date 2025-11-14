import { OperationDTO } from "../../../application/dtos/OperationDTO";
import { OperationRepository } from "../../../application/ports/repositories/OperationRepository";
import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";
import { OperationNotFoundError } from "../../../domain/errors/OperationNotFoundError";
import Result from "../../../shared/Result";

export class PrismaOpereationRepository implements OperationRepository {
  createCredit(input: { AccountId: string; amount: number; currency: string; label: string; }): Promise<Result<OperationDTO, BankAccountNotFoundError>> {
    
  }
  
  createDebit(input: { AccountId: string; amount: number; currency: string; label: string; }): Promise<Result<OperationDTO, BankAccountNotFoundError | InsufficientFundsError>> {
      
  }

  findById(id: string): Promise<Result<OperationDTO, OperationNotFoundError>> {
      
  }

  listByAccountId(params: { AccountId: string; limit?: number; offset?: number; }): Promise<Result<OperationDTO[], BankAccountNotFoundError>> {
      
  }
}