import { $Enums, PrismaClient } from "@prisma/client";
import { TransactionRepository } from "../../../application/ports/repositories/TransactionRepository";
import { Transaction, TransactionDirection, TransactionType } from "../../../domain/entities/Transaction";
import Result, { err, ok } from "../../../shared/Result";

export class PrismaTransactionRepository implements TransactionRepository {
  constructor(
    private prismaClient: PrismaClient
  ){}

  async save(transaction: Transaction): Promise<Result<Transaction, Error>> {
    try{
      const registeredTransaction = await this.prismaClient.transaction.create({
      data: {
        transctionIdentifier: transaction.transactionIdentifier,
          bankAccountIdentifier: transaction.bankAccountIdentifier,
          direction: transaction.direction as $Enums.TransactionDirection,
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type as $Enums.TransactionType,
          date: transaction.date
        }
      });

      const newTransaction = new Transaction(
        registeredTransaction.transctionIdentifier,
        registeredTransaction.bankAccountIdentifier,
        registeredTransaction.amount,
        registeredTransaction.direction as TransactionDirection,
        registeredTransaction.type as TransactionType,
        registeredTransaction.description,
        registeredTransaction.date
      )

      return ok(newTransaction)
    } catch (error) {
      return err(new Error(`An error occured when saving this transaction ${transaction.transactionIdentifier}.`))
    }
  }

  async saveAll(transactions: Transaction[]): Promise<Result<boolean, Error>> {
    for (const transaction of transactions){
      try{
        const currentTransaction = await this.save(transaction);
        if(!currentTransaction.ok){
          return err(currentTransaction.error);
        }
      } catch (error){
        return err(new Error(`An error occured when saving this transaction ${transaction.transactionIdentifier}`))
      }
    }

    return ok(true);
  }

  async all(): Promise<Result<Transaction[], Error>> {
    try{
      const transactions = await this.prismaClient.transaction.findMany();
      transactions.map(transaction => {
        transaction = new Transaction(
          transaction.transactionIdentifier, 
          transaction.bankAccountIdentifier, 
          transaction.amount,
          transaction.type as TransactionType,
          transaction.direction as TransactionDirection,
          transaction.description,
          transaction.date
        )
      })
      return ok(transactions as Transaction[]);
    } catch (error) {
      return err(new Error("An error occured when retrieving a transaction"))
    }
  }

  async findById(transactionIdentifier: string): Promise<Result<Transaction, Error>> {
      
  }
}