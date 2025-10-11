import { Result } from "../../../../shared/Result";
import { OperationRepository } from "../../../ports/repositories/OperationRepository";
import { InsufficientFundsError } from "../../../../domain/errors/InsufficientFundsError";
import { BankAccountNotFoundError } from "../../../../domain/errors/AccountNotFoundError";

export type CreateDebitInput = {
  AccountId: string;
  amount: number;    
  currency: string; 
  label: string;
};

export class CreateDebit {
  constructor(private readonly ops: OperationRepository) {}

  async execute(input: CreateDebitInput): Promise<Result<true, BankAccountNotFoundError | InsufficientFundsError | Error>> {
    if (input.amount <= 0) {
      return { ok: false, error: new Error("Amount must be > 0") };
    }
    if (!input.currency) {
      return { ok: false, error: new Error("Currency is required") };
    }

    const created = await this.ops.createDebit({
      AccountId: input.AccountId,
      amount: input.amount,
      currency: input.currency,
      label: input.label || "DEBIT",
    });
    if (!created.ok) return created;

    return { ok: true, value: true };
  }
}