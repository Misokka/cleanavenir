import { API_ENDPOINTS } from "../endpoints";
import { httpClient } from "../httpClient";

export type Order = {
  id: string;
  stockId: string;
  userId: string;        
  type: "BUY" | "SELL";    
  initialQuantity: number,
  remainingQuanity: number,
  limitPrice: number;  
  fees: number;         
  status: "PENDING" | "PARTIALLY_FILLED" | "EXECUTED" | "CANCELLED";
  createdAt: string;    
  updatedAt: string;
  blockedMoneyAmount?: number;
  blockedStockQuantity?: number;
  stockName: string
}

export interface createOrderRequest{
  stockId: string,
  type: "BUY" | "SELL",
  quantity: number,
  limitPrice: number
}

export interface BestBuyAndSellOrder{
  bestBuyOrder: Order | null,
  bestSellOrder: Order | null
}

export class OrderService {
  async create(props: createOrderRequest){
    try{
      const response = await httpClient.post<{order: Order}>(API_ENDPOINTS.INVESTMENTS.ORDERS.CREATE, props);
      return response.data.order
    } catch (error) {
      console.error("Erreur lors de la création de l'ordre", error);
      throw error;
    }
  }

  async cancel(orderId: string){
    try{
      const response = await httpClient.patch<{
        success: boolean,
        message: string
      }>(API_ENDPOINTS.INVESTMENTS.ORDERS.CANCEL(orderId));
      
      return response.data
    } catch (error) {
      console.error("Erreur lors de la suppression de l'ordre", error);
      throw error;
    }
  }

  async listMyOrders(){
    try{
      const response = await httpClient.get<{orders: Order[]}>(API_ENDPOINTS.INVESTMENTS.ORDERS.LIST_MY_ORDERS);
      return response.data.orders
    } catch (error) {
      console.error("Erreur lors de la récupération  de vos ordres", error);
      throw error;      
    }
  }

  async showBestBuyAndSellForStock(stockId: string){
    try{
      const response = await httpClient.get<BestBuyAndSellOrder>(API_ENDPOINTS.INVESTMENTS.ORDERS.SHOW_BEST_BUY_AND_SELL(stockId));
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération  de vos ordres", error);
      throw error;
    }
  }
}

export const orderService = new OrderService();