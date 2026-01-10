import { PrismaClient } from "@prisma/client";
import { SavingAccountRepository } from "../../../application/ports/repositories/SavingAccountRepository";
import { SavingAccount } from "../../../domain/entities/SavingAccount";
import { SavingBankAccountNotFoundError } from "../../../domain/errors/SavingAccountNotFoundError";
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

  async findById(accountIdentifier: string): Promise<Result<SavingAccount, SavingBankAccountNotFoundError>> {
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

  async findByOwnerAndProductId(ownerId: string, productId: string): Promise<Result<SavingAccount | null, Error>> {
    try{
      const savingAccount = await this.prismaClient.savingAccount.findFirst({
        where: {
          clientIdentifier: ownerId,
          productIdentifier: productId
        }
      });
      if(!savingAccount) return err(new Error(`Saving account for client ${ownerId} with product ${productId} not found.`));
      const toDomain = this.prismaSavingAccountMapper.toDomain(savingAccount);
      return ok(toDomain);
    } catch {
      return err(new Error(`An error occured when retrieving saving account with product ${productId} for client ${ownerId}`))
    }
  }

  async findManyByOwner(clientIdentifier: string): Promise<Result<SavingAccount[], Error>> {
    try{
      const savingAccounts = await this.prismaClient.savingAccount.findMany({
        where: {
          clientIdentifier: clientIdentifier
        }
      });

      const toDomain = savingAccounts.map((savingAccount) => this.prismaSavingAccountMapper.toDomain(savingAccount));
      return ok(toDomain);
    } catch {
      return err(new Error(`An error occured when retrieving saving accounts for client ${clientIdentifier}`))
    }
  }

  async updateBalance(accountId: string, newBalance: number): Promise<Result<number, Error>> {
    try{
      const updated = await this.prismaClient.savingAccount.update({
        where: {
          accountIdentifier: accountId
        },
        data: {
          balance: newBalance
        }
      });
      if(!updated) return err(new Error(`Couldn't update saving account ${accountId} balance.`));
      return ok(newBalance);
    } catch {
      return err(new Error(`An error occured when updating the balance for saving account ${accountId}`))
    }
  }

  async delete(accountId: string): Promise<Result<boolean, Error>> {
    try{
      const deleted = await this.prismaClient.savingAccount.delete({
        where: {
          accountIdentifier: accountId
        }
      });
      if(!deleted) return err(new Error(`Couldn't delete saving account ${accountId}`))
      return ok(true);
    } catch {
      return err(new Error(`An error occured when deleting saving account: ${accountId}`))
    }
  }



}