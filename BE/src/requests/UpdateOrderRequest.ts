/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateOrderRequest {
  name: string
  updateDate: string
  number:number,
  attachmentUrl?: string,
  description?: string
}