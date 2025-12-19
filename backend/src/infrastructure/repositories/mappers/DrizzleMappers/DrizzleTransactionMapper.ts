import { Transaction, TransactionDirection, TransactionType } from "../../../../domain/entities/Transaction";
import { TransactionDrizzle, NewTransactionDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleTransactionMapper implements Mapper<TransactionDrizzle, Transaction, NewTransactionDrizzle> {
  toDomain(raw: TransactionDrizzle): Transaction {

    return {
      ...raw,
      transactionIdentifier: raw.id,
      bankAccountIdentifier: raw.accountId,
      direction: raw.direction as TransactionDirection,
      type: raw.type as TransactionType,
      currency: raw.currency,
      description: raw.description as string,
      createdAt: new Date(raw.createdAt),
      fromAccountIdentifier: raw.fromAccountId as string | undefined,
      toAccountIdentifier: raw.toAccountId as string | undefined,
      toSavingAccountIdentifier: raw.toSavingAccountId as string | undefined
    };
  }

  toPersistence(entity: Transaction): NewTransactionDrizzle {

    return {
      ...entity,
      id: entity.transactionIdentifier,
      accountId: entity.bankAccountIdentifier,
      createdAt: entity.createdAt.toISOString(),
      fromAccountId: entity.fromAccountIdentifier,
      toAccountId: entity.toAccountIdentifier,
      toSavingAccountId: entity.toSavingAccountIdentifier
    };
  }
}
