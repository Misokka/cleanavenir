import { SavingProduct } from "../../../domain/entities/SavingProduct";
import { Result } from "../../../shared/Result";

export interface SavingProductRepository{
  save(savingProduct: SavingProduct): Promise<Result<SavingProduct, Error>>;
  findById(savingProductIdentifier: string): Promise<Result<SavingProduct, Error>>;
  findByLabel(label: string): Promise<Result<SavingProduct, Error>>;
  all(): Promise<Result<SavingProduct[], Error>>;
  delete(savingProductIdentifier: string): Promise<Result<SavingProduct, Error>>
}