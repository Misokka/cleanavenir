import { eq } from "drizzle-orm";
import { db } from "../../src/infrastructure/drizzle/client";
import { ClientDrizzle, HoldingDrizzle, holdings, NewPortfolioDrizzle, OrderDrizzle, orders, PortfolioDrizzle, portfolios, stocks, users } from "../../src/infrastructure/drizzle/schema";
import { randomUUID } from "crypto";

async function createPortfolioForSystem(systemClient: ClientDrizzle): Promise<PortfolioDrizzle | void>{
  try{
    const systemPortfolioToPersist: NewPortfolioDrizzle = {
      id: randomUUID(),
      ownerId: systemClient.id,
      createdAt: new Date().toISOString()
    }

    const systemPortfolioRows = await db.insert(portfolios).values(systemPortfolioToPersist).returning();
    if(!systemPortfolioRows.length){
      throw new Error("Couldn't create system portfolio")
    }
    const systemPortfolio = systemPortfolioRows[0]
    return systemPortfolio
  } catch (error) {
    console.error("Unexpected Error when creating system portfolio", error);
    return
  }
    
}

async function createHoldingsForSystemPortfolio(systemPortfolio: PortfolioDrizzle): Promise<HoldingDrizzle[] | void>{
  try{
    const allStocks = await db.select().from(stocks);
    if(!allStocks.length){
      throw new Error("No stocks found");
    }

    const insertedHoldings: HoldingDrizzle[] = [];

    for(const stock of allStocks){
      const newHolding: HoldingDrizzle = {
        id: randomUUID(),
        portfolioId: systemPortfolio.id,
        stockId: stock.id,
        quantity: 10,
        averagePrice: stock.price,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const insertedHoldingRows = await db.insert(holdings).values(newHolding).returning();
      insertedHoldings.push(insertedHoldingRows[0])
      console.log(`seeding for holding ${newHolding.id} done.`)
    }

    return insertedHoldings
  } catch (error){
    console.error("Unexpected Error when creating holdings for system", error);
    return
  }
}

async function createSellOrdersForSystem(systemClient: ClientDrizzle, systemHoldings: HoldingDrizzle[]){
  try{
    for(const holding of systemHoldings){
      const newSellOrder: OrderDrizzle = {
        id: randomUUID(),
        ownerId: systemClient.id,
        stockId: holding.stockId,
        limitPrice: holding.averagePrice,
        initialQuantity: holding.quantity,
        remainingQuantity: holding.quantity,
        type: "SELL",
        status: "PENDING",
        blockedMoneyAmount: null,
        remainingBlockedMoneyAmount: null,
        blockedStockQuantity: holding.quantity,
        sellerHoldingAveragePrice: 20,
        createdAt: new Date().toISOString()
      }

      await db.insert(orders).values(newSellOrder);
      console.log(`${newSellOrder.id} order inserted.`);

      const currentHolding = holding;
      currentHolding.quantity -= currentHolding.quantity;

      await db.update(holdings).set(currentHolding).where(eq(holdings.id, currentHolding.id));
      console.log(`updated holding ${currentHolding.id}`);
      
    }
  } catch (error) {
    console.error("Unexpected Error when creating sell orders for system", error);
    return
  }
}

async function seed(){
  try{
    const systemUserWithClient = await db.query.users.findFirst({
      where: eq(users.email, "sys@example.com"),
      with: {clientProfile: true}
    });

    if(!systemUserWithClient){
      throw new Error("System user not found");
    }

    const systemPortfolio = await createPortfolioForSystem(systemUserWithClient.clientProfile);
    if(!systemPortfolio) throw new Error("Cannot create holdings as system portfolio doesn't exists");

    const holdings = await createHoldingsForSystemPortfolio(systemPortfolio);
    if(!holdings || !holdings.length){
      throw new Error("No holdings created");
    }

    await createSellOrdersForSystem(systemUserWithClient.clientProfile, holdings);
    process.exit(0);
  } catch (err){
    console.error("Couln't create sell orders", err),
    process.exit(1);
  }

}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
})