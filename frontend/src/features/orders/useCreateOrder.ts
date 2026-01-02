import { createOrderRequest, Order, orderService } from "@/infrastructure/web/services/orderService";
import { useCallback, useState } from "react";

export function useCreateOrder(){
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<Error | null>();
  const [loading, setLoading] = useState<boolean>(true);

  const createOrder = useCallback(async (props: createOrderRequest) => {
    try{
      const response = await orderService.create(props);
      setOrder(response);
      return null;
    } catch (e: any) {
      setError(e);
      return e
    } finally {
      setLoading(false);
    }
  }, []);

    const reset = () => {
    setOrder(null);
    setError(null);
    setLoading(false);
  };

  return {
    createOrder,
    order,
    loading,
    error,
    reset
  }
  
}