import { OrdersAccess } from '../datalayer/ordersAcess'
import { OrderItem } from '../models/OrderItem'
import { OrderUpdate } from '../models/OrderUpdate'
import { Result } from '../models/Result'
import { CreateOrderRequest } from '../requests/CreateOrderRequest'
import { UpdateOrderRequest } from '../requests/UpdateOrderRequest'


const ordersAccess = new OrdersAccess()
/**
 * Get a todos from user
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export async function getOrdersForUser(userId: string, orderName: string,limit: number, nextKey: any): Promise<Result> {

  return ordersAccess.getOrdersForUser(userId, orderName,  limit, nextKey);
}

/**
 * Get a Order from user
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export async function createOrder(userId: string, createOrderRequest: CreateOrderRequest): Promise<OrderItem> {

  return ordersAccess.createOrder(userId, createOrderRequest);
}


/**
 * Update a Order By Key
 * @param event an event from API Gateway
 *
 * @returns Order 
 */
export async function updateOrder(userId: string, orderId: string, updateOrderRequest: UpdateOrderRequest): Promise<OrderUpdate> {
  return ordersAccess.updateOrder(userId, orderId, updateOrderRequest);
}


/**
 * Delete a Order By Key
 * @param event an event from API Gateway
 *
 * @returns Order 
 */
export async function deleteOrder(userId: string, orderId: string): Promise<string> {
  return ordersAccess.deleteOrder(userId, orderId);
}


/**
 * Get URL
 * @param event an event from API Gateway
 *
 * @returns URL 
 */
 export async function createAttachmentPresignedUrl(userId: string, orderId: string): Promise<string> {
  return ordersAccess.createAttachmentPresignedUrl(userId, orderId);
}