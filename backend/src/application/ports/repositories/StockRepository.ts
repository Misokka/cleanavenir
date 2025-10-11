import { Stock } from "../../../domain/entities/Stock";
import { StockNotFoundError } from "../../../domain/errors/ActionNotFoundError";
import { Result } from "../../../shared/Result";


export interface StockRepository {
  create(input: { symbol: string; name: string }): Promise<Result<Stock, Error>>; // Error si doublon symbol
  findById(id: string): Promise<Result<Stock, StockNotFoundError>>;
  findBySymbol(symbol: string): Promise<Result<Stock, StockNotFoundError>>;
  update(input: { id: string; name?: string }): Promise<Result<Stock, StockNotFoundError>>;
  remove(id: string): Promise<Result<true, StockNotFoundError>>;
  list(): Promise<Result<Stock[], never>>;
}