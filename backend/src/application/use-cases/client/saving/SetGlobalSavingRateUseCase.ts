import { Result } from "../../../../shared/Result";
import { SavingAccountRepository } from "../../../ports/repositories/SavingAccountRepository";
import { SavingRateDTO } from "../../../dtos/SavingRateDTO";

export type SetGlobalSavingRateInput = { value: number };

export class SetGlobalSavingRateUseCase {
  constructor(private readonly savingAccountRepository: SavingAccountRepository) {}

  async execute(input: SetGlobalSavingRateInput): Promise<Result<SavingRateDTO, Error>> {
    if (input.value < 0) {
      return { ok: false, error: new Error("Rate must be >= 0") };
    }
    return this.savingAccountRepository.setGlobalRate(input.value);
  }
}