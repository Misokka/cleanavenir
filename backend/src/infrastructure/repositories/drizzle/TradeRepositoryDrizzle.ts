import { TradeRepository } from "../../../application/ports/repositories/TradeRepository";
import { Trade } from "../../../domain/entities/Trade";
import { DrizzleClient } from "../../drizzle/client";
import { DrizzleTradeMapper } from "../mappers/DrizzleMappers/DrizzleTradeMapper";
import Result, { err, ok } from "../../../shared/Result";
import { trades } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TradeNotFoundError } from "../../../domain/errors/TradeNotFoundError";

export class TradeRepositoryDrizzle implements TradeRepository{
  constructor(
    private readonly db: DrizzleClient,
    private readonly tradeMapper: DrizzleTradeMapper
  ){}

  async save(trade: Trade): Promise<Result<Trade, Error>> {
    try{
      const tradeToPersist = this.tradeMapper.toPersistence(trade);
      const registeredTradeRows = await this.db.insert(trades).values(tradeToPersist).returning();
      const tradeToDomain = this.tradeMapper.toDomain(registeredTradeRows[0]);
      return ok(tradeToDomain);
    } catch (error) {
      return err(new Error(`An error occured when saving trade: ${trade.tradeIdentifier}`));
    }
  }

  async saveAll(trades: Trade[]): Promise<Result<boolean, Error>> {
    try{
      trades.forEach(async (trade) => {
        const registeredTrade = await this.save(trade);

        if(!registeredTrade.ok){
          return err(registeredTrade.error);
        }
      });
      return ok(true);
    } catch (error) {
      return err(new Error(`An error occured when saving all trades at once. ${error}`));
    }
  }

  async findById(tradeIdentifier: string): Promise<Result<Trade, TradeNotFoundError>> {
    try{
      const tradeRows = await this.db.select().from(trades).where(eq(trades.id, tradeIdentifier));
      if(!tradeRows.length){
        return err(new TradeNotFoundError(tradeIdentifier))
      }
      const tradeToDomain = this.tradeMapper.toDomain(tradeRows[0]);
      return ok(tradeToDomain);
    } catch (error) {
      return err(new Error(`An error occured whnn retrieving trade: ${tradeIdentifier}`))
    }
  }

  async findPendingSettlement(): Promise<Result<Trade[], Error>> {
    try{
      const pendingSettlements = await this.db.select().from(trades).where(eq(trades.status, "PENDING_SETTLEMENT"));
      const pendingToDomain = pendingSettlements.map((settlement) => {
        return this.tradeMapper.toDomain(settlement);
      });
      return ok(pendingToDomain);
    } catch (error) {
      return err(new Error("An error occured when saving all trades at once."));
    }
  }

  async all(): Promise<Result<Trade[], Error>> {
    try{
      const tradeRows = await this.db.select().from(trades);
      const tradesToDomain = tradeRows.map((trade) => {
        return this.tradeMapper.toDomain(trade);
      });
      return ok(tradesToDomain)
    } catch (error) {
      return err(new Error("An error occured when retrieving all trades."));
    }
  }
}