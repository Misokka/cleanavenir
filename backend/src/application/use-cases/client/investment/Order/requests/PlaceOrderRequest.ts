import { OrderType } from "../../../../../../domain/entities/Order";

export interface PlaceOrderRequest {
  userIdentifier: string;
  stockIdentifier: string;
  orderType: OrderType;
  quantity: number,
  limitPrice: number
}