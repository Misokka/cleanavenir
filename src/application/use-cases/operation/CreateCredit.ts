import { Result } from "../../../shared/Result";
import { OperationRepository } from "../../ports/OperationRepository";
import { CompteNotFoundError } from "../../../domain/errors/CompteNotFoundError";

export type CreateCreditInput = {
  compteId: string;
  amount: number;    
  currency: string;  
  label: string;
};

export class CreateCredit {
  constructor(private readonly ops: OperationRepository) {}

  async execute(input: CreateCreditInput): Promise<Result<true, CompteNotFoundError | Error>> {
    if (input.amount <= 0) {
      return { ok: false, error: new Error("Amount must be > 0") };
    }
    if (!input.currency) {
      return { ok: false, error: new Error("Currency is required") };
    }

    const created = await this.ops.createCredit({
      compteId: input.compteId,
      amount: input.amount,
      currency: input.currency,
      label: input.label || "CREDIT",
    });
    if (!created.ok) return created;

    return { ok: true, value: true };
  }
}