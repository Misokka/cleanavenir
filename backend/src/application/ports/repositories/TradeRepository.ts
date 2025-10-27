import { Trade } from "../../../domain/entities/Trade";
import { Result } from "../../../shared/Result";

export interface TradeRepository {
  save(trade: Trade): Promise<Result<Trade, Error>>;
  saveAll(trades: Trade[]): Promise<Result<boolean, Error>>;
  findPendingSettlement(): Promise<Result<Trade[], Error>>
}