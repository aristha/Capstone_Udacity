import { OrderItem } from "./OrderItem";

export interface Result {
    nextKey: string;
    orders: OrderItem[]
}