import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getOrdersForUser as getOrdersForUser } from '../../businessLogic/orders';
import { getUserId } from '../utils';
import { Result } from '../../models/Result';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    let {orderName,limit, nextKey} = event.queryStringParameters;
    if (!nextKey) {
      nextKey = undefined;
    } else {
      const uriDecoded = decodeURIComponent(nextKey)
      nextKey =  JSON.parse(uriDecoded)
    }
    const result:Result = await getOrdersForUser(userId, orderName, parseInt(limit),nextKey)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
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
