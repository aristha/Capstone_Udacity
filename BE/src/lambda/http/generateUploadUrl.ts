import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { createAttachmentPresignedUrl } from '../../businessLogic/orders'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const orderId = event.pathParameters.orderId;
    const userId = getUserId(event)
    const uploadUrl = await createAttachmentPresignedUrl(userId, orderId);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(
        {
          uploadUrl: uploadUrl
        }
      )
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
