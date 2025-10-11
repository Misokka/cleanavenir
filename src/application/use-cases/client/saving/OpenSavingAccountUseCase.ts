import { Result } from "../../../../shared/Result";
import { SavingRepository } from "../../../ports/repositories/SavingRepository";
import { SavingAccountDTO } from "../../../dtos/SavingAccountDTO";
import { AlreadyHasSavingAccountError } from "../../../../domain/errors/AlreadyHasSavingAccountError";
import { BankAccountNotFoundError } from "../../../../domain/errors/BankAccountNotFoundError";

export type OpenSavingAccountInput = { AccountId: string };

export class OpenSavingAccountUseCase {
  constructor(private readonly SavingRepo: SavingRepository) {}

  async execute(input: OpenSavingAccountInput): Promise<
    Result<SavingAccountDTO, BankAccountNotFoundError | AlreadyHasSavingAccountError | Error>
  > {
    if (!input.AccountId?.trim()) {
      return { ok: false, error: new Error("AccountId is required") };
    }
    return this.SavingRepo.openForAccount(input.AccountId);
  }
}