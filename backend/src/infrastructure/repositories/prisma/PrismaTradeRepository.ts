import { PrismaClient, TradeStatus } from "@prisma/client";
import { TradeRepository } from "../../../application/ports/repositories/TradeRepository";
import { Trade } from "../../../domain/entities/Trade";
import Result, { err, ok } from "../../../shared/Result";

export class PrismaTradeRepository implements TradeRepository {
  constructor(
    private readonly prismaClient: PrismaClient
  ){}

  async save(trade: Trade): Promise<Result<Trade, Error>> {
    const registerdTrade = await this.prismaClient.trade.create({
      data: {
        tradeIdentifier: trade.tradeIdentifier,
        stockIdentifier: trade.stockIdentifier,
        price: trade.price,
        buyOrderIdentifier: trade.buyOrderIdentifier,
        sellOrderIdentifier: trade.sellOrderIdentifier,
        quantity: trade.quantity,
        status: trade.status,
        timestamp: trade.timestamp

      }
    });

    if(!registerdTrade){
      return err(new Error(`An error occured when creating this trade ${trade.tradeIdentifier}`))
    }

    return ok(trade)
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
        pendingSettlement = {...pendingSettlement, status: pendingSettlement.status as TradeStatus }
        pendingSettlemntsArray.push(pendingSettlement)
      })

      return ok(pendingSettlements)
    } catch (error){
      return err(new Error("An error occured when fetching the pending settlements."))
    }
  }
}