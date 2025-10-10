import { Result } from "../../../shared/Result";
import { OperationRepository } from "../../ports/OperationRepository";
import { CompteNotFoundError } from "../../../domain/errors/CompteNotFoundError";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";

export type CreateDebitInput = {
  compteId: string;
  amount: number;    
  currency: string; 
  label: string;
};

export class CreateDebit {
  constructor(private readonly ops: OperationRepository) {}

  async execute(input: CreateDebitInput): Promise<Result<true, CompteNotFoundError | InsufficientFundsError | Error>> {
    if (input.amount <= 0) {
      return { ok: false, error: new Error("Amount must be > 0") };
    }
    if (!input.currency) {
      return { ok: false, error: new Error("Currency is required") };
    }

    const created = await this.ops.createDebit({
      compteId: input.compteId,
      amount: input.amount,
      currency: input.currency,
      label: input.label || "DEBIT",
    });
    if (!created.ok) return created;

    return { ok: true, value: true };
  }
}