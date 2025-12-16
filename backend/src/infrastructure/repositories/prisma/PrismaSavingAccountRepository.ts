import { PrismaClient } from "@prisma/client";
import { SavingAccountDTO } from "../../../application/dtos/SavingAccountDTO";
import { SavingRateDTO } from "../../../application/dtos/SavingRateDTO";
import { SavingAccountRepository } from "../../../application/ports/repositories/SavingAccountRepository";
import { SavingAccount } from "../../../domain/entities/SavingAccount";
import { AlreadyHasSavingAccountError } from "../../../domain/errors/AlreadyHasSavingAccountError";
import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";
import { SavingBankAccountNotFoundError } from "../../../domain/errors/SavingAccountNotFoundError";
import { SavingRateNotSetError } from "../../../domain/errors/SavingRateNotSetError";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaSavingAccountMapper } from "../mappers/PrismaMappers/PrismaSavingAccountMapper";

export class PrismaSavingAccountRepository implements SavingAccountRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaSavingAccountMapper: PrismaSavingAccountMapper
  ){}

  async save(savingAccount: SavingAccount): Promise<Result<SavingAccount, Error>> {
    try{
      const savingAccountToPersistence = this.prismaSavingAccountMapper.toPersistence(savingAccount);

      const registeredSavingAccount = await this.prismaClient.savingAccount.create({
        data: { ...savingAccountToPersistence }
      });

      const savingAccountToDomain = this.prismaSavingAccountMapper.toDomain(registeredSavingAccount);
      return ok(savingAccountToDomain)
    } catch (error) {
      return err(new Error(`An error occured when saving saving account ${savingAccount.accountIdentifier}`))
    }
  }

  async saveAll(savingAccounts: SavingAccount[]): Promise<Result<SavingAccount[], Error>> {
    const allRegisteredSavingAccountsToDomain: SavingAccount[] = []
    savingAccounts.forEach(async (savingAccount) => {
      const maybeRegisteredSavingAccount = await this.save(savingAccount);
      if(!maybeRegisteredSavingAccount.ok){
        return err(maybeRegisteredSavingAccount.error)
      }

      allRegisteredSavingAccountsToDomain.push(maybeRegisteredSavingAccount.value);
    });

    return ok(allRegisteredSavingAccountsToDomain);
  }

  async all(): Promise<Result<SavingAccount[], Error>> {
    try{
      const allSavingAccounts = await this.prismaClient.savingAccount.findMany();
      const allSavingAccountsToDomain: SavingAccount[] = [];

      allSavingAccounts.forEach((savingAccount) => {
        const savingAccountToDomain = this.prismaSavingAccountMapper.toDomain(savingAccount);
        allSavingAccountsToDomain.push(savingAccountToDomain);
      });

      return ok(allSavingAccountsToDomain)
    } catch (error) {
      return err(new Error("An error occured when retrieving all saving products."))
    }
  }

  async findByAccountId(accountIdentifier: string): Promise<Result<SavingAccount, SavingBankAccountNotFoundError>> {
    const foundSavingAccount = await this.prismaClient.savingAccount.findUnique({
      where: {
        accountIdentifier: accountIdentifier
      }
    });

    if(!foundSavingAccount){
      return err(new SavingBankAccountNotFoundError(accountIdentifier));
    }

    const savingAccountToDomain = this.prismaSavingAccountMapper.toDomain(foundSavingAccount);
    return ok(savingAccountToDomain);
  }

  async findByAccountIds(accountIds: string[]): Promise<Result<any[], Error>> {
    try {
      const savingAccounts = await this.prismaClient.savingAccount.findMany({
        where: {
          accountIdentifier: {
            in: accountIds
          }
        }
      });

      const savingAccountsToDomain: SavingAccount[] = savingAccounts.map((savingAccount) => {
        return this.prismaSavingAccountMapper.toDomain(savingAccount);
      });

      return ok(savingAccountsToDomain);
    } catch (error) {
      return err(new Error("An error occured when retrieving saving accounts by account IDs."));
    }
  }

  async getGlobalRate(): Promise<Result<SavingRateDTO, SavingRateNotSetError>> {
    return ok({
      value: 0,
      updateAt: "test"
    })
  }

  async setGlobalRate(value: number): Promise<Result<SavingRateDTO, never>> {
    return ok({
      value: value,
      updateAt: "test"
    })
  }

  async openForAccount(accountIdentifier: string): Promise<Result<SavingAccount, BankAccountNotFoundError | AlreadyHasSavingAccountError>> {
    const existing = await this.prismaClient.savingAccount.findUnique({
      where: {
        accountIdentifier: accountIdentifier
      }
    });

    if(existing){
      return err(new AlreadyHasSavingAccountError(accountIdentifier));
    }

    // Here you would normally check if the bank account exists in another table.
    // For simplicity, we will assume it does not exist and return an error.
    return err(new BankAccountNotFoundError(accountIdentifier));
  }

  async setActive(accountIdentifier: string, active: boolean): Promise<Result<SavingAccount, SavingBankAccountNotFoundError>> {
    const existing = await this.prismaClient.savingAccount.findUnique({
      where: {
        accountIdentifier: accountIdentifier
      }
    });

    if(!existing){
      return err(new SavingBankAccountNotFoundError(accountIdentifier));
    }

    const updatedSavingAccount = await this.prismaClient.savingAccount.update({
      where: {
        accountIdentifier: accountIdentifier
      },
      data: {
        isActive: active,
      }
    });

    const savingAccountToDomain = this.prismaSavingAccountMapper.toDomain(updatedSavingAccount);
    return ok(savingAccountToDomain);
  }
}