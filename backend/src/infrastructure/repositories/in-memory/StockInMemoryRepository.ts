import { StockRepository } from '../../../application/ports/repositories/StockRepository';
import { Stock } from '../../../domain/entities/Stock';
import { ok, err, Result } from '../../../shared/Result';
import { StockNotFoundError } from '../../../domain/errors/StockNotFoundError';

export class StockInMemoryRepository implements StockRepository {
  
  private stocks: Map<string, Stock> = new Map();

  private getIdentifier(stock: Stock): string {
    return stock.stockIdentifier;
  }

  async save(stock: Stock): Promise<Result<Stock, any>> { 
    this.stocks.set(this.getIdentifier(stock), stock);
    return ok(stock);
  }

  async findById(id: string): Promise<Result<Stock, StockNotFoundError>> {
    const stock = this.stocks.get(id);
    if (!stock) {
      return err(new StockNotFoundError(id));
    }
    return ok(stock);
  }

  async findByTicker(ticker: string): Promise<Result<Stock, StockNotFoundError>> {
    for (const stock of this.stocks.values()) {
      if (stock.ticker.value === ticker) {
        return ok(stock);
      }
    }
    return err(new StockNotFoundError(ticker));
  }
  
  async update(input: { id: string; name?: string | undefined; }): Promise<Result<Stock, StockNotFoundError>> {
    const stockResult = await this.findById(input.id);
    if (!stockResult.ok) {
      return stockResult; // Renvoie StockNotFoundError
    }
    
    const stock = stockResult.value;
    
    // (Logique de mise à jour si 'input.name' est pertinent pour 'stock')
    // if (input.name) {
    //   stock.ticker = new Ticker(input.name); 
    // }
    
    this.stocks.set(this.getIdentifier(stock), stock);
    return ok(stock);
  }

  // --- CORRECTION (pour ts(2416) sur 'remove') ---
  
  /**
   * La signature de l'interface attend 'Result<true, ...>' au lieu de 'Result<void, ...>'
   */
  async remove(id: string): Promise<Result<true, StockNotFoundError>> {
    if (!this.stocks.has(id)) {
      return err(new StockNotFoundError(id));
    }
    
    this.stocks.delete(id);
    
    // L'interface exige 'true' au lieu de 'undefined' (void)
    return ok(true); 
  }

  async list(): Promise<Result<Stock[], never>> {
    const allStocks = Array.from(this.stocks.values());
    return ok(allStocks);
  }
}