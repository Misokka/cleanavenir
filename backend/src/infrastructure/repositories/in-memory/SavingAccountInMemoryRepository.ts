import { SavingAccountRepository } from '../../../application/ports/repositories/SavingAccountRepository';
import { SavingAccount } from '../../../domain/entities/SavingAccount';
import { SavingAccountDTO } from '../../../application/dtos/SavingAccountDTO';
import { SavingRateDTO } from '../../../application/dtos/SavingRateDTO';
import { Result, ok, err } from '../../../shared/Result';
import { BankAccountNotFoundError } from '../../../domain/errors/BankAccountNotFoundError';
import { AlreadyHasSavingAccountError } from '../../../domain/errors/AlreadyHasSavingAccountError';
import { SavingBankAccountNotFoundError } from '../../../domain/errors/SavingAccountNotFoundError';
import { SavingRateNotSetError } from '../../../domain/errors/SavingRateNotSetError';
// on ne utilise pas BaseInMemoryRepository ici car l'interface exige des types de retour Result<>
export class SavingAccountInMemoryRepository implements SavingAccountRepository {
  private accounts = new Map<string, SavingAccount>();
  private globalRate: number = 0.01; // Taux par défaut
  private globalRateUpdatedAt: string = new Date().toISOString();

  private clone<T>(v: T): T {
    try {
      return structuredClone(v);
    } catch {
      return JSON.parse(JSON.stringify(v));
    }
  }

  async save(savingAccount: SavingAccount): Promise<Result<SavingAccount, Error>> {
    this.accounts.set(savingAccount.accountIdentifier, this.clone(savingAccount));
    return ok(savingAccount);
  }

  async saveAll(savingAccounts: SavingAccount[]): Promise<Result<void, Error>> {
    for (const sa of savingAccounts) {
      this.accounts.set(sa.accountIdentifier, this.clone(sa));
    }
    return ok(undefined);
  }

  async all(): Promise<Result<SavingAccount[], Error>> {
    const allAccounts = Array.from(this.accounts.values()).map((a) => this.clone(a));
    return ok(allAccounts);
  }

  async findByUserId(userId: string): Promise<SavingAccount | null> {
    for (const acc of this.accounts.values()) {
      if ((acc as any).clientIdentifier === userId) return this.clone(acc);
    }
    return null;
  }

  async openForAccount(AccountId: string): Promise<Result<SavingAccountDTO, BankAccountNotFoundError | AlreadyHasSavingAccountError>> {
    const existing = Array.from(this.accounts.values()).find(a => a.accountIdentifier === AccountId);
    if (!existing) return err(new BankAccountNotFoundError(AccountId));
    const hasSaving = Array.from(this.accounts.values()).some(a => a.accountIdentifier === AccountId && a instanceof SavingAccount);
    if (hasSaving) return err(new AlreadyHasSavingAccountError(AccountId));

    const dto: SavingAccountDTO = {
      id: `${AccountId}:saving`,
      AccountId: AccountId,
      isActive: true,
      openedAt: new Date().toISOString(),
    };
    return ok(dto);
  }

  async findByAccountId(AccountId: string): Promise<Result<SavingAccountDTO, SavingBankAccountNotFoundError>> {
    const acc = Array.from(this.accounts.values()).find(a => a.accountIdentifier === AccountId && a instanceof SavingAccount);
    if (!acc) return err(new SavingBankAccountNotFoundError(AccountId));
    const dto: SavingAccountDTO = {
      id: `${acc.accountIdentifier}:saving`,
      AccountId: acc.accountIdentifier,
      isActive: true,
      openedAt: new Date().toISOString(),
    };
    return ok(dto);
  }

  async setActive(AccountId: string, active: boolean): Promise<Result<SavingAccountDTO, SavingBankAccountNotFoundError>> {
    const acc = Array.from(this.accounts.values()).find(a => a.accountIdentifier === AccountId && a instanceof SavingAccount);
    if (!acc) return err(new SavingBankAccountNotFoundError(AccountId));
    // si on avait un champ isActive dans l'entité, on le mettrait à jour ici
    const dto: SavingAccountDTO = {
      id: `${acc.accountIdentifier}:saving`,
      AccountId: acc.accountIdentifier,
      isActive: true,
      openedAt: new Date().toISOString(),
    };
    return ok(dto);
  }

  async setGlobalRate(value: number): Promise<Result<SavingRateDTO, never>> {
    this.globalRate = value;
    this.globalRateUpdatedAt = new Date().toISOString();
    return ok({
      value: this.globalRate,
      updateAt: this.globalRateUpdatedAt,
    });
  }

  async getGlobalRate(): Promise<Result<SavingRateDTO, SavingRateNotSetError>> {
    if (this.globalRate === undefined || this.globalRate === null) {
      return err(new SavingRateNotSetError());
    }
    return ok({
      value: this.globalRate,
      updateAt: this.globalRateUpdatedAt,
    });
  }
}