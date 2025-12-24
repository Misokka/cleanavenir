import { PrismaClient } from "@prisma/client";
import { OperationFilters, TransactionRepository } from "../../../application/ports/repositories/TransactionRepository";
import { Transaction } from "../../../domain/entities/Transaction";
import Result, { err, ok } from "../../../shared/Result";
import { TransactionNotFoundError } from "../../../domain/errors/TransactionNotFoundError";
import { PrismaTransactionMapper } from "../mappers/PrismaMappers/PrismaTransactionMapper";
import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";

export class PrismaTransactionRepository implements TransactionRepository {
  constructor(
    private prismaClient: PrismaClient,
    private prismaTransactionMapper: PrismaTransactionMapper
  ){}

  async save(transaction: Transaction): Promise<Result<Transaction, Error>> {
    try{
      const transactionToPersist = this.prismaTransactionMapper.toPersistence(transaction);
      const registeredTransaction = await this.prismaClient.transaction.create({
        data: {
          ...transactionToPersist
        }
      });

      const transactionToDomain = this.prismaTransactionMapper.toDomain(registeredTransaction);

      return ok(transactionToDomain)
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
        const transactionToDomain = this.prismaTransactionMapper.toDomain(transaction);
        transactionsArray.push(transactionToDomain);
      })

      return ok(transactionsArray);
    } catch (error) {
      return err(new Error("An error occured when retrieving a transaction"));
    }
  }

  async findById(transactionIdentifier: string): Promise<Result<Transaction, TransactionNotFoundError>> {
    try{
      const maybeTransaction = await this.prismaClient.transaction.findUnique({
        where: {
          transactionIdentifier
        }
      });

      if(!maybeTransaction){
        return err(new TransactionNotFoundError(transactionIdentifier));
      }

      const transactionToDomain = this.prismaTransactionMapper.toDomain(maybeTransaction);

      return ok(transactionToDomain);
    } catch (error){
      return err(new Error(`An error occured when retreiving transaction: ${transactionIdentifier}`))
    }
  }

  async listByAccountId(params: { accountId: string; limit?: number; offset?: number; }): Promise<Result<Transaction[], Error>> {
    try{
      const { accountId, limit, offset } = params;
      const transactions = await this.prismaClient.transaction.findMany({
        where: {
          bankAccountIdentifier: accountId
        },
        take: limit,
        skip: offset
      });
      const transactionsArray: Transaction[] = [];
      transactions.forEach(transaction => {
        const transactionToDomain = this.prismaTransactionMapper.toDomain(transaction);
        transactionsArray.push(transactionToDomain);
      });

      return ok(transactionsArray);
    } catch (error) {
      return err(new Error(`An error occured when retrieving transactions for account: ${params.accountId}`))
    }
  }

  async listForAccount(accountIdentifier: string): Promise<Result<Transaction[], Error>> {
    try{
      const transactions = await this.prismaClient.transaction.findMany({
        where: {
          bankAccountIdentifier: accountIdentifier
        }
      });
      const transactionsArray: Transaction[] = [];
      transactions.forEach(transaction => {
        const transactionToDomain = this.prismaTransactionMapper.toDomain(transaction);
        transactionsArray.push(transactionToDomain);
      });

      return ok(transactionsArray);
    } catch (error) {
      return err(new Error(`An error occured when retrieving transactions for account: ${accountIdentifier}`))
    }
  }

  async listRecentForUser(userAccountIds: string[], limit: number): Promise<Result<Transaction[], Error>> {
    try {
      const transactions = await this.prismaClient.transaction.findMany({
        where: {
          bankAccountIdentifier: {
            in: userAccountIds
          }
        },
        orderBy: {
          date: 'desc'
        },
        take: limit
      });

      const transactionsArray: Transaction[] = [];
      transactions.forEach(transaction => {
        const transactionToDomain = this.prismaTransactionMapper.toDomain(transaction);
        transactionsArray.push(transactionToDomain);
      });

      return ok(transactionsArray); 
    } catch (error) {
      return err(new Error(`An error occured when retrieving recent transactions for user accounts.`))
    }
  }

  async listWithFilters(accountIds: string[], filters: OperationFilters): Promise<Result<Transaction[], Error>> {
    try {
      const whereClause: any = {
        bankAccountIdentifier: {
          in: accountIds
        }
      };

      if (filters.type) {
        whereClause.type = {
          in: filters.type
        };
      }
      if (filters.dateFrom) {
        whereClause.date = {
          ...whereClause.date,
          gte: new Date(filters.dateFrom)
        };
      }
      if (filters.dateTo) {
        whereClause.date = {
          ...whereClause.date,
          lte: new Date(filters.dateTo)
        };
      }
      if (filters.amountMin !== undefined) {
        whereClause.amount = {
          ...whereClause.amount,
          gte: filters.amountMin
        };
      }
      if (filters.amountMax !== undefined) {
        whereClause.amount = {
          ...whereClause.amount,
          lte: filters.amountMax
        };
      }

      const transactions = await this.prismaClient.transaction.findMany({
        where: whereClause
      });

      const transactionsArray: Transaction[] = [];
      transactions.forEach(transaction => {
        const transactionToDomain = this.prismaTransactionMapper.toDomain(transaction);
        transactionsArray.push(transactionToDomain);
      });

      return ok(transactionsArray); 
    } catch (error) {
      return err(new Error(`An error occured when retrieving transactions with filters.`))
    }
  }
}