import { Result } from "../../../shared/Result";
import { EpargneRepository } from "../../ports/EpargneRepository";
import { EpargneAccountDTO } from "../../dtos/EpargneAccountDTO";
import { CompteNotFoundError } from "../../../domain/errors/CompteNotFoundError";
import { AlreadyHasEpargneAccountError } from "../../../domain/errors/AlreadyHasEpargneAccountError";

export type OpenEpargneAccountInput = { compteId: string };

export class OpenEpargneAccount {
  constructor(private readonly epargneRepo: EpargneRepository) {}

  async execute(input: OpenEpargneAccountInput): Promise<
    Result<EpargneAccountDTO, CompteNotFoundError | AlreadyHasEpargneAccountError | Error>
  > {
    if (!input.compteId?.trim()) {
      return { ok: false, error: new Error("compteId is required") };
    }
    return this.epargneRepo.openForCompte(input.compteId);
  }
}