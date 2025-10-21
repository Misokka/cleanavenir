import { Result } from "../../../../shared/Result";
import { SavingAccountRepository } from "../../../ports/repositories/SavingAccountRepository";
import { SavingRateDTO } from "../../../dtos/SavingRateDTO";
import { SavingRateNotSetError } from "../../../../domain/errors/SavingRateNotSetError";

export class GetGlobalSavingRateUseCase {
  constructor(private readonly savingAccountRepository: SavingAccountRepository) {}

  async execute(): Promise<Result<SavingRateDTO, SavingRateNotSetError>> {
    return this.savingAccountRepository.getGlobalRate();
  }
}