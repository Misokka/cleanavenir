import { $Enums, PrismaClient, TradeStatus } from "@prisma/client";
import { TradeRepository } from "../../../application/ports/repositories/TradeRepository";
import { Trade } from "../../../domain/entities/Trade";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaTradeMapper } from "../mappers/PrismaMappers/PrismaTradeMapper";
import { TradeNotFoundError } from "../../../domain/errors/TradeNotFoundError";

export class PrismaTradeRepository implements TradeRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaTradeMapper: PrismaTradeMapper,
  ){}

  async save(trade: Trade): Promise<Result<Trade, Error>> {
    const tradeToPersist = this.prismaTradeMapper.toPersistence(trade);
    const registerdTrade = await this.prismaClient.trade.create({
      data: {
        ...tradeToPersist,
        createdAt: tradeToPersist.createdAt as Date,
        status: $Enums.TradeStatus.PENDING_SETTLEMENT
      }
    });

    if(!registerdTrade){
      return err(new Error(`An error occured when creating this trade ${trade.tradeIdentifier}`))
    }

    const tradeToDomain = this.prismaTradeMapper.toDomain(registerdTrade);
    return ok(tradeToDomain)
  }

  async saveAll(trades: Trade[]): Promise<Result<boolean, Error>> {
    trades.forEach(async (trade) => {
      const registeredTrade = await this.save(trade);
      if(!registeredTrade.ok){
        return err(registeredTrade.error);
      }
    })

    return ok(true);
  }

  async findPendingSettlement(): Promise<Result<Trade[], Error>> {
    try{
      const pendingSettlemntsArray: Trade[] = []
      const pendingSettlements = await this.prismaClient.trade.findMany({
        where: {
          status: "PENDING_SETTLEMENT"
        }
      });

      pendingSettlements.forEach((pendingSettlement) => {
        const pendingSettlementToDomain = this.prismaTradeMapper.toDomain(pendingSettlement);
        pendingSettlemntsArray.push(pendingSettlementToDomain)
      })

      return ok(pendingSettlements)
    } catch (error){
      return err(new Error("An error occured when fetching the pending settlements."))
    }
  }

  async findById(tradeIdentifier: string): Promise<Result<Trade, TradeNotFoundError>> {
    try{
      const trade = await this.prismaClient.trade.findUnique({
        where: {
          tradeIdentifier
        }
      });
      if(!trade) return err(new TradeNotFoundError(tradeIdentifier));
      const toDomain = this.prismaTradeMapper.toDomain(trade);
      return ok(toDomain);
    } catch {
      return err(new Error(`An error occured when retrieving trade ${tradeIdentifier}`))
    }
  }

  async all(): Promise<Result<Trade[], Error>> {
    try{
      const trades = await this.prismaClient.trade.findMany();
      const toDomain = trades.map(trade => this.prismaTradeMapper.toDomain(trade));
      return ok(toDomain);
    } catch {
      return err(new Error("An error occured when retrieving all trades"))
    }
  }
}