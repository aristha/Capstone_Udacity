import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateOrder } from '../../businessLogic/orders'
import { UpdateOrderRequest } from '../../requests/UpdateOrderRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const orderId = event.pathParameters.orderId
    const updatedOrder: UpdateOrderRequest = JSON.parse(event.body)
    const userId = getUserId(event);
    const order = updateOrder(userId, orderId, updatedOrder)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(order)
    }
  }
);

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      origin:'*',
      headers:'*'
    })
  )
