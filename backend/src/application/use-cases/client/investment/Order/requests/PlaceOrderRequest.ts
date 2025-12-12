import { OrderType } from "../../../../../../domain/entities/Order";

export interface PlaceOrderRequest {
  clientIdentifier: string;
  stockIdentifier: string;
  orderType: OrderType;
  quantity: number
}