import { Result } from "../../../shared/Result";
import { SavingRepository } from "../../ports/SavingRepository";
import { SavingRateDTO } from "../../dtos/SavingRateDTO";

export type SetGlobalSavingRateInput = { value: number };

export class SetGlobalSavingRate {
  constructor(private readonly SavingRepo: SavingRepository) {}

  async execute(input: SetGlobalSavingRateInput): Promise<Result<SavingRateDTO, Error>> {
    if (input.value < 0) {
      return { ok: false, error: new Error("Rate must be >= 0") };
    }
    return this.SavingRepo.setGlobalRate(input.value);
  }
}