import { BankAccountNotFoundError } from "../../../../domain/errors/AccountNotFoundError";
import { Result } from "../../../../shared/Result";
import { OperationRepository } from "../../../ports/repositories/OperationRepository";


export type CreateCreditInput = {
  AccountId: string;
  amount: number;    
  currency: string;  
  label: string;
};

export class CreateCreditUseCase {
  constructor(private readonly ops: OperationRepository) {}

  async execute(input: CreateCreditInput): Promise<Result<true, BankAccountNotFoundError | Error>> {
    if (input.amount <= 0) {
      return { ok: false, error: new Error("Amount must be > 0") };
    }
    if (!input.currency) {
      return { ok: false, error: new Error("Currency is required") };
    }

    const created = await this.ops.createCredit({
      AccountId: input.AccountId,
      amount: input.amount,
      currency: input.currency,
      label: input.label || "CREDIT",
    });
    if (!created.ok) return created;

    return { ok: true, value: true };
  }
}