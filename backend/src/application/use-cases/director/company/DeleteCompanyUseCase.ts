import { CompanyRepository } from "../../../ports/repositories/CompanyRepository";
import { StockRepository } from "../../../ports/repositories/StockRepository";
import Result, { err, ok } from "../../../../shared/Result";
import { CompanyNotFoundError } from "../../../../domain/errors/CompanyNotFoundError";

export class DeleteCompanyUseCase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly stockRepository: StockRepository
  ) {}

  public async execute(companyId: string): Promise<Result<void, Error>> {
    // Vérifier que la company existe
    const maybeCompany = await this.companyRepository.findById(companyId);
    if (!maybeCompany.ok) {
      return err(new CompanyNotFoundError(companyId));
    }

    // Récupérer tous les stocks associés
    const stocksResult = await this.stockRepository.findByCompanyId(companyId);
    if (!stocksResult.ok) {
      return err(stocksResult.error);
    }

    // Supprimer tous les stocks en cascade
    for (const stock of stocksResult.value) {
      const deleteStockResult = await this.stockRepository.remove(stock.stockIdentifier);
      if (!deleteStockResult.ok) {
        return err(new Error(`Failed to delete stock ${stock.ticker.value}: ${deleteStockResult.error.message}`));
      }
    }

    // Supprimer la company
    const deleteResult = await this.companyRepository.delete(companyId);
    if (!deleteResult.ok) {
      return err(deleteResult.error);
    }

    return ok(undefined);
  }
}
