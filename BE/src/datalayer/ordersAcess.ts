import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DeleteItemInput, PutItemInput, QueryInput, UpdateItemInput } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { OrderItem } from '../models/OrderItem'
import { OrderUpdate } from '../models/OrderUpdate';
import { CreateOrderRequest } from '../requests/CreateOrderRequest'
import { UpdateOrderRequest } from '../requests/UpdateOrderRequest'
import { v4 as uuidv4 } from 'uuid';
import { Result } from '../models/Result'
const XAWS = AWSXRay.captureAWS(AWS);
const S3 = new XAWS.S3({
  signatureVersion: 'v4'
});
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const logger = createLogger('ordersAccess');
// const isOffline = process.env.IS_OFFLINE;

export class OrdersAccess {


  constructor(
    private readonly docClient = createDynamoDBClient(),
    private readonly orderTable = process.env.ORDERS_TABLE,
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET
  ) { }
  /**
   * Get a orders from user
   * @param event an event from API Gateway
   *
   * @returns a user id from a JWT token
   */
  async getOrdersForUser(userId: string, orderName: string , limit: number, nextKey: any, ): Promise<Result> {
    logger.info('Query all orders' + userId);
    const param: QueryInput = {
      KeyConditions: {
        "userId": {
          AttributeValueList: [
            { "S": userId }
          ],
          ComparisonOperator: "EQ"
        }
      },
      Limit: limit,
      ExclusiveStartKey: nextKey,
      TableName: this.orderTable,
    }
    if (orderName && orderName.trim() != '') {
      param.ExpressionAttributeValues = {
        ':orderName': { S: orderName }
      };
      param.ExpressionAttributeNames = {
        "#name": "name"
      }
      param.FilterExpression = 'contains (#name, :orderName)';
    }
    try {
      const result = await this.docClient.query(param).promise();
      logger.info('response query', result);
      const {LastEvaluatedKey, Items} = result;
      const orders = Items.map(data => {
        return {
          name: AWS.DynamoDB.Converter.output(data["name"]),
          createdAt: AWS.DynamoDB.Converter.output(data["createdAt"]),
          orderId: AWS.DynamoDB.Converter.output(data["orderId"]),
          dueDate: AWS.DynamoDB.Converter.output(data["dueDate"]),
          attachmentUrl: AWS.DynamoDB.Converter.output(data["attachmentUrl"]),
          description:AWS.DynamoDB.Converter.output(data["description"])
        };
      })
      return {
        nextKey: LastEvaluatedKey? encodeURIComponent(JSON.stringify(LastEvaluatedKey)):null,
        orders: orders as OrderItem[]
      };
    } catch (error) {
      logger.error
        ('error query: ', error);
      return {nextKey:'',orders:[]};
    }

  }

  /**
   * Get a orders from user
   * @param event an event from API Gateway
   *
   * @returns a user id from a JWT token
   */
  async createOrder(userId: string, createOrderRequest: CreateOrderRequest): Promise<any> {
    console.log('Create order', createOrderRequest);
    const createAt = new Date()
    const orderId = uuidv4()
    const param: PutItemInput = {
      Item: {
        "createdAt": { "S": createAt.toUTCString() },
        "name": { "S": createOrderRequest.name },
        "attachmentUrl": { "S": createOrderRequest.attachmentUrl ?? '' },
        "userId": { "S": userId },
        "description":{"S":createOrderRequest.description ?? ''},
        "orderId": { "S": orderId },
        "done": { "BOOL": false }
      },
      TableName: this.orderTable
    }
    await this.docClient.putItem(param).promise();
    return {
      name: createOrderRequest.name,
      orderId: orderId
    } as OrderItem;
  }

  /**
   * Update a order By Key
   * @param event an event from API Gateway
   *
   * @returns order 
   */
  async updateOrder(userId: string, orderId: string, updateorderRequest: UpdateOrderRequest): Promise<OrderUpdate> {
    logger.info('data update', updateorderRequest);
    const param: UpdateItemInput = {
      Key: {
        "orderId": {
          "S": orderId
        },
        "userId": {
          "S": userId
        }
      },
      AttributeUpdates: {
        "name": {
          "Value": {
            "S": updateorderRequest.name
          }
        },
        "attachmentUrl": {
          "Value": {
            "S": updateorderRequest.attachmentUrl ?? ''
          }
        },
        "description":{"Value":{"S":updateorderRequest.description ?? ''}},
      },
      TableName: this.orderTable
    }
    const result = await this.docClient.updateItem(param).promise();
    logger.info('ressponse after update', updateorderRequest);
    return result.$response.data as OrderUpdate;
  }


  /**
   * Delete a order By Key
   * @param event an event from API Gateway
   *
   * @returns order 
   */
  async deleteOrder(userId: string, orderId: string): Promise<string> {

    const param: DeleteItemInput = {
      Key: {
        "orderId": {
          "S": orderId
        },
        "userId": {
          "S": userId
        }
      },
      TableName: this.orderTable
    }
    await this.docClient.deleteItem(param).promise();
    return '';
  }

  /**
   * Delete a order By Key
   * @param event an event from API Gateway
   *
   * @returns order 
   */
  async createAttachmentPresignedUrl(userId: string, orderId: string): Promise<string> {
    logger.info('get URL updload' + userId);
    try {

      let attachmentUrl = S3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: orderId,
        Expires: Number(urlExpiration)
      });
      logger.info('url ' + attachmentUrl);
      const param: UpdateItemInput = {
        Key: {
          "orderId": {
            "S": orderId
          },
          "userId": {
            "S": userId
          }
        },
        AttributeUpdates: {

          "attachmentUrl": {
            "Value": {
              "S": `https://${this.bucketName}.s3.amazonaws.com/${orderId}`
            }
          }
        },
        TableName: this.orderTable
      }
      await this.docClient.updateItem(param).promise();
      return attachmentUrl;
    } catch (error) {
      logger.error('get url error', error);
      return '';
    }

  }
}
function createDynamoDBClient() {
  // if (isOffline) {
  //   console.log('Creating a local dynamoDB instance')
  //   return new AWS.DynamoDB({
  //     region: 'localhost',
  //     endpoint: 'http://localhost:8001'
  //   });
  // }
  logger.info('create DB');
  try {
    let db = new XAWS.DynamoDB();
    return db;
  } catch (error) {
    logger.error('error Create DB', error);
    return null;
  }
}