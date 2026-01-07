import { orderService } from "@/infrastructure/web/services/orderService";

export function useCancelMyOrder(){

  async function cancelMyOrder(orderId: string){
    try{
      const response = await orderService.cancel(orderId);
      return response;
    } catch (error: any) {
      return error as Error
    }
  }

  return {
    cancelMyOrder
  }
}