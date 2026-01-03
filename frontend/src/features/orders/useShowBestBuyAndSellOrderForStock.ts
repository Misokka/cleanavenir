import { BestBuyAndSellOrder, orderService } from "@/infrastructure/web/services/orderService";
import { useState } from "react";

export function useShowBestBuyAndSellOrderForStock(){
  const [bestOrders, setBestOrders] = useState<BestBuyAndSellOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBestOrdersForStock = async(stockId: string) => {
    try{
      const response = await orderService.showBestBuyAndSellForStock(stockId);
      setBestOrders(response);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    bestOrders,
    fetchBestOrdersForStock,
    loading,
    error
  }
}