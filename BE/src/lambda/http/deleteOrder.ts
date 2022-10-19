import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteOrder } from '../../businessLogic/orders'
import { getUserId } from '../utils'
import { stringify } from 'querystring'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const orderId = event.pathParameters.orderId;
    const userId = getUserId(event);
    deleteOrder(userId, orderId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: stringify({
        msg:" delete success"
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      origin:'*',
      headers:'*'
    })
  )
