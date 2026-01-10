import { Mapper } from "../MapperInterface";
import { $Enums, Transaction as PrismaTransaction } from "@prisma/client";
import { Transaction, TransactionDirection, TransactionType } from "../../../../domain/entities/Transaction";

type TransactionToPersist = {
  transactionIdentifier: string,
  bankAccountIdentifier: string,
  amount: number,
  direction: $Enums.TransactionDirection,
  type: $Enums.TransactionType,
  description: string,
  currency: string,
  createdAt: Date,
  fromAccountIdentifier?: string,
  toAccountIdentifier?: string,
  toSavingAccountIdentifier?: string,
}
export class PrismaTransactionMapper implements Mapper<PrismaTransaction, Transaction, TransactionToPersist>{
  toDomain(raw: PrismaTransaction): Transaction {
    return Transaction.create({
      ...raw,
      fromAccountIdentifier: raw.fromAccountIdentifier as string | undefined,
      toAccountIdentifier: raw.toAccountIdentifier as string | undefined,
      toSavingAccountIdentifier: raw.toSavingAccountIdentifier as string | undefined
    })
  }

  toPersistence(obj: Transaction): TransactionToPersist {
    return {
      ...obj,
      direction: obj.direction as $Enums.TransactionDirection,
      type: obj.type as $Enums.TransactionType
    }
  }
}