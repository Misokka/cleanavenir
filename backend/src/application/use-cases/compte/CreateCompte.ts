import { Result, ok } from "../../../shared/Result";
import { AccountRepository } from "../../ports/AccountRepository";


export type CreateAccountInput = { label: string };
export type CreateAccountOutput = { id: string };

export class CreateAccount {
  constructor(private readonly repo: AccountRepository) {}

  async execute(input: CreateAccountInput): Promise<Result<CreateAccountOutput, Error>> {
    const label = input.label?.trim();
    if (!label) {
      return { ok: false, error: new Error("Label is required") };
    }

    const created = await this.repo.create({ label });
    if (!created.ok) return created; 

    return ok({ id: created.value.id });
  }
}