import { apiEndpoint } from '../config'

import Axios from 'axios'
import { Order } from '../types/Order';
import { UpdateOrderRequest } from '../types/UpdateOrderRequest';
import { CreateOrderRequest } from '../types/CreateOrderRequest';


export async function getOrders(idToken: string, orderName: string = ''): Promise<Order[]> {
  console.log('Fetching orders')
  const response = await Axios.get(`${apiEndpoint}/orders?orderName=${orderName}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Todos:', response.data)
  return response.data.orders
}

export async function createOrder(
  idToken: string,
  newTodo: CreateOrderRequest
): Promise<Order> {
  const response = await Axios.post(`${apiEndpoint}/orders`, JSON.stringify(newTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchOrder(
  idToken: string,
  orderId: string,
  updatedOrder: UpdateOrderRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/orders/${orderId}`, JSON.stringify(updatedOrder), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteOrder(
  idToken: string,
  orderId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/orders/${orderId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  orderId: string = ''
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/orders/${orderId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
