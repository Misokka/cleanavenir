import { Result, ok } from "../../../shared/Result";
import { CompteRepository } from "../../ports/CompteRepository";

export type CreateCompteInput = { label: string };
export type CreateCompteOutput = { id: string };

export class CreateCompte {
  constructor(private readonly repo: CompteRepository) {}

  async execute(input: CreateCompteInput): Promise<Result<CreateCompteOutput, Error>> {
    const label = input.label?.trim();
    if (!label) {
      return { ok: false, error: new Error("Label is required") };
    }

    const created = await this.repo.create({ label });
    if (!created.ok) return created; 

    return ok({ id: created.value.id });
  }
}