import { Trade } from "../../../domain/entities/Trade";
import { TradeNotFoundError } from "../../../domain/errors/TradeNotFoundError";
import { Result } from "../../../shared/Result";

export interface TradeRepository {
  save(trade: Trade): Promise<Result<Trade, Error>>;
  saveAll(trades: Trade[]): Promise<Result<boolean, Error>>;
  findById(tradeIdentifier: string): Promise<Result<Trade, TradeNotFoundError>>
  findPendingSettlement(): Promise<Result<Trade[], Error>>;
  all(): Promise<Result<Trade[], Error>>;
}