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
  date: Date
}
export class PrismaTransactionMapper implements Mapper<PrismaTransaction, Transaction, TransactionToPersist>{
  toDomain(raw: PrismaTransaction): Transaction {
    return new Transaction(
      raw.transactionIdentifier,
      raw.bankAccountIdentifier,
      raw.amount,
      raw.direction as TransactionDirection,
      raw.type as TransactionType,
      raw.description,
      raw.date
    )
  }

  toPersistence(obj: Transaction): TransactionToPersist {
    return {
      ...obj,
      direction: obj.direction as $Enums.TransactionDirection,
      type: obj.type as $Enums.TransactionType
    }
  }
}