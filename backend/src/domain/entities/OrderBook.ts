import { randomUUID } from "crypto";
import { Order } from "./Order";
import { Trade } from "./Trade";

export class OrderBook {
  private bids: Order[] = []; // Ordres d'achat (triés du + cher au - cher)
  private asks: Order[] = []; // Ordres de vente (triés du - cher au + cher)

  constructor(public readonly stockIdentifier: string, existingOrders: Order[]) {
    // Initialise le carnet avec les ordres déjà ouverts
    existingOrders.forEach(order => this.addOrderToList(order));
  }

  // Ajoute un ordre à la bonne liste et au bon endroit
  private addOrderToList(order: Order): void {
    const list = order.type === "BUY" ? this.bids : this.asks;
    list.push(order);
    if (order.type === "BUY") {
      list.sort((a, b) => b.limitPrice - a.limitPrice); // Trie les acheteurs
    } else {
      list.sort((a, b) => a.limitPrice - b.limitPrice); // Trie les vendeurs
    }
  }

  /**
   * Ajoute un nouvel ordre et tente de le matcher.
   * @returns La liste des transactions (Trades) qui ont été créées.
   */
  public addOrder(newOrder: Order): Trade[] {
    this.addOrderToList(newOrder);
    return this.matchOrders();
  }

  // Le moteur de matching
  private matchOrders(): Trade[] {
    const trades: Trade[] = [];

    // Tant que le meilleur acheteur est d'accord pour payer le prix du meilleur vendeur...
    while (this.bids.length > 0 && this.asks.length > 0 && this.bids[0].limitPrice >= this.asks[0].limitPrice) {
      const bestBid = this.bids[0]; // Ordre d'achat le + élevé
      const bestAsk = this.asks[0]; // Ordre de vente le + bas

      const tradeQuantity = Math.min(bestBid.remainingQuantity, bestAsk.remainingQuantity);
      const tradePrice = bestAsk.limitPrice; // Le prix du vendeur (le plus ancien) fait foi

      // 1. On crée un "Trade", un reçu de la transaction
      const tradeIdentifier = randomUUID();
      const trade = new Trade(tradeIdentifier, this.stockIdentifier, bestBid.orderIdentifier, bestAsk.orderIdentifier, tradeQuantity, tradePrice);
      trades.push(trade);

      // 2. On met à jour les ordres
      bestBid.remainingQuantity -= tradeQuantity;
      bestAsk.remainingQuantity -= tradeQuantity;

      // 3. On retire les ordres s'ils sont complétés
      if (bestBid.remainingQuantity === 0) bestBid.status = "FILLED";
      if (bestAsk.remainingQuantity === 0) bestAsk.status = "FILLED";
      
      this.bids = this.bids.filter(o => o.status !== "FILLED");
      this.asks = this.asks.filter(o => o.status !== "FILLED");
    }
    
    return trades; // On retourne la liste des échanges à régler
  }
}