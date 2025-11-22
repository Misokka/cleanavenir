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

  async findByAccountId(AccountId: string): Promise<Result<SavingAccountDTO, SavingBankAccountNotFoundError>> {
    
  }

  async openForAccount(AccountId: string): Promise<Result<SavingAccountDTO, BankAccountNotFoundError | AlreadyHasSavingAccountError>> {
    
  }

  async setActive(AccountId: string, active: boolean): Promise<Result<SavingAccountDTO, SavingBankAccountNotFoundError>> {
    
  }

  async getGlobalRate(): Promise<Result<SavingRateDTO, SavingRateNotSetError>> {
    
  }

  async setGlobalRate(value: number): Promise<Result<SavingRateDTO, never>> {
    
  }
}