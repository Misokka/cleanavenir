import { ok, Result } from "../../../../shared/Result";

export class GetCurrentSavingRateUseCase {
  public async execute(): Promise<Result<{ rate: number; updatedAt: string }, Error>> {
    const defaultRate = 2.5;
    
    return ok({
      rate: defaultRate,
      updatedAt: new Date().toISOString(),
    });
  }
}
