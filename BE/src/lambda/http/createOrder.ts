import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateOrderRequest } from '../../requests/CreateOrderRequest'
import { getUserId } from '../utils';
import { createOrder } from '../../businessLogic/orders'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newOrder: CreateOrderRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    const order = await createOrder(userId, newOrder);
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'*'
      },
      body: JSON.stringify(
        {
          item: order
        }
      )
    }
  }
)

handler.use(
  cors({
    credentials: true,
    origin:'*',
    headers:'*'
  })
)
