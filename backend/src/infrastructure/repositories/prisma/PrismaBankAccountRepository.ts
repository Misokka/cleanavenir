import { PrismaClient } from "@prisma/client";
import { BankAccountRepository } from "../../../application/ports/repositories/BankAccountRepository";
import { BankAccount } from "../../../domain/entities/BankAccount";
import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";
import Result from "../../../shared/Result";

export class PrismaBankAccountRepository implements BankAccountRepository{
  constructor(
    private readonly prismaClient: PrismaClient
  ){}

  async save(bankAccount: BankAccount): Promise<Result<BankAccount, BankAccountNotFoundError>> {
    
  }

  async findByIban(iban: string): Promise<Result<BankAccount, BankAccountNotFoundError>> {

  }

  async findById(accountIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError>> {
      
  }

  async findDefaultAccountByClientId(clientIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError>> {
      
  }
  
  async rename(accountIdentifier: string, label: string): Promise<Result<BankAccount, BankAccountNotFoundError>> {
      
  }

  async remove(accountIdentifier: string): Promise<Result<true, BankAccountNotFoundError>> {
      
  }

}