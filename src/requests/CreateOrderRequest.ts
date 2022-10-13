/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateOrderRequest {
  createdAt: string,
  name: string,
  description:string,
  attachmentUrl?: string
}
