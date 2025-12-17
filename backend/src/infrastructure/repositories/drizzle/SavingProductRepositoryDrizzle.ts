import { SavingProductRepository } from "../../../application/ports/repositories/SavingProductRepository";
import { SavingProduct } from "../../../domain/entities/SavingProduct";
import Result from "../../../shared/Result";

export class SavingProductRepositoryDrizzle implements SavingProductRepository {
  async save(savingProduct: SavingProduct): Promise<Result<SavingProduct, Error>> {
    
  }

  async findById(savingProductIdentifier: string): Promise<Result<SavingProduct, Error>> {
    
  }

  async findByLabel(label: string): Promise<Result<SavingProduct, Error>> {
    
  }

  async all(): Promise<Result<SavingProduct[], Error>> {
    
  }

  async delete(savingProductIdentifier: string): Promise<Result<SavingProduct, Error>> {
    
  }
}