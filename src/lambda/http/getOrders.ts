import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getOrdersForUser as getOrdersForUser } from '../../businessLogic/orders';
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const {orderName,limit, nextKey} = event.queryStringParameters;
    const orders = await getOrdersForUser(userId, orderName,parseInt(limit),nextKey)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(
        {
          items: orders
        }
      )
    }
  }
);

handler.use(
  cors({
    credentials: true,
    origin:'*',
    headers:'*'
  })
)
