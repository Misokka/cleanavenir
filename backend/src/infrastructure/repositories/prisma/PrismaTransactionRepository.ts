import { $Enums, PrismaClient } from "@prisma/client";
import { TransactionRepository } from "../../../application/ports/repositories/TransactionRepository";
import { Transaction, TransactionDirection, TransactionType } from "../../../domain/entities/Transaction";
import Result, { err, ok } from "../../../shared/Result";
import { TransactionNotFoundError } from "../../../domain/errors/TransactionNotFoundError";

export class PrismaTransactionRepository implements TransactionRepository {
  constructor(
    private prismaClient: PrismaClient
  ){}

  async save(transaction: Transaction): Promise<Result<Transaction, Error>> {
    try{
      const registeredTransaction = await this.prismaClient.transaction.create({
      data: {
        transactionIdentifier: transaction.transactionIdentifier,
          bankAccountIdentifier: transaction.bankAccountIdentifier,
          direction: transaction.direction as $Enums.TransactionDirection,
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type as $Enums.TransactionType,
          date: transaction.date
        }
      });

      const newTransaction = new Transaction(
        registeredTransaction.transactionIdentifier,
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
      const transactionsArray: Transaction[] = [];
      transactions.forEach(transaction => {
        const newTransaction = new Transaction(
          transaction.transactionIdentifier, 
          transaction.bankAccountIdentifier, 
          transaction.amount,
          transaction.direction.toString() as TransactionDirection,
          transaction.type.toString() as TransactionType,
          transaction.description,
          transaction.date
        )

        transactionsArray.push(newTransaction);
      })
      return ok(transactionsArray);
    } catch (error) {
      return err(new Error("An error occured when retrieving a transaction"))
    }
  }

  async findById(transactionIdentifier: string): Promise<Result<Transaction, TransactionNotFoundError>> {
    try{
      const existingTransaction = await this.prismaClient.transaction.findUnique({
        where: {
          transactionIdentifier
        }
      });

      if(!existingTransaction){
        return err(new TransactionNotFoundError(transactionIdentifier));
      }

      const transactionObject = new Transaction(
        existingTransaction.transactionIdentifier,
        existingTransaction.bankAccountIdentifier,
        existingTransaction.amount,
        existingTransaction.direction as TransactionDirection,
        existingTransaction.type as TransactionType,
        existingTransaction.description,
        existingTransaction.date
      )

      return ok(transactionObject);
    } catch (error){
      return err(new Error(`An error occured when retreiving transaction: ${transactionIdentifier}`))
    }
  }
}