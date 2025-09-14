import { Result } from "../../../shared/Result";
import { EpargneRepository } from "../../ports/EpargneRepository";
import { EpargneRateDTO } from "../../dtos/EpargneRateDTO";

export type SetGlobalEpargneRateInput = { value: number };

export class SetGlobalEpargneRate {
  constructor(private readonly epargneRepo: EpargneRepository) {}

  async execute(input: SetGlobalEpargneRateInput): Promise<Result<EpargneRateDTO, Error>> {
    if (input.value < 0) {
      return { ok: false, error: new Error("Rate must be >= 0") };
    }
    return this.epargneRepo.setGlobalRate(input.value);
  }
}