import { PrismaClient } from "@prisma/client";
import { BankAccountRepository } from "../../../application/ports/repositories/BankAccountRepository";
import { BankAccount } from "../../../domain/entities/BankAccount";
import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";
import Result, { err, ok } from "../../../shared/Result";
import { UnexpectedBankAccountError } from "../../../domain/errors/UnexpectedBankAccountError";
import { PrismaBankAccountMapper } from "../mappers/PrismaMappers/PrismaBankAccountMapper";

export class PrismaBankAccountRepository implements BankAccountRepository{
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaBankAccountMapper: PrismaBankAccountMapper,
  ){}

  async save(bankAccount: BankAccount): Promise<Result<BankAccount, Error>> {
    try{
      const bankAccountToPersist = this.prismaBankAccountMapper.toPersistence(bankAccount);
      const registeredBankAccount = await this.prismaClient.bankAccount.create({
        data: {
          ...bankAccountToPersist
        }
      })

      const bankAccountToDomain = this.prismaBankAccountMapper.toDomain(registeredBankAccount)
      return ok(bankAccountToDomain);
    } catch (error){
      return err(new UnexpectedBankAccountError("Unexpected error retrieving bank account by ID"));
    }
    
  }

  async findByIban(iban: string): Promise<Result<BankAccount, BankAccountNotFoundError | UnexpectedBankAccountError>> {
    try{
      const maybeBankAccount = await this.prismaClient.bankAccount.findUnique({
        where: {
          iban: iban
        }
      });

      if(!maybeBankAccount){
        return err(new BankAccountNotFoundError(iban));
      }

      const bankAccountToDomain = this.prismaBankAccountMapper.toDomain(maybeBankAccount);

      return ok(bankAccountToDomain);
    } catch (error){
      return err(new UnexpectedBankAccountError("Unexpected error retrieving bank account by IBAN"));
    }

  }

  async findById(accountIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError | UnexpectedBankAccountError>> {
      try{
        const maybeBankAccount = await this.prismaClient.bankAccount.findUnique({
          where: {
            accountIdentifier: accountIdentifier
          }
        });

        if(!maybeBankAccount){
          return err(new BankAccountNotFoundError(accountIdentifier));
        }

        const bankAccountToDomain = this.prismaBankAccountMapper.toDomain(maybeBankAccount);

        return ok(bankAccountToDomain);
      } catch (error) {
        return err(new UnexpectedBankAccountError("Unexpected error retrieving bank account by ID"));
      }
  }

  async findDefaultAccountByClientId(clientIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError | UnexpectedBankAccountError>> {
      try{
        const maybeBankAccount = await this.prismaClient.bankAccount.findFirst({
          where: {
            clientIdentifier: clientIdentifier
          }
        });

        if(!maybeBankAccount){
          return err(new BankAccountNotFoundError(clientIdentifier));
        }

        const bankAccountToDomain = this.prismaBankAccountMapper.toDomain(maybeBankAccount);

        return ok(bankAccountToDomain); 
      } catch (error){
        return err(new UnexpectedBankAccountError("Unexpected error retrieving bank account by ID"));
      }
  }

  async findByOwner(clientIdentifier: string): Promise<Result<BankAccount[], UnexpectedBankAccountError>> {
      try{
        const bankAccounts = await this.prismaClient.bankAccount.findMany({
          where: {
            clientIdentifier: clientIdentifier
          }
        });

        const bankAccountsToDomain = bankAccounts.map((bankAccount) => this.prismaBankAccountMapper.toDomain(bankAccount));

        return ok(bankAccountsToDomain);
      } catch (error){
        return err(new UnexpectedBankAccountError("Unexpected error retrieving bank account by ID"));
      }
  }

  async updateBalance(accountIdentifier: string, newBalance: number): Promise<Result<BankAccount, BankAccountNotFoundError | UnexpectedBankAccountError>> {
      try{
        const updatedBankAccount = await this.prismaClient.bankAccount.update({
          where: {
            accountIdentifier: accountIdentifier
          },
          data: {
            balance: newBalance
          }
        });

        const bankAccountToDomain = this.prismaBankAccountMapper.toDomain(updatedBankAccount);

        return ok(bankAccountToDomain);
      } catch (error){
       return err(new UnexpectedBankAccountError("Unexpected error retrieving bank account by ID"));
      }
  }
  
  async rename(accountIdentifier: string, label: string): Promise<Result<BankAccount, BankAccountNotFoundError | UnexpectedBankAccountError>> {
      try{
        const updatedBankAccount = await this.prismaClient.bankAccount.update({
          where: {
            accountIdentifier: accountIdentifier
          },
          data: {
            label: label
          }
        });

        const bankAccountToDomain = this.prismaBankAccountMapper.toDomain(updatedBankAccount);

        return ok(bankAccountToDomain);
      } catch (error){
       return err(new UnexpectedBankAccountError("Unexpected error retrieving bank account by ID"));
      }
  }

  async remove(accountIdentifier: string): Promise<Result<true, BankAccountNotFoundError | UnexpectedBankAccountError>> {
      try{
        const existingBankAccount = await this.prismaClient.bankAccount.findUnique({
          where: {
            accountIdentifier: accountIdentifier
          }
        });

        if(!existingBankAccount){
          return err(new BankAccountNotFoundError(accountIdentifier));
        }

        await this.prismaClient.bankAccount.delete({
          where: {
            accountIdentifier: accountIdentifier
          }
        });

        return ok(true);
      } catch (error){
        return err(new UnexpectedBankAccountError("Unexpected error retrieving bank account by ID"));
      }
  }

}