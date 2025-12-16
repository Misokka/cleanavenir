import { Result } from "../../../../shared/Result";
import { TransactionRepository } from "../../../ports/repositories/TransactionRepository";
import { InsufficientFundsError } from "../../../../domain/errors/InsufficientFundsError";
import { BankAccountNotFoundError } from "../../../../domain/errors/BankAccountNotFoundError";
import { randomUUID } from "crypto";
import { Transaction } from "../../../../domain/entities/Transaction";

export type CreateDebitInput = {
  AccountId: string;
  amount: number;    
  currency: string; 
  label: string;
};

export class CreateDebitUseCase {
  constructor(private readonly transactionRepositiry: TransactionRepository) {}

  async execute(input: CreateDebitInput): Promise<Result<true, BankAccountNotFoundError | InsufficientFundsError | Error>> {
    if (input.amount <= 0) {
      return { ok: false, error: new Error("Amount must be > 0") };
    }
    if (!input.currency) {
      return { ok: false, error: new Error("Currency is required") };
    }

    const transactionIdentifier = randomUUID();
    const creditTransaction = Transaction.create({
      transactionIdentifier,
      bankAccountIdentifier: input.AccountId,
      amount: input.amount,
      currency: input.currency,
      direction: "DEBIT",
      type: "TRANSFER",
      description: input.label || "DEBIT",
    })

    // const created = await this.transactionRepositiry.createDebit({
    //   AccountId: input.AccountId,
    //   amount: input.amount,
    //   currency: input.currency,
    //   label: input.label || "DEBIT",
    // });

    const created =  await this.transactionRepositiry.save(creditTransaction);
    if (!created.ok) return created;

    return { ok: true, value: true };
  }
}