import { PrismaClient } from "@prisma/client";
import { BankAccountRepository } from "../../../application/ports/repositories/BankAccountRepository";
import { BankAccount } from "../../../domain/entities/BankAccount";
import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";
import Result, { err, ok } from "../../../shared/Result";
import { UnexpectedBankAccountError } from "../../../domain/errors/UnexpectedBankAccountError";

export class PrismaBankAccountRepository implements BankAccountRepository{
  constructor(
    private readonly prismaClient: PrismaClient
  ){}

  async save(bankAccount: BankAccount): Promise<Result<BankAccount, Error>> {
    try{
      const registeredBankAccount = await this.prismaClient.bankAccount.create({
        data: {
          accountIdentifier: bankAccount.accountIdentifier,
          clientIdentifier: bankAccount.clientIdentifier,
          iban: bankAccount.iban.value,
          label: bankAccount.label,
          balance: bankAccount.balance
        }
      })

      const newBankAccount = new BankAccount(
        registeredBankAccount.accountIdentifier,
        registeredBankAccount.clientIdentifier,
        bankAccount.iban,
        registeredBankAccount.label,
        registeredBankAccount.balance
      );

      return ok(newBankAccount);
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

      const bankAccount = new BankAccount(
        maybeBankAccount.accountIdentifier,
        maybeBankAccount.clientIdentifier,
        {value: maybeBankAccount.iban},
        maybeBankAccount.label,
        maybeBankAccount.balance
      );

      return ok(bankAccount);
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

        const bankAccount = new BankAccount(
          maybeBankAccount.accountIdentifier,
          maybeBankAccount.clientIdentifier,
          {value: maybeBankAccount.iban},
          maybeBankAccount.label,
          maybeBankAccount.balance
        );

        return ok(bankAccount);
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

        const bankAccount = new BankAccount(
          maybeBankAccount.accountIdentifier,
          maybeBankAccount.clientIdentifier,
          {value: maybeBankAccount.iban},
          maybeBankAccount.label,
          maybeBankAccount.balance
        );

        return ok(bankAccount); 
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

        const bankAccount = new BankAccount(
          updatedBankAccount.accountIdentifier,
          updatedBankAccount.clientIdentifier,
          {value: updatedBankAccount.iban},
          updatedBankAccount.label,
          updatedBankAccount.balance
        );

        return ok(bankAccount);
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