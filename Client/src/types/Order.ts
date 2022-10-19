export interface Order {
  orderId: string
  createdAt: string
  name: string
  dueDate: string
  description: string
  attachmentUrl?: string
}
