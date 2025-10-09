import { Result } from "../../../shared/Result";
import { SavingRepository } from "../../ports/repositories/SavingRepository";
import { SavingRateDTO } from "../../dtos/SavingRateDTO";
import { SavingRateNotSetError } from "../../../domain/errors/SavingRateNotSetError";

export class GetGlobalSavingRate {
  constructor(private readonly SavingRepo: SavingRepository) {}

  async execute(): Promise<Result<SavingRateDTO, SavingRateNotSetError>> {
    return this.SavingRepo.getGlobalRate();
  }
}