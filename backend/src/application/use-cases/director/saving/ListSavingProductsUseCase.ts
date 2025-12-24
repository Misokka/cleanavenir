import { SavingProduct } from "../../../../domain/entities/SavingProduct";
import Result, { err, ok } from "../../../../shared/Result";
import { SavingProductRepository } from "../../../ports/repositories/SavingProductRepository";

export class ListSavingProductsUseCase {
  constructor(
    private savingRepository: SavingProductRepository,
  ) {}

  async execute(): Promise<Result<SavingProduct[], Error>>{
    const allSavingProducts = await this.savingRepository.all();
    if(!allSavingProducts.ok){
      return err(allSavingProducts.error);
    }

    return ok(allSavingProducts.value);
  }
}