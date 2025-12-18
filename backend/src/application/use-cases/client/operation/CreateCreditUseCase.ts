import { randomUUID } from "crypto";
import { Transaction } from "../../../../domain/entities/Transaction";
import { BankAccountNotFoundError } from "../../../../domain/errors/BankAccountNotFoundError";
import { ok, Result } from "../../../../shared/Result";
import { TransactionRepository } from "../../../ports/repositories/TransactionRepository";


export type CreateCreditInput = {
  AccountId: string;
  amount: number;    
  currency: string;  
  label: string;
};

export class CreateCreditUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: CreateCreditInput): Promise<Result<Transaction, BankAccountNotFoundError | Error>> {
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
      direction: "CREDIT",
      type: "TRANSFER",
      description: input.label || "CREDIT",
    })

    // const created = await this.transactionRepository.createCredit({
    //   AccountId: input.AccountId,
    //   amount: input.amount,
    //   currency: input.currency,
    //   label: input.label || "CREDIT",
    // });

    const created =  await this.transactionRepository.save(creditTransaction);
    if (!created.ok) return created;

    return ok(created.value);
  }
}