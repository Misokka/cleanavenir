import { Order, orderService } from "@/infrastructure/web/services/orderService";
import { useCallback, useEffect, useState } from "react";

export function useGetMyOrders(){
  const [myOrders, setMyOrders] = useState<Order[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMyOrders = useCallback(async () => {
    try{
      const response = await orderService.listMyOrders();
      setMyOrders(response);
    } catch (e: any) {
      setError(e)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyOrders();
  }, [])

  return {
    fetchMyOrders,
    myOrders,
    loading,
    error
  }
}