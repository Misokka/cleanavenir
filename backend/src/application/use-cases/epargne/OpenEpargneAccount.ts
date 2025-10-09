import { Result } from "../../../shared/Result";
import { SavingRepository } from "../../ports/SavingRepository";
import { SavingAccountDTO } from "../../dtos/SavingAccountDTO";
import { AlreadyHasSavingAccountError } from "../../../domain/errors/AlreadyHasSavingAccountError";
import { AccountNotFoundError } from "../../../domain/errors/AccountNotFoundError";

export type OpenSavingAccountInput = { AccountId: string };

export class OpenSavingAccount {
  constructor(private readonly SavingRepo: SavingRepository) {}

  async execute(input: OpenSavingAccountInput): Promise<
    Result<SavingAccountDTO, AccountNotFoundError | AlreadyHasSavingAccountError | Error>
  > {
    if (!input.AccountId?.trim()) {
      return { ok: false, error: new Error("AccountId is required") };
    }
    return this.SavingRepo.openForAccount(input.AccountId);
  }
}