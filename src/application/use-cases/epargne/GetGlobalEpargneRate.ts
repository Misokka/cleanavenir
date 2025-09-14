import { Result } from "../../../shared/Result";
import { EpargneRepository } from "../../ports/EpargneRepository";
import { EpargneRateDTO } from "../../dtos/EpargneRateDTO";
import { EpargneRateNotSetError } from "../../../domain/errors/EpargneRateNotSetError";

export class GetGlobalEpargneRate {
  constructor(private readonly epargneRepo: EpargneRepository) {}

  async execute(): Promise<Result<EpargneRateDTO, EpargneRateNotSetError>> {
    return this.epargneRepo.getGlobalRate();
  }
}